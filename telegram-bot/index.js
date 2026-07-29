const fetch = require('node-fetch');

module.exports = async ({ req, res, log, error }) => {
  if (req.headers['x-appwrite-event']) {
    try {
      const payload = JSON.parse(req.payload || '{}');
      
      // دعم قراءة البيانات سواء كانت مرسلة مباشرة أو داخل وثيقة قاعدة بيانات
      const data = payload.document || payload;
      
      const customerName = data.customer_name || data.name || "عميل جديد";
      const customerPhone = data.customer_phone || data.phone || "غير محدد";
      const location = data.location || "غير محدد";
      const items = data.items || data.details || "غير محدد";
      const total = data.total ? `💰 *المجموع:* ${data.total}` : "";
      
      const message = `🚨 *طلب أو شكوى جديدة!*\n\n` +
                      `👤 *العميل:* ${customerName}\n` +
                      `📞 *الهاتف:* ${customerPhone}\n` +
                      `📍 *الموقع:* ${location}\n` +
                      `📦 *التفاصيل:* ${items}\n` +
                      (total ? `${total}\n` : "");

      const BOT_TOKEN = '8848039805:AAEPnf84p9p0jJ7F0B6mttiW6u6ipCffq6I';
      const CHAT_ID = '1671413336';

      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      
      await fetch(url, {
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
