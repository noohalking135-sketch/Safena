const fetch = require('node-fetch');

module.exports = async ({ req, res, log, error }) => {
  if (req.headers['x-appwrite-event']) {
    try {
      // طباعة الـ payload كاملة كمحتوى للرسالة لكي نراها على تليجرام
      const rawData = req.payload || '{}';
      
      const message = `🚨 *البيانات الخام المستقبلة:*\n\`\`\`json\n${rawData}\n\`\`\``;

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
