const fetch = require('node-fetch');

module.exports = async ({ req, res, log, error }) => {
  // التحقق أن الطلب قادم كـ Event من قاعدة البيانات
  if (req.headers['x-appwrite-event']) {
    try {
      const payload = JSON.parse(req.payload || '{}');
      
      const customerName = payload.customer_name || payload.name || "عميل جديد";
      const customerPhone = payload.phone || "غير محدد";
      const orderLocation = payload.location || "غير محدد";
      
      // رسالة التنبيه التي ستصلك على تليجرام
      const message = `🚨 *طلب أو شكوى جديدة!*\n\n` +
                      `👤 *العميل:* ${customerName}\n` +
                      `📞 *الهاتف:* ${customerPhone}\n` +
                      `📍 *الموقع:* ${orderLocation}`;

      // بيانات تليجرام الخاصة بك
      const BOT_TOKEN = '8848039805:AAEPnf84p9p0jJ7F0B6mttiW6u6ipCffq6I';
      const CHAT_ID = '1671413336';

      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      const result = await response.json();
      if (!result.ok) {
        error("Telegram API Error: " + JSON.stringify(result));
      }

      return res.json({ success: true, message: "Notification sent successfully" });
    } catch (err) {
      error("Error processing webhook event: " + err.message);
      return res.json({ success: false, error: err.message }, 500);
    }
  }

  return res.json({ success: true, message: "No event triggered" });
};
