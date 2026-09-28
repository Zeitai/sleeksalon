/* ============================================================
   THE SLEEK — menu data
   Transcribed from the salon's printed price list.
   Edit this file to add, remove, or re-price services —
   nothing else in the app needs to change.
   ============================================================ */

const MENU = {
  men: {
    label: "Men",
    icon: "men",
    sections: [
      {
        title: "Hair Services",
        kind: "single",
        items: [
          { name: "Hair Cut", price: 100 },
          { name: "Advance Haircut", price: 150 },
          { name: "Beard Trim", price: 50 },
          { name: "Beard Set", price: 100 },
          { name: "Shaving", price: 70 },
          { name: "Normal Face Massage", price: 150 },
          { name: "Advance Face Massage", price: 250 },
          { name: "Head Massage", price: 150 },
          { name: "Normal Hair Spa", price: 400 },
          { name: "Advance Hair Spa", price: 700 },
          { name: "Smoothening", price: 1500 },
          { name: "Straightening", price: 1500 },
          { name: "Keratin Treatment", price: 2000 },
          { name: "Nanoplastia Treatment", price: 3000 },
          { name: "Botox Treatment", price: 3000 },
          { name: "Dandruff Treatment", price: 600 },
          { name: "Anti Hairfall Treatment", price: 500 },
          { name: "Hair Styling", price: 100 },
          { name: "Sleek Signature Hairspa", price: 1200 },
        ],
      },
      {
        title: "Hair Colour",
        kind: "single",
        items: [
          { name: "Natural Black (Ammonia Free)", price: 300 },
          { name: "Streax Hair Colour", price: 500 },
          { name: "Loreal Hair Colour", price: 700 },
          { name: "Sleek Signature Hair Colour", price: 1000 },
          { name: "Balayage", price: 1200 },
          { name: "Highlight per Strip", price: 100 },
        ],
      },
    ],
  },

  women: {
    label: "Women",
    icon: "women",
    sections: [
      {
        title: "Hair Services",
        kind: "single",
        note: "Charges extend as per hair length",
        items: [
          { name: "Normal Haircut", price: 200 },
          { name: "Advance Haircut", price: 400 },
          { name: "Blow Dry", price: 150 },
          { name: "Blow Dry with Styling", price: 350 },
          { name: "Hair Wash", price: 200 },
          { name: "Normal Hair Spa", price: 500 },
          { name: "Advance Hair Spa", price: 800 },
          { name: "Smoothening", price: 3000 },
          { name: "Straightening", price: 3000 },
          { name: "Keratin", price: 4000 },
          { name: "Nanoplastia", price: 4000 },
          { name: "Botox", price: 4000 },
          { name: "Dandruff Treatment", price: 700 },
          { name: "Sleek Signature Hairspa", price: 1200 },
        ],
      },
      {
        title: "Hair Colour",
        kind: "single",
        items: [
          { name: "Loreal Root Touchup", price: 1200 },
          { name: "Streax Root Touchup", price: 1000 },
          { name: "Global Colour", price: 2000 },
          { name: "Balayage", price: 3000 },
          { name: "Highlights per Strip", price: 200 },
        ],
      },
      {
        title: "Nail Extensions",
        kind: "single",
        items: [
          { name: "Acrylic Extensions", price: 1499 },
          { name: "Gel Extensions", price: 199 },
          { name: "Gel Polish", price: 199 },
        ],
      },
    ],
  },

  common: {
    label: "Common",
    icon: "common",
    sections: [
      {
        title: "Waxing",
        kind: "variant",
        variants: ["Normal", "Chocolate", "Rica"],
        items: [
          { name: "Full Hand", prices: [250, 350, 600] },
          { name: "Full Leg", prices: [500, 600, 700] },
          { name: "Half Hand", prices: [200, 300, 350] },
          { name: "Half Leg", prices: [300, 350, 400] },
          { name: "Under Arms", prices: [60, 80, 100] },
          { name: "Full Back", prices: [250, 350, 500] },
          { name: "Half Back", prices: [200, 300, 250] },
          { name: "Upper Lips", prices: [30, 60, 80] },
          { name: "Bikini", prices: [1000, 1500, 2000] },
          { name: "Full Body", prices: [2000, 2500, 4000] },
          { name: "Full Face", prices: [200, 350, 400] },
        ],
      },
      {
        title: "Bleach / D-Tan",
        kind: "variant",
        variants: ["Bleach", "D-Tan"],
        items: [
          { name: "Full Hand", prices: [699, 699] },
          { name: "Full Leg", prices: [899, 899] },
          { name: "Full Back", prices: [599, 699] },
          { name: "Half Hand", prices: [399, 399] },
          { name: "Half Leg", prices: [399, 399] },
          { name: "Underarms", prices: [299, 299] },
          { name: "Face-Neck", prices: [399, 399] },
          { name: "Full Body", prices: [2599, 2699] },
        ],
      },
      {
        title: "Facial",
        kind: "single",
        items: [
          { name: "Normal Cleanup", price: 250 },
          { name: "Advance Cleanup", price: 400 },
          { name: "Mould / Mask Cleanup", price: 500 },
          { name: "Fruit Facial", price: 500 },
          { name: "Ozone Facial", price: 1000 },
          { name: "Lotus Facial", price: 1800 },
          { name: "O3 Facial", price: 2000 },
          { name: "Sleek's Signature Plan", price: 3000 },
          { name: "O3 D-Tan", price: 400 },
          { name: "Sleek D-Tan", price: 600 },
          { name: "Bleach", price: 400 },
          { name: "Anti Aging Facial", price: 1500 },
          { name: "Hydra Facial", price: 4000 },
          { name: "Skin Treatment", price: 5000 },
          { name: "IPL Laser Facial", price: 6000 },
          { name: "Korean Facial", price: 2000 },
          { name: "Microdermabrasion", price: 9000 },
          { name: "Normal Scrub", price: 150 },
          { name: "Advance Scrub", price: 250 },
        ],
      },
      {
        title: "Mehendi",
        kind: "single",
        items: [
          { name: "Party Mehndi", price: 2000 },
          { name: "Bridal Mehndi", price: 4000 },
          { name: "Arabic", price: 999 },
          { name: "Dulha Dulhan Mehndi", price: 6000 },
        ],
      },
      {
        title: "Makeup & Hairstyle",
        kind: "single",
        items: [
          { name: "Party Makeup", price: 2499 },
          { name: "HD Party Makeup", price: 3499 },
          { name: "Semi HD Bridal Makeup", price: 19999 },
          { name: "Ultra HD Bridal Makeup", price: 24999 },
          { name: "Engagement Makeup", price: 14999 },
          { name: "Airbrush Makeup", price: 29999 },
          { name: "Straightening", price: 1499 },
          { name: "Basic Hair Style", price: 1499 },
          { name: "Advance Hair Style", price: 1999 },
          { name: "Groom Makeup", price: 1499 },
        ],
      },
      {
        title: "Manicure / Pedicure",
        kind: "single",
        items: [
          { name: "Manicure", price: 499 },
          { name: "Pedicure", price: 699 },
          { name: "Hand Polishing", price: 599 },
          { name: "Half Leg Polishing", price: 699 },
          { name: "Body Polishing", price: 3999 },
          { name: "Hand Spa", price: 549 },
          { name: "Foot Spa", price: 799 },
        ],
      },
    ],
  },
};

