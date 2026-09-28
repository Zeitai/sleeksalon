/* ============================================================
   THE SLEEK — app logic
   Everything persists to localStorage. No backend, no build step.
   ============================================================ */

(function () {
  "use strict";

  const LS_TICKET = "sleek_current_ticket";
  const LS_HISTORY = "sleek_ticket_history";
  const CUR = SALON.currency;

  // ---------- decorative line-art icons (salon feel, no stock imagery) ----------
  const CAT_ICON = {
    men: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 4v6a6 6 0 0 0 12 0V4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M6 4h3M15 4h3M12 16v4M9 20h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    women: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3c-4 0-6 3-6 7 0 5 2 8 2 8h8s2-3 2-8c0-4-2-7-6-7Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M9 8c1 1 5 1 6 0" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    common: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3l1.6 4.9L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.1L12 3Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/></svg>`,
  };

  const SECTION_ICON = {
    "Hair Services": `<svg viewBox="0 0 24 24" fill="none"><circle cx="6" cy="6" r="2.6" stroke="currentColor" stroke-width="1.3"/><circle cx="6" cy="18" r="2.6" stroke="currentColor" stroke-width="1.3"/><path d="M8 7.8 20 19M8 16.2 20 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    "Hair Colour": `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3c3.5 3.8 6 7 6 10a6 6 0 1 1-12 0c0-3 2.5-6.2 6-10Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
    "Nail Extensions": `<svg viewBox="0 0 24 24" fill="none"><rect x="8" y="3" width="8" height="12" rx="4" stroke="currentColor" stroke-width="1.3"/><path d="M9 15h6v3a3 3 0 0 1-6 0v-3Z" stroke="currentColor" stroke-width="1.2"/></svg>`,
    "Waxing": `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3c3 4 6 7.8 6 11.2A6 6 0 0 1 6 14.2C6 10.8 9 7 12 3Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`,
    "Bleach / D-Tan": `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.3"/><path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.1 5.9l-1.6 1.6M7.5 16.5l-1.6 1.6M18.1 18.1l-1.6-1.6M7.5 7.5 5.9 5.9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    "Facial": `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3c-3.5 0-6 3.6-6 8s2.8 8.5 6 8.5 6-4.1 6-8.5-2.5-8-6-8Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M9.5 11h.01M14.5 11h.01M9.5 15c1 1 4 1 5 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`,
    "Mehendi": `<svg viewBox="0 0 24 24" fill="none"><path d="M12 21c-4-2.6-7-5.6-7-9.6C5 7 8 4 12 3c4 1 7 4 7 8.4 0 4-3 7-7 9.6Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><circle cx="12" cy="10" r="1.6" stroke="currentColor" stroke-width="1"/></svg>`,
    "Makeup & Hairstyle": `<svg viewBox="0 0 24 24" fill="none"><path d="M9 3h6l-1 6H10L9 3Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M10 9h4l1 9a3 3 0 0 1-6 0l1-9Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
    "Manicure / Pedicure": `<svg viewBox="0 0 24 24" fill="none"><path d="M5 13c0-4 2-8 5-8s5 4 5 8-2 7-5 7-5-3-5-7Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M15 9c1.6.6 3 2.6 3 5.4 0 2.7-1.6 4.6-3.4 4.9" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>`,
  };

  // ---------- state ----------
  let activeCategory = Object.keys(MENU)[0];
  let cart = loadCurrentTicket(); // { key: {name, section, variant, price, qty} }
  let searchTerm = "";
  let bookingsSearchTerm = "";

  // ---------- helpers ----------
  function fmt(n) {
    return CUR + Number(n).toLocaleString("en-IN");
  }
  function keyFor(section, name, variant) {
    return [section, name, variant || ""].join("::");
  }
  function loadCurrentTicket() {
    try {
      const raw = localStorage.getItem(LS_TICKET);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }
  function saveCurrentTicket() {
    localStorage.setItem(LS_TICKET, JSON.stringify(cart));
  }
  function loadHistory() {
    try {
      const raw = localStorage.getItem(LS_HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
  function saveHistory(list) {
    localStorage.setItem(LS_HISTORY, JSON.stringify(list));
  }
  function cartCount() {
    return Object.values(cart).reduce((s, i) => s + i.qty, 0);
  }
  function cartTotal() {
    return Object.values(cart).reduce((s, i) => s + i.qty * i.price, 0);
  }
  function showToast(msg, ms) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.remove("show"), ms || 1800);
  }

  // ---------- owner notification (Telegram via /api/notify) ----------
  async function sendToOwner(record) {
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: record.id,
          name: record.client,
          phone: record.phone,
          items: record.items.map((i) => ({
            name: i.name,
            section: i.section,
            variant: i.variant || "",
            price: i.price,
            qty: i.qty,
          })),
        }),
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  }

  function markNotified(id) {
    const list = loadHistory();
    const rec = list.find((r) => r.id === id);
    if (rec) {
      rec.notified = true;
      saveHistory(list);
    }
  }

  // Re-send any tickets that failed earlier (e.g. bad connection)
  let retrying = false;
  async function retryUnsent() {
    if (retrying) return;
    retrying = true;
    try {
      const pending = loadHistory().filter((r) => r.notified === false);
      for (const rec of pending) {
        if (await sendToOwner(rec)) markNotified(rec.id);
      }
    } finally {
      retrying = false;
    }
  }

  // ---------- rendering: tabs ----------
  function renderTabs() {
    const tabs = document.getElementById("tabs");
    tabs.innerHTML = "";
    Object.keys(MENU).forEach((catKey) => {
      const cat = MENU[catKey];
      const btn = document.createElement("button");
      btn.className = "tab-btn" + (catKey === activeCategory ? " active" : "");
      btn.innerHTML = (CAT_ICON[cat.icon] || "") + `<span>${cat.label}</span>`;
      btn.setAttribute("role", "tab");
      btn.addEventListener("click", () => {
        activeCategory = catKey;
        searchTerm = "";
        document.getElementById("searchInput").value = "";
        renderTabs();
        renderMenu();
      });
      tabs.appendChild(btn);
    });
  }

  // ---------- rendering: menu ----------
  function renderMenu() {
    const root = document.getElementById("menuContent");
    const emptyState = document.getElementById("emptyState");
    root.innerHTML = "";

    const term = searchTerm.trim().toLowerCase();
    let anyResults = false;

    // when searching, look across all categories; otherwise just the active one
    const categoriesToShow = term ? Object.keys(MENU) : [activeCategory];

    categoriesToShow.forEach((catKey) => {
      const cat = MENU[catKey];
      cat.sections.forEach((section) => {
        const items = section.items.filter((it) =>
          !term || it.name.toLowerCase().includes(term)
        );
        if (!items.length) return;
        anyResults = true;

        const sec = document.createElement("div");
        sec.className = "section";

        const head = document.createElement("div");
        head.className = "section-head";
        const titleWrap = document.createElement("div");
        titleWrap.className = "section-title-wrap";
        const icon = SECTION_ICON[section.title];
        if (icon) {
          const iconSpan = document.createElement("span");
          iconSpan.className = "section-icon";
          iconSpan.innerHTML = icon;
          titleWrap.appendChild(iconSpan);
        }
        const h = document.createElement("h2");
        h.className = "section-title";
        h.textContent = term ? `${cat.label} — ${section.title}` : section.title;
        titleWrap.appendChild(h);
        head.appendChild(titleWrap);
        if (section.note) {
          const note = document.createElement("span");
          note.className = "section-note";
          note.textContent = section.note;
          head.appendChild(note);
        }
        sec.appendChild(head);

        const grid = document.createElement("div");
        grid.className = "card-grid";

        items.forEach((item) => {
          grid.appendChild(
            section.kind === "variant"
              ? buildVariantCard(section, item)
              : buildSingleCard(section, item)
          );
        });

        sec.appendChild(grid);
        root.appendChild(sec);
      });
    });

    emptyState.hidden = anyResults;
  }

  function buildSingleCard(section, item) {
    const card = document.createElement("div");
    card.className = "svc-card";
    const k = keyFor(section.title, item.name, "");

    card.innerHTML = `
      <div class="svc-name">${item.name}</div>
      <div class="svc-row">
        <span class="svc-price">${fmt(item.price)}</span>
        <button class="add-btn" data-key="${k}">
          <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <span>${cart[k] ? "Added · " + cart[k].qty : "Add"}</span>
        </button>
      </div>
    `;
    const btn = card.querySelector(".add-btn");
    if (cart[k]) btn.classList.add("added");
    btn.addEventListener("click", () => {
      addToCart(section.title, item.name, "", item.price);
      renderMenu();
      renderTicket();
    });
    return card;
  }

  function buildVariantCard(section, item) {
    const card = document.createElement("div");
    card.className = "svc-card";
    card.innerHTML = `<div class="svc-name">${item.name}</div>`;
    const list = document.createElement("div");
    list.className = "variant-list";

    section.variants.forEach((variant, idx) => {
      const price = item.prices[idx];
      const k = keyFor(section.title, item.name, variant);
      const row = document.createElement("div");
      row.className = "variant-row";
      row.innerHTML = `
        <span class="variant-label">${variant}</span>
        <button class="variant-price-btn" data-key="${k}">
          ${fmt(price)}
          <span class="plus">+</span>
        </button>
      `;
      const btn = row.querySelector(".variant-price-btn");
      if (cart[k]) btn.classList.add("added");
      btn.addEventListener("click", () => {
        addToCart(section.title, item.name, variant, price);
        renderMenu();
        renderTicket();
      });
      list.appendChild(row);
    });

    card.appendChild(list);
    return card;
  }

  function addToCart(section, name, variant, price) {
    const k = keyFor(section, name, variant);
    if (cart[k]) {
      cart[k].qty += 1;
    } else {
      cart[k] = { name, section, variant, price, qty: 1 };
    }
    saveCurrentTicket();
    updateTicketCount();
    showToast(`Added ${name}${variant ? " (" + variant + ")" : ""}`);
  }

  function updateTicketCount() {
    const c = cartCount();
    document.getElementById("ticketCount").textContent = c;
    const navBadgeHost = document.getElementById("navTicket");
    let badge = navBadgeHost.querySelector(".nav-badge");
    if (c > 0) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "nav-badge";
        navBadgeHost.appendChild(badge);
      }
      badge.textContent = c;
    } else if (badge) {
      badge.remove();
    }
  }

  // ---------- ticket drawer ----------
  function renderTicket() {
    const list = document.getElementById("ticketList");
    const emptyMsg = document.getElementById("ticketEmptyMsg");
    const entries = Object.entries(cart);

    list.querySelectorAll(".ticket-item").forEach((n) => n.remove());
    emptyMsg.hidden = entries.length > 0;

    entries.forEach(([k, item]) => {
      const row = document.createElement("div");
      row.className = "ticket-item";
      row.innerHTML = `
        <div class="ti-info">
          <span class="ti-name">${item.name}</span>
          <span class="ti-meta">${item.section}${item.variant ? " · " + item.variant : ""}</span>
        </div>
        <div class="ti-right">
          <div class="qty-stepper">
            <button data-act="dec" aria-label="Decrease">−</button>
            <span>${item.qty}</span>
            <button data-act="inc" aria-label="Increase">+</button>
          </div>
          <span class="ti-price">${fmt(item.qty * item.price)}</span>
          <button class="ti-remove" data-act="remove" aria-label="Remove">
            <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </div>
      `;
      row.querySelector('[data-act="inc"]').addEventListener("click", () => {
        cart[k].qty += 1;
        saveCurrentTicket();
        renderTicket();
        renderMenu();
        updateTicketCount();
      });
      row.querySelector('[data-act="dec"]').addEventListener("click", () => {
        cart[k].qty -= 1;
        if (cart[k].qty <= 0) delete cart[k];
        saveCurrentTicket();
        renderTicket();
        renderMenu();
        updateTicketCount();
      });
      row.querySelector('[data-act="remove"]').addEventListener("click", () => {
        delete cart[k];
        saveCurrentTicket();
        renderTicket();
        renderMenu();
        updateTicketCount();
      });
      list.appendChild(row);
    });

    document.getElementById("ticketTotal").textContent = fmt(cartTotal());
  }

  function openDrawer() {
    document.getElementById("ticketDrawer").classList.add("open");
    document.getElementById("scrim").classList.add("show");
  }
  function closeDrawer() {
    document.getElementById("ticketDrawer").classList.remove("open");
    document.getElementById("scrim").classList.remove("show");
  }

  // ---------- save ticket to history ----------
  function saveTicket() {
    const entries = Object.entries(cart);
    if (!entries.length) {
      showToast("Add at least one service first");
      return;
    }
    const name = document.getElementById("clientName").value.trim();
    if (!name) {
      showToast("Enter the client's name");
      document.getElementById("clientName").focus();
      return;
    }
    const phone = document.getElementById("clientPhone").value.trim();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      showToast("Enter a valid 10-digit phone number");
      document.getElementById("clientPhone").focus();
      return;
    }

    const record = {
      id: "t_" + Date.now(),
      client: name,
      phone,
      items: entries.map(([, item]) => ({ ...item })),
      total: cartTotal(),
      createdAt: new Date().toISOString(),
      notified: false,
    };

    const history = loadHistory();
    history.unshift(record);
    saveHistory(history);

    cart = {};
    saveCurrentTicket();
    document.getElementById("clientName").value = "";
    document.getElementById("clientPhone").value = "";
    renderTicket();
    renderMenu();
    updateTicketCount();
    closeDrawer();
    showToast(`Thank you ${name}! The salon has received your request.`, 3500);

    sendToOwner(record).then((ok) => {
      if (ok) markNotified(record.id);
      else showToast("Saved, but couldn't reach the salon. Will retry.", 3500);
    });
  }

  function clearTicket() {
    if (!Object.keys(cart).length) return;
    if (!confirm("Clear the current ticket?")) return;
    cart = {};
    saveCurrentTicket();
    renderTicket();
    renderMenu();
    updateTicketCount();
  }

  // ---------- history / "My Bookings" view ----------
  function renderHistory() {
    const history = loadHistory();
    const listEl = document.getElementById("historyList");
    const statsEl = document.getElementById("statsRow");
    listEl.innerHTML = "";

    const today = new Date().toDateString();
    const todayRecords = history.filter(
      (r) => new Date(r.createdAt).toDateString() === today
    );
    const todayTotal = todayRecords.reduce((s, r) => s + r.total, 0);

    statsEl.innerHTML = `
      <div class="stat-card"><div class="stat-num">${todayRecords.length}</div><div class="stat-label">Bookings today</div></div>
      <div class="stat-card"><div class="stat-num">${fmt(todayTotal)}</div><div class="stat-label">Revenue today</div></div>
      <div class="stat-card"><div class="stat-num">${history.length}</div><div class="stat-label">All-time bookings</div></div>
    `;

    if (!history.length) {
      listEl.innerHTML = `<p class="hist-empty">No bookings saved yet. Build a ticket from the menu and tap “Save ticket”.</p>`;
      return;
    }

    const term = bookingsSearchTerm.trim().toLowerCase();
    const filtered = term
      ? history.filter(
          (r) =>
            r.client.toLowerCase().includes(term) ||
            (r.phone || "").toLowerCase().includes(term)
        )
      : history;

    if (!filtered.length) {
      listEl.innerHTML = `<p class="hist-empty">No bookings match “${bookingsSearchTerm}”.</p>`;
      return;
    }

    filtered.forEach((r) => {
      const card = document.createElement("div");
      card.className = "hist-card";
      const date = new Date(r.createdAt);
      const itemsSummary = r.items
        .map((i) => `${i.name}${i.variant ? " (" + i.variant + ")" : ""} ×${i.qty}`)
        .join(", ");
      card.innerHTML = `
        <div class="hist-top">
          <div>
            <div class="hist-client">${r.client}${r.phone ? " · " + r.phone : ""}</div>
            <div class="hist-date">${date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
          </div>
          <div class="hist-total">${fmt(r.total)}</div>
        </div>
        <div class="hist-items">${itemsSummary}</div>
        <div class="hist-actions">
          <button data-act="reorder">Reorder</button>
          <button data-act="del" class="del">Delete</button>
        </div>
      `;
      card.querySelector('[data-act="reorder"]').addEventListener("click", () => {
        r.items.forEach((i) => addToCart(i.section, i.name, i.variant, i.price));
        renderMenu();
        renderTicket();
        updateTicketCount();
        closeFullviews();
        openDrawer();
        showToast("Items added to current ticket");
      });
      card.querySelector('[data-act="del"]').addEventListener("click", () => {
        if (!confirm("Delete this saved ticket?")) return;
        const updated = loadHistory().filter((x) => x.id !== r.id);
        saveHistory(updated);
        renderHistory();
      });
      listEl.appendChild(card);
    });
  }

  // ---------- "Our Story" view ----------
  function renderStory() {
    const body = document.getElementById("storyBody");
    if (!body || typeof STORY === "undefined") return;

    const milestones = (STORY.milestones || [])
      .map(
        (m) => `
        <div class="milestone">
          <span class="milestone-year">${m.year}</span>
          <span class="milestone-label">${m.label}</span>
        </div>`
      )
      .join("");

    const values = (STORY.values || [])
      .map(
        (v) => `
        <div class="value-card">
          <h3>${v.title}</h3>
          <p>${v.detail}</p>
        </div>`
      )
      .join("");

    const paragraphs = (STORY.paragraphs || [])
      .map((p) => `<p>${p}</p>`)
      .join("");

    const storyArt = `
      <div class="story-art-frame">
        <img class="story-art" src="images/story-salon.jpg" alt="The Sleek salon interior" loading="lazy" onerror="this.closest('.story-art-frame').remove()" />
      </div>`;

    body.innerHTML = `
      <section class="story-hero">
        ${storyArt}
        <p class="story-eyebrow">${STORY.eyebrow || "Our story"}</p>
        <h1 class="story-title">${STORY.title || ""}</h1>
        <p class="story-intro">${STORY.intro || ""}</p>
      </section>

      <section class="story-copy">${paragraphs}</section>

      ${
        STORY.quote
          ? `<blockquote class="story-quote"><span>“${STORY.quote}”</span></blockquote>`
          : ""
      }

      ${
        milestones
          ? `<section class="story-section">
              <h2 class="story-section-title">How we got here</h2>
              <div class="milestone-list">${milestones}</div>
            </section>`
          : ""
      }

      ${
        values
          ? `<section class="story-section">
              <h2 class="story-section-title">What we hold onto</h2>
              <div class="value-grid">${values}</div>
            </section>`
          : ""
      }
    `;
  }

  // ---------- studio credit / footer ----------
  function initFooterCredit() {
    document.querySelectorAll(".footer-year").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
    if (typeof STUDIO_CREDIT === "undefined") return;
    document.querySelectorAll('a[id^="studioLink"]').forEach((a) => {
      a.textContent = STUDIO_CREDIT.name;
      a.href = STUDIO_CREDIT.url;
    });
  }

  // ---------- CSV export ----------
  function exportCsv() {
    const history = loadHistory();
    if (!history.length) {
      showToast("No tickets to export yet");
      return;
    }
    const rows = [["Ticket ID", "Client", "Phone", "Date", "Service", "Variant", "Qty", "Price", "Line total", "Ticket total"]];
    history.forEach((r) => {
      r.items.forEach((i) => {
        rows.push([
          r.id, r.client, r.phone, r.createdAt, i.name, i.variant || "", i.qty, i.price, i.qty * i.price, r.total,
        ]);
      });
    });
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `the-sleek-tickets-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function csvEscape(val) {
    const s = String(val ?? "");
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function resetAll() {
    if (!confirm("Delete ALL saved tickets from this device? This cannot be undone.")) return;
    localStorage.removeItem(LS_HISTORY);
    renderHistory();
    showToast("All tickets deleted");
  }

  // ---------- view switching ----------
  function closeFullviews() {
    document.getElementById("historyView").hidden = true;
    document.getElementById("storyView").hidden = true;
    document.getElementById("settingsView").hidden = true;
  }
  function setActiveNav(view) {
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });
  }
  function goToView(view) {
    closeDrawer();
    closeFullviews();
    setActiveNav(view);
    if (view === "menu") {
      // nothing extra
    } else if (view === "ticket") {
      openDrawer();
      setActiveNav("menu");
    } else if (view === "history") {
      renderHistory();
      document.getElementById("historyView").hidden = false;
    } else if (view === "story") {
      document.getElementById("storyView").hidden = false;
    } else if (view === "settings") {
      document.getElementById("settingsView").hidden = false;
    }
  }

  // ---------- wire up ----------
  function init() {
    renderTabs();
    renderMenu();
    renderTicket();
    renderStory();
    updateTicketCount();
    initFooterCredit();

    document.getElementById("searchInput").addEventListener("input", (e) => {
      searchTerm = e.target.value;
      renderMenu();
    });

    const bookingsSearch = document.getElementById("bookingsSearch");
    if (bookingsSearch) {
      bookingsSearch.addEventListener("input", (e) => {
        bookingsSearchTerm = e.target.value;
        renderHistory();
      });
    }

    document.getElementById("openTicket").addEventListener("click", openDrawer);
    document.getElementById("closeTicket").addEventListener("click", closeDrawer);
    document.getElementById("scrim").addEventListener("click", () => {
      closeDrawer();
      closeFullviews();
    });

    document.getElementById("saveTicket").addEventListener("click", saveTicket);
    window.addEventListener("online", retryUnsent);
    retryUnsent();
    document.getElementById("clearTicket").addEventListener("click", clearTicket);

    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.addEventListener("click", () => goToView(btn.dataset.view));
    });
    document.querySelectorAll("[data-close-view]").forEach((btn) => {
      btn.addEventListener("click", () => goToView("menu"));
    });

    document.getElementById("exportCsv").addEventListener("click", exportCsv);
    document.getElementById("resetAll").addEventListener("click", resetAll);

    // set salon name/tagline from data.js in case it was customised
    document.title = SALON.name + " — Menu";
  }

  // let offers.js add a claimed offer to the ticket
  window.SleekApp = {
    addToCart: function (section, name, variant, price) {
      addToCart(section, name, variant, price);
      renderTicket();
      renderMenu();
    },
  };

  document.addEventListener("DOMContentLoaded", init);

  // register service worker for offline + installability (ignored gracefully if unsupported)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
})();
