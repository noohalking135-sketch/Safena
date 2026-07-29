const fetch = require('node-fetch');
const sdk = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  if (req.headers['x-appwrite-event']) {
    try {
      // إعداد عميل Appwrite باستخدام معرّف مشروعك الصحيح
      const client = new sdk.Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject('6a69948f00255a55cfed') // تأكد أنه يوافق Project ID الأساسي لمشروعك
        .setKey(req.headers['x-appwrite-key'] || process.env.APPWRITE_FUNCTION_API_KEY);

      const databases = new sdk.Databases(client);

      const eventHeader = req.headers['x-appwrite-event'] || '';
      const collectionId = eventHeader.includes('orders') ? 'orders' : 'complaints';

      // جلب أحدث وثيقة أُضيففت لقاعدة البيانات
      const response = await databases.listDocuments(
        'main_db',
        collectionId,
        [sdk.Query.limit(1), sdk.Query.orderDesc('$createdAt')]
      );

      if (response.documents.length === 0) {
        return res.json({ success: true, message: "No documents found" });
      }

      const doc = response.documents[0];

      // استخراج البيانات بدقة تامة من الوثيقة
      const customerName = doc.customer_name || doc.customer || doc.name || "عميل جديد";
      const customerPhone = doc.customer_phone || doc.phone || doc.mobile || "غير محدد";
      const location = doc.location || doc.address || "غير محدد";
      const items = doc.items || doc.details || doc.subject || "غير محدد";
      const total = doc.total ? `💰 *المجموع:* ${doc.total}` : "";

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