/* Salon identity — change these to re-brand instantly */
const SALON = {
  name: "The Sleek",
  tagline: "Confidence looks good on you",
  currency: "₹",
};

/* ============================================================
   OUR STORY — content for the "Our Story" tab.
   Edit freely: paragraphs, milestones and values all render
   automatically wherever this is used.
   ============================================================ */
const STORY = {
  eyebrow: "Our story",
  title: "Built one client at a time.",
  intro:
    "The Sleek didn't start as a brand — it started as a single chair, a mirror, and a promise to never rush a service.",
  paragraphs: [
    "We opened our doors with one idea: a salon should feel like the calmest part of someone's week, not another errand. No upsells you didn't ask for, no guessing what something costs before you sit down.",
    "Every stylist here trains across cut, colour and skin — not one narrow specialty — so the person who greets you is the same person who finishes your service, start to finish.",
    "The menu you're browsing is the same one printed at our front desk. What you see is what you pay, and what you pay is what stays with you long after you leave the chair.",
  ],
  quote: "We're not chasing trends. We're chasing the version of you that walks out feeling like themselves, only more so.",
  milestones: [
    { year: "Year 1", label: "Opened with a two-chair studio and a waitlist by week three." },
    { year: "Year 2", label: "Added our first colour bar and brought skin treatments in-house." },
    { year: "Year 3", label: "Trained our team on bridal and event work end-to-end." },
    { year: "Today", label: "A full menu of hair, skin, nails and bridal — still one ticket, one chair, one you." },
  ],
  values: [
    { title: "Honest pricing", detail: "Every price on this menu is the price at the till. No surprises." },
    { title: "Unhurried service", detail: "We book time to do it properly, not to fit one more person in." },
    { title: "Clean, considered products", detail: "We choose what touches your skin and hair as carefully as you would." },
  ],
};

