const fetch = require('node-fetch');

module.exports = async ({ req, res, log, error }) => {
  try {
    let payload = {};
    
    if (typeof req.payload === 'string') {
      try { payload = JSON.parse(req.payload); } catch (e) { payload = {}; }
    } else if (typeof req.payload === 'object' && req.payload !== null) {
      payload = req.payload;
    }

    // جلب المستند من الحدث
    let data = payload.document || payload.current || payload;

    // إذا لم تأت البيانات عبر الحدث مباشرة، نقوم بجلبها من الجدول مباشرة
    if (!data.customer_name && !data.items) {
      // ⚠️ ضع هنا معرف مشروعك، ومعرف قاعدة البيانات، ومعرف جدول الطلبات الصحيح لديك
      const PROJECT_ID = '66b7cfcd0022421dfc6e'; 
      const DATABASE_ID = 'YOUR_DATABASE_ID'; // تأكد أنه نفس APPWRITE_DATABASE_ID في التطبيق
      const COLLECTION_ID = 'YOUR_ORDERS_TABLE_ID'; // تأكد أنه نفس ORDERS_TABLE_ID في التطبيق

      try {
        const dbResponse = await fetch(`https://cloud.appwrite.io/v1/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents?limit=1&orderType[0]=DESC`, {
          headers: {
            'X-Appwrite-Project': PROJECT_ID,
            'Content-Type': 'application/json'
          }
        });
        const dbResult = await dbResponse.json();
        if (dbResult.documents && dbResult.documents.length > 0) {
          data = dbResult.documents[0];
        }
      } catch (dbErr) {
        error("خطأ في جلب السجل الأخير: " + dbErr.message);
      }
    }

    // مطابقة الحقول تماماً لما يتم إرساله من CheckoutModal.tsx
    const customerName = data.customer_name || "عميل";
    const customerPhone = data.customer_phone || "00000000";
    const location = data.location || "الموقع";
    const items = data.items || "لا توجد تفاصيل";
    const total = data.total ? `${data.total} ل.س` : "0";

    const message = `🚨 *طلب جديد عبر التطبيق!*\n\n` +
                    `👤 *العميل:* ${customerName}\n` +
                    `📞 *الهاتف:* ${customerPhone}\n` +
                    `📍 *الموقع:* ${location}\n` +
                    `📦 *المنتجات:* ${items}\n` +
                    `💰 *المجموع:* ${total}`;

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
    }

    return res.json({ success: true });
  } catch (err) {
    error("خطأ حرج في الدالة: " + err.message);
    return res.json({ success: false, error: err.message }, 500);
  }
};
