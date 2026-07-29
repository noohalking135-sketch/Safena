const fetch = require('node-fetch');

module.exports = async ({ req, res, log, error }) => {
  if (req.headers['x-appwrite-event']) {
    try {
      const eventHeader = req.headers['x-appwrite-event'] || '';
      let collectionId = 'orders';
      if (eventHeader.includes('complaints')) {
        collectionId = 'complaints';
      }

      // جلب البيانات مع طباعة حالة الاستجابة
      const apiUrl = `https://cloud.appwrite.io/v1/databases/main_db/collections/${collectionId}/documents`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'X-Appwrite-Project': '6a69948f00255a55cfed',
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      // نرسل تفاصيل ما تم العثور عليه لتليجرام مباشرة لنرى النتيجة
      let debugMsg = `🔍 الاستجابة:\n- عدد الوثائق: ${result.documents ? result.documents.length : 'غير متوفر'}\n`;
      if(result.message) debugMsg += `- خطأ: ${result.message}\n`;
      
      if (result.documents && result.documents.length > 0) {
        const doc = result.documents[0];
        debugMsg += `\n👤 الاسم: ${doc.customer_name || doc.customer || 'غير موجود'}\n📞 الهاتف: ${doc.customer_phone || doc.phone || 'غير موجود'}`;
      }

      const BOT_TOKEN = '8848039805:AAEPnf84p9p0jJ7F0B6mttiW6u6ipCffq6I';
      const CHAT_ID = '1671413336';

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: debugMsg,
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
