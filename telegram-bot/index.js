const fetch = require('node-fetch');

module.exports = async ({ req, res, log, error }) => {
  if (req.headers['x-appwrite-event']) {
    try {
      log("RAW REQ.PAYLOAD: " + req.payload);
      
      const payload = JSON.parse(req.payload || '{}');
      const data = payload.document || payload;
      
      // طباعة كل المفاتيح المتاحة لكي نعرف أسماءها الحقيقية
      log("Available keys: " + Object.keys(data).join(', '));
      
      const customerName = data.customer_name || data.name || data.fullName || "غير معرف";
      const customerPhone = data.customer_phone || data.phone || data.mobile || "غير معرف";
      const location = data.location || data.address || "غير معرف";
      const items = data.items || data.details || data.description || "غير معرف";
      const total = data.total || data.price || "";

      const message = `🚨 *طلب أو شكوى جديدة!*\n\n` +
                      `👤 *العميل:* ${customerName}\n` +
                      `📞 *الهاتف:* ${customerPhone}\n` +
                      `📍 *الموقع:* ${location}\n` +
                      `📦 *التفاصيل:* ${items}\n` +
                      (total ? `💰 *المجموع:* ${total}\n` : "");

      const BOT_TOKEN = '8848039805:AAEPnf84p9p0jJ7F0B6mttiW6u6ipCffq6I';
      const CHAT_ID = '1671413336';

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      return res.json({ success: true });
    } catch (err) {
      error("Error: " + err.message);
      return res.json({ success: false, error: err.message }, 500);
    }
  }

  return res.json({ success: true });
};
