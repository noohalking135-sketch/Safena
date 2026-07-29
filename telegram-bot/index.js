const fetch = require('node-fetch');
const sdk = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  try {
    const client = new sdk.Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(req.headers['x-appwrite-key'] || process.env.APPWRITE_FUNCTION_API_KEY);

    const databases = new sdk.Databases(client);

    // استخراج بيانات الحدث القادم من Appwrite تلقائياً
    const payload = req.payload ? JSON.parse(req.payload) : {};
    const eventHeader = req.headers['x-appwrite-event'] || '';
    
    // إذا جاءت الوثيقة مباشرة مع الحدث (Document Payload)
    let doc = payload.document || payload;

    // إذا لم تأتِ مباشرة، نقوم بجلبها باستخدام معرّفات الحدث الحقيقية الظاهرة في صورتك
    if (!doc.customer_name && !doc.customer && !doc.phone && !doc.customer_phone) {
      // استخراج databaseId و collectionId من مسار الحدث (Event) تلقائياً
      // مثال الحدث: databases.[DATABASE_ID].collections.[COLLECTION_ID].documents.[DOCUMENT_ID].create
      const parts = eventHeader.split('.');
      const dbId = parts[1] || '6a65915e00291cf7f54c';
      const colId = parts[3] || (eventHeader.includes('complaints') ? 'complaints' : 'orders');

      const response = await databases.listDocuments(
        dbId,
        colId,
        [sdk.Query.limit(1), sdk.Query.orderDesc('$createdAt')]
      );

      if (response.documents.length > 0) {
        doc = response.documents[0];
      }
    }

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
};
