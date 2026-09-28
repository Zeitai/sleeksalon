// api/notify.js — Vercel serverless function.
// Sends a new ticket to the salon owner on Telegram.
// Env vars (set in Vercel → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

// Remember recent ids so a retry never sends the same ticket twice
const seen = new Set();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(500).json({ ok: false, error: 'Server not configured' });
  }

  const { id, name, phone, items } = req.body || {};
  const digits = String(phone || '').replace(/\D/g, '');

  if (!name || digits.length < 10 || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ ok: false, error: 'Invalid ticket' });
  }

  if (id && seen.has(id)) return res.status(200).json({ ok: true, duplicate: true });

  const clean = items.slice(0, 60).map((i) => ({
    name: String(i.name || '').slice(0, 80),
    section: String(i.section || '').slice(0, 40),
    variant: String(i.variant || '').slice(0, 30),
    price: Math.max(0, Number(i.price) || 0),
    qty: Math.min(20, Math.max(1, parseInt(i.qty, 10) || 1)),
  }));

  // Total is calculated on the server
  const total = clean.reduce((s, i) => s + i.price * i.qty, 0);

  const lines = clean
    .map((i, n) => {
      const label = esc(i.name) + (i.variant ? ` (${esc(i.variant)})` : '');
      const qty = i.qty > 1 ? ` x${i.qty}` : '';
      return `${n + 1}. ${label}${qty} — ${inr(i.price * i.qty)}`;
    })
    .join('\n');

  const time = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const text =
    `🔔 <b>New booking — The Sleek</b>\n\n` +
    `👤 <b>Name:</b> ${esc(name).slice(0, 80)}\n` +
    `📞 <b>Phone:</b> ${esc(String(phone).slice(0, 20))}\n\n` +
    `<b>Services</b>\n${lines}\n\n` +
    `💰 <b>Total: ${inr(total)}</b>\n` +
    `🕒 ${time}`;

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    if (!tg.ok) return res.status(502).json({ ok: false, error: 'Telegram rejected the message' });

    if (id) {
      seen.add(id);
      if (seen.size > 500) seen.delete(seen.values().next().value);
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Could not reach Telegram' });
  }
};
