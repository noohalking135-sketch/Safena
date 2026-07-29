const fetch = require('node-fetch');

module.exports = async ({ req, res, log, error }) => {
  try {
    let payload = {};
    
    if (typeof req.payload === 'string') {
      try { 
        payload = JSON.parse(req.payload); 
      } catch (e) { 
        payload = {}; 
      }
    } else if (typeof req.payload === 'object' && req.payload !== null) {
      payload = req.payload;
    }

    log("Incoming Payload: " + JSON.stringify(payload));

    // استخراج بيانات المستند بمرونة كاملة لتجنب أي فراغ
    let data = payload.document || payload.current || payload.data || payload;

    // إذا كانت البيانات عبارة عن حدث داخلي لـ Appwrite ولم يتم العثور على حقول مباشرة، نأخذ الـ payload كبيانات
    if (!data || typeof data !== 'object') {
      data = {};
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
