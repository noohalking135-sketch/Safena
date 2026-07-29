const fetch = require('node-fetch');

module.exports = async ({ req, res, log, error }) => {
  if (req.headers['x-appwrite-event']) {
    try {
      const payload = JSON.parse(req.payload || '{}');
      
      // محاولة استخراج البيانات مباشرة من الحدث (إذا أرسلها Appwrite)
      let data = payload.document || payload;

      // إذا كانت البيانات فارغة، نقوم بجلب أحدث طلب أو شكوى مباشرة عبر REST API الخاص بـ Appwrite
      if (!data.customer_name && !data.customer_phone) {
        const eventHeader = req.headers['x-appwrite-event'] || '';
        const collectionId = eventHeader.includes('orders') ? 'orders' : 'complaints';
        
        const response = await fetch(`https://cloud.appwrite.io/v1/databases/main_db/collections/${collectionId}/documents?_limit=1&_orderType[0]=DESC`, {
          headers: {
            'X-Appwrite-Project': '66b7cfcd0022421dfc6e',
            'Content-Type': 'application/json'
          }
        });
        
        const result = await response.json();
        if (result.documents && result.documents.length > 0) {
          data = result.documents[0];
        }
      }

      const customerName = data.customer_name || data.name || "عميل جديد";
      const customerPhone = data.customer_phone || data.phone || "غير محدد";
      const location = data.location || "غير محدد";
      const items = data.items || data.details || data.subject || "غير محدد";
      const total = data.total ? `💰 *المجموع:* ${data.total}` : "";

      const message = `🚨 *طلب أو شكوى جديدة!*\n\n` +
                      `👤 *العميل:* ${customerName}\n` +
                      `📞 *الهاتف:* ${customerPhone}\n` +
                      `📍 *الموقع:* ${location}\n` +
                      `📦 *التفاصيل:* ${items}\n` +
                      (total ? `${total}\n` : "");

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
