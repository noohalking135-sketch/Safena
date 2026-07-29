module.exports = async ({ req, res, log, error }) => {
  // التحقق من أن الطلب قادم كحدث من Appwrite أو تم تنفيذه يدوياً
  try {
    let payload = {};
    
    // محاولة تحليل الـ payload سواء كان نصاً أو كائناً جاهزاً
    if (typeof req.payload === 'string') {
      try {
        payload = JSON.parse(req.payload);
      } catch (e) {
        payload = {};
      }
    } else if (typeof req.payload === 'object' && req.payload !== null) {
      payload = req.payload;
    }

    // استخراج المستند من الحدث (يدعم مختلف هياكل أحداث Appwrite)
    const data = payload.document || payload.current || payload;

    // استخراج البيانات مع الحفاظ على الحقول المرسلة من التطبيق (CheckoutModal)
    const customerName = data.customer_name || data.customer || data.name || "عميل جديد";
    const customerPhone = data.customer_phone || data.phone || data.mobile || "غير محدد";
    const location = data.location || data.address || data.homeAddress || "غير محدد";
    const items = data.items || data.details || data.subject || "غير محدد";
    const total = data.total ? `💰 *المجموع:* ${data.total} ل.س` : "";

    // التأكد من أن هناك بيانات حقيقية وليست مجرد إشعار فارغ
    const message = `🚨 *طلب جديد عبر التطبيق!*\n\n` +
                    `👤 *العميل:* ${customerName}\n` +
                    `📞 *الهاتف:* ${customerPhone}\n` +
                    `📍 *الموقع:* ${location}\n` +
                    `📦 *التفاصيل:* ${items}\n` +
                    (total ? `${total}\n` : "");

    const BOT_TOKEN = '8848039805:AAEPnf84p9p0jJ7F0B6mttiW6u6ipCffq6I';
    const CHAT_ID = '1671413336';

    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    const telegramResult = await telegramResponse.json();
    if (!telegramResult.ok) {
      error("Telegram API Error: " + JSON.stringify(telegramResult));
    }

    return res.json({ success: true, message: "Notification sent successfully" });
  } catch (err) {
    error("Critical Error: " + err.message);
    return res.json({ success: false, error: err.message }, 500);
  }
};
