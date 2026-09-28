/* ============================================================
   THE SLEEK — seasonal offers (Google Sheet) + "Rate us" card
   Reads a published Google Sheet (CSV), shows only offers that
   are switched on and not expired, and lets customers claim them
   onto their ticket. No backend needed.
   ============================================================ */
(function () {
  "use strict";

  var CACHE_KEY = "sleek_offers_cache_v1";
  var MAX_OFFERS = 8;

  // ---------- small helpers ----------
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function money(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  }
  function num(v) {
    var n = parseFloat(String(v == null ? "" : v).replace(/[^0-9.]/g, ""));
    return isFinite(n) ? n : 0;
  }
  function normKey(k) {
    return String(k || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  // ---------- CSV parsing (handles quotes, commas, line breaks) ----------
  function parseCSV(text) {
    var rows = [], row = [], cur = "", q = false;
    text = String(text || "").replace(/^\uFEFF/, "");
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') {
          if (text[i + 1] === '"') { cur += '"'; i++; } else { q = false; }
        } else { cur += c; }
      } else if (c === '"') { q = true; }
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cur); cur = ""; rows.push(row); row = [];
      } else { cur += c; }
    }
    if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
    return rows;
  }

  // Header names the owner might type -> our field names
  var ALIASES = {
    title: ["title", "offer", "offername", "name"],
    description: ["description", "details", "desc", "about"],
    price: ["price", "offerprice", "nowprice", "specialprice"],
    original: ["originalprice", "mrp", "oldprice", "wasprice", "normalprice"],
    badge: ["badge", "tag", "label", "season", "occasion"],
    valid: ["validtill", "validuntil", "expiry", "expires", "enddate", "ends", "till", "validthru"],
    show: ["show", "active", "visible", "live"],
  };

  function rowsToOffers(rows) {
    if (!rows.length) return [];
    var header = rows[0].map(normKey);
    var idx = {};
    Object.keys(ALIASES).forEach(function (field) {
      for (var i = 0; i < header.length; i++) {
        if (ALIASES[field].indexOf(header[i]) !== -1) { idx[field] = i; break; }
      }
    });
    if (idx.title === undefined) return [];
    var out = [];
    for (var r = 1; r < rows.length; r++) {
      var cells = rows[r];
      var get = function (f) {
        return idx[f] === undefined ? "" : String(cells[idx[f]] || "").trim();
      };
      out.push({
        title: get("title"),
        description: get("description"),
        price: num(get("price")),
        original: num(get("original")),
        badge: get("badge"),
        valid: get("valid"),
        show: get("show"),
      });
    }
    return out;
  }

  // ---------- dates ----------
  function parseEnd(s) {
    s = String(s || "").trim();
    if (!s) return null;
    var m = s.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3], 23, 59, 59);
    m = s.match(/^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{2,4})/);
    if (m) {
      var y = +m[3]; if (y < 100) y += 2000;
      return new Date(y, +m[2] - 1, +m[1], 23, 59, 59); // day/month/year (India)
    }
    var t = Date.parse(s);
    if (!isNaN(t)) { var d = new Date(t); d.setHours(23, 59, 59, 0); return d; }
    return null;
  }

  function isHidden(v) {
    return /^(no|n|false|0|hide|off|inactive)$/i.test(String(v || "").trim());
  }

  function liveOffers(list) {
    var now = new Date();
    return list
      .filter(function (o) {
        if (!o.title) return false;
        if (isHidden(o.show)) return false;
        var end = parseEnd(o.valid);
        if (end && end < now) return false;
        return true;
      })
      .slice(0, MAX_OFFERS);
  }

  function validityText(o) {
    var end = parseEnd(o.valid);
    if (!end) return { text: "Available now", soon: false };
    var days = Math.ceil((end - new Date()) / 86400000);
    if (days <= 0) return { text: "Ends today", soon: true };
    if (days === 1) return { text: "Ends tomorrow", soon: true };
    if (days <= 5) return { text: "Ends in " + days + " days", soon: true };
    var label = end.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    return { text: "Valid till " + label, soon: false };
  }

  // ---------- render ----------
  var SPARK =
    '<svg class="offer-spark" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4l4.6 14.2L51 23l-14.4 4.8L32 42l-4.6-14.2L13 23l14.4-4.8L32 4Z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M50 40l1.8 5.2L57 47l-5.2 1.8L50 54l-1.8-5.2L43 47l5.2-1.8L50 40Z" fill="none" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/></svg>';

  function cardHTML(o, i) {
    var v = validityText(o);
    var hasPrice = o.price > 0;
    var hasWas = hasPrice && o.original > o.price;
    var pct = hasWas ? Math.round((1 - o.price / o.original) * 100) : 0;

    return (
      '<article class="offer-card" style="--i:' + i + '">' +
        '<div class="offer-inner">' +
          SPARK +
          '<div class="offer-top">' +
            (o.badge ? '<span class="offer-badge">' + esc(o.badge) + "</span>" : "<span></span>") +
            (pct > 0 ? '<span class="offer-pct">' + pct + "% off</span>" : "") +
          "</div>" +
          '<h3 class="offer-title">' + esc(o.title) + "</h3>" +
          (o.description ? '<p class="offer-desc">' + esc(o.description) + "</p>" : "") +
          '<div class="offer-price-row">' +
            (hasPrice
              ? '<span class="offer-price">' + money(o.price) + "</span>" +
                (hasWas ? '<span class="offer-was">' + money(o.original) + "</span>" : "")
              : '<span class="offer-price offer-price--text">Special offer</span>') +
          "</div>" +
          '<div class="offer-foot">' +
            '<span class="offer-valid' + (v.soon ? " is-soon" : "") + '"><i></i>' + esc(v.text) + "</span>" +
            '<button type="button" class="offer-claim" data-i="' + i + '">' +
              (hasPrice ? "Add to ticket" : "Claim offer") +
            "</button>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  var current = [];

  function renderOffers(list) {
    var section = document.getElementById("offers");
    var track = document.getElementById("offersTrack");
    if (!section || !track) return;

    current = liveOffers(list || []);
    if (!current.length) {
      section.hidden = true;
      return;
    }
    track.innerHTML = current.map(cardHTML).join("");
    section.hidden = false;
    section.classList.remove("is-loading");
    updateArrows();
  }

  function showSkeleton() {
    var section = document.getElementById("offers");
    var track = document.getElementById("offersTrack");
    if (!section || !track) return;
    track.innerHTML =
      '<div class="offer-card offer-skel"></div><div class="offer-card offer-skel"></div><div class="offer-card offer-skel"></div>';
    section.classList.add("is-loading");
    section.hidden = false;
  }

  function updateArrows() {
    var track = document.getElementById("offersTrack");
    var prev = document.getElementById("offersPrev");
    var next = document.getElementById("offersNext");
    if (!track || !prev || !next) return;
    var overflow = track.scrollWidth > track.clientWidth + 8;
    prev.hidden = next.hidden = !overflow;
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  }

  // ---------- data loading ----------
  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function writeCache(list) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(list)); } catch (e) {}
  }

  // Accepts a "Publish to web" CSV link, or a normal Google Sheet link
  // (…/spreadsheets/d/<ID>/edit…, shared as "Anyone with the link: Viewer").
  function normalizeSheetUrl(u) {
    u = String(u).trim();
    if (/\/pub\?|output=csv|tqx=out:csv/.test(u)) return u;
    var m = u.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    if (!m) return u;
    var g = u.match(/[#&?]gid=(\d+)/);
    return "https://docs.google.com/spreadsheets/d/" + m[1] + "/gviz/tq?tqx=out:csv" + (g ? "&gid=" + g[1] : "");
  }

  function loadOffers() {
    var params = new URLSearchParams(location.search);
    if (params.get("demo") === "offers" && typeof SAMPLE_OFFERS !== "undefined") {
      renderOffers(SAMPLE_OFFERS);
      return;
    }

    var url = typeof OFFERS_CONFIG !== "undefined" ? OFFERS_CONFIG.sheetCsvUrl : "";
    if (!url) {
      if (OFFERS_CONFIG.previewSamples && typeof SAMPLE_OFFERS !== "undefined") renderOffers(SAMPLE_OFFERS);
      return; // no sheet linked: section stays hidden unless previewing
    }
    url = normalizeSheetUrl(url);

    var cached = readCache();
    if (cached) renderOffers(cached);
    else showSkeleton();

    var bust = url + (url.indexOf("?") === -1 ? "?" : "&") + "t=" + Date.now();
    fetch(bust, { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("sheet " + r.status);
        return r.text();
      })
      .then(function (text) {
        var list = rowsToOffers(parseCSV(text));
        writeCache(list);
        renderOffers(list);
      })
      .catch(function () {
        // offline or sheet unreachable: keep whatever we already showed
        if (!cached) {
          var s = document.getElementById("offers");
          if (s) s.hidden = true;
        }
      });
  }

  // ---------- "Rate us" card ----------
  var STAR =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.9-4.6 4.5 1.1 6.4L12 17.4l-5.7 3.1 1.1-6.4L2.8 9.6l6.4-.9L12 2.8Z"/></svg>';

  function renderReview(mount) {
    if (!mount || typeof REVIEW === "undefined" || !REVIEW.url) return;
    mount.innerHTML =
      '<div class="review-card">' +
        '<div class="review-copy">' +
          '<p class="review-eyebrow">Rate us</p>' +
          '<h3 class="review-title">Loved your visit?</h3>' +
          '<div class="review-stars" aria-label="5 stars">' + STAR + STAR + STAR + STAR + STAR + "</div>" +
          '<p class="review-text">A quick Google review means the world to a small salon like ours. Scan the code with your phone, or tap the button.</p>' +
          '<a class="review-btn" href="' + esc(REVIEW.url) + '" target="_blank" rel="noopener">Leave a Google review</a>' +
        "</div>" +
        '<div class="review-qr">' +
          '<img src="' + esc(REVIEW.qr) + '" alt="QR code to review The Sleek on Google" width="164" height="164" loading="lazy" />' +
          "<span>Scan to review</span>" +
        "</div>" +
      "</div>";
  }

  // ---------- wire up ----------
  function init() {
    var track = document.getElementById("offersTrack");

    if (track) {
      track.addEventListener("click", function (e) {
        var btn = e.target.closest ? e.target.closest(".offer-claim") : null;
        if (!btn) return;
        var o = current[+btn.getAttribute("data-i")];
        if (!o || !window.SleekApp) return;
        window.SleekApp.addToCart("Offer", o.title, "", o.price > 0 ? o.price : 0);
        var old = btn.textContent;
        btn.textContent = "Added ✓";
        btn.classList.add("is-added");
        setTimeout(function () {
          btn.textContent = old;
          btn.classList.remove("is-added");
        }, 1600);
      });
      track.addEventListener("scroll", updateArrows, { passive: true });
      window.addEventListener("resize", updateArrows);
    }

    var prev = document.getElementById("offersPrev");
    var next = document.getElementById("offersNext");
    function step(dir) {
      var card = track && track.querySelector(".offer-card");
      var w = card ? card.getBoundingClientRect().width + 16 : 320;
      track.scrollBy({ left: dir * w, behavior: "smooth" });
    }
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });

    renderReview(document.getElementById("reviewMountMenu"));
    renderReview(document.getElementById("reviewMountStory"));
    loadOffers();

    // refresh when the tablet is picked up again after sitting idle
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) loadOffers();
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