/* ============================================================
   Studio credit — who built and maintains this app.
   Shown quietly in the footer as "Powered by".
   ============================================================ */
const STUDIO_CREDIT = {
  name: "Avate Labs",
  url: "https://avateai.online",
};

/* ============================================================
   SEASONAL OFFERS — powered by a Google Sheet.
   1. Make a Google Sheet (import offers-template.csv as the start).
   2. File → Share → Publish to web → pick the offers tab →
      choose "Comma-separated values (.csv)" → Publish.
   3. Paste the link it gives you between the quotes below.
   The owner then edits the sheet; the site updates by itself.
   ============================================================ */
const OFFERS_CONFIG = {
  // Paste EITHER the "Publish to web" CSV link OR the normal sheet link
  // (sheet must be shared as "Anyone with the link → Viewer").
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/101w0ym2f6o4OOA_m3zZFiarJkuXSSBrE0tKMTPC6DoA/edit?usp=sharing", // <-- paste link here
  // While no sheet is linked, show the sample offers so you can see the section.
  // Set to false before going live with real customers.
  previewSamples: false,
};

/* Shown only when you open the site with  ?demo=offers  (for previewing the design) */
const SAMPLE_OFFERS = [
  {
    title: "Festive Glow Facial",
    description: "O3 Facial with de-tan and a relaxing head massage. Skin that's ready for every photo.",
    price: 1499,
    original: 2400,
    badge: "Diwali Special",
    valid: "2026-11-08",
  },
  {
    title: "The Groom's Edit",
    description: "Haircut, beard set and advance face massage, done together, one calm chair.",
    price: 399,
    original: 500,
    badge: "Wedding Season",
    valid: "2026-12-15",
  },
  {
    title: "Bridal Booking Offer",
    description: "Confirm your bridal makeup this season and enjoy a complimentary hair spa.",
    price: 0,
    original: 0,
    badge: "Limited Slots",
    valid: "2026-10-30",
  },
  {
    title: "Nail Art Fridays",
    description: "Gel polish with free nail art on any Friday visit.",
    price: 149,
    original: 199,
    badge: "Weekly",
    valid: "",
  },
];

/* ============================================================
   GOOGLE REVIEWS — "Rate us" section (QR + button)
   ============================================================ */
const REVIEW = {
  url: "https://share.google/OscIGFFcPGwmO2L1X",
  qr: "images/review-qr.png",
};
