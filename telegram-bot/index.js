const fetch = require('node-fetch');

module.exports = async ({ req, res, log, error }) => {
  try {
    let payload = {};
    if (typeof req.payload === 'string') {
      try { payload = JSON.parse(req.payload); } catch (e) { payload = {}; }
    } else if (typeof req.payload === 'object' && req.payload !== null) {
      payload = req.payload;
    }

    log("Incoming Payload: " + JSON.stringify(payload));

    // استخراج المستند سواء كان قادماً من الحدث مباشرة أو كوثيقة منفردة
    let data = payload.document || payload.current || payload.data || payload;

    // إذا لم تكن البيانات موجودة مباشرة في الـ payload، نجلب أحدث سجل من قاعدة البيانات
    if (!data || Object.keys(data).length === 0 || (!data.customer_name && !data.items && !data.customer)) {
      log("Payload is empty. Fetching the latest document from database...");
      
      const PROJECT_ID = '6a658f7200183d84195b';
      const DATABASE_ID = '6a65915e00291cf7f54c';
      
      try {
        const dbResponse = await fetch(`https://tor.cloud.appwrite.io/v1/databases/${DATABASE_ID}/collections/orders/documents?limit=1&orderDesc(\$createdAt)=true`, {
          headers: {
            'X-Appwrite-Project': PROJECT_ID,
            'Content-Type': 'application/json'
          }
        });
        const dbResult = await dbResponse.json();
        if (dbResult.documents && dbResult.documents.length > 0) {
          data = dbResult.documents[0];
          log("Successfully fetched latest order from DB.");
        }
      } catch (dbErr) {
        error("خطأ في جلب أحدث سجل: " + dbErr.message);
      }
    }

    const customerName = data.customer_name || data.customer || data.name || "عميل جديد";
    const customerPhone = data.customer_phone || data.phone || data.mobile || "غير محدد";
    const location = data.location || data.address || data.homeAddress || "غير محدد";
    const items = data.items || data.details || data.subject || "لا توجد تفاصيل";
    const total = data.total !== undefined && data.total !== null ? `💰 *المجموع:* ${data.total} ل.س` : "";

    const message = `🚨 *طلب أو شكوى جديدة عبر التطبيق!*\n\n` +
                    `👤 *العميل:* ${customerName}\n` +
                    `📞 *الهاتف:* ${customerPhone}\n` +
                    `📍 *الموقع:* ${location}\n` +
                    `📦 *التفاصيل:* ${items}\n` +
                    (total ? `${total}\n` : "");

    const BOT_TOKEN = '8848039805:AAEPnf84p9p0jJ7F0B6mttiW6u6ipCffq6I';
    const CHAT_ID = '1671413336';

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const tgData = await tgRes.json();
    if (!tgData.ok) {
      error("فشل إرسال تليجرام: " + JSON.stringify(tgData));
      return res.json({ success: false, telegram_error: tgData }, 500);
    }

    return res.json({ success: true });
  } catch (err) {
    error("خطأ حرج في الدالة: " + err.message);
    return res.json({ success: false, error: err.message }, 500);
  }
};
