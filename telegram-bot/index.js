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

    // استخراج المستند من الحدث (Appwrite يضع المستند الجديد داخل document أو current)
    let data = payload.document || payload.current || payload;

    // طباعة البيانات في السجلات لنراها بوضوح في حال احتجت للمراجعة
    log("Extracted Data: " + JSON.stringify(data));

    // استخراج الحقول مع توفير قيم افتراضية تفصيلية لتجنب توقف الكود
    const customerName = data.customer_name || data.customer || data.name || "عميل جديد";
    const customerPhone = data.customer_phone || data.phone || data.mobile || "غير محدد";
    const location = data.location || data.address || data.homeAddress || "غير محدد";
    const items = data.items || data.details || data.subject || "لا توجد تفاصيل";
    const total = data.total !== undefined && data.total !== null ? `💰 *المجموع:* ${data.total} ل.س` : "";

    // التأكد من أن هناك محتوى حقيقي للإرسال
    if (!data || Object.keys(data).length === 0) {
      error("البيانات المستلمة فارغة تماماً.");
      return res.json({ success: false, error: "Empty payload data" }, 400);
    }

    const message = `🚨 *طلب أو شكوى جديدة عبر التطبيق!*\n\n` +
                    `👤 *العميل:* ${customerName}\n` +
                    `📞 *الهاتف:* ${customerPhone}\n` +
                    `📍 *الموقع:* ${location}\n` +
                    `📦 *التفاصيل:* ${items}\n` +
                    (total ? `${total}\n` : "");

    const BOT_TOKEN = '8848039805:AAEPnf84p9p0jJ7F0B6mttiW6u6ipCffq6I';
    const CHAT_ID = '1671413336';

    const tgRes = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const response = await fetch(tgRes, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const tgData = await response.json();
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
