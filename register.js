require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/api/register', async (req, res) => {
  try {
    const { name, phone, country, document, inviterId } = req.body;
    
    if (!name || !country || !document) {
      return res.status(400).json({ error: 'الاسم والدولة ونوع المستند مطلوبان.' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({ error: 'إعدادات البوت غير مكتملة.' });
    }

    let text = `📥 <b>طلب تسجيل جديد</b>\n\n`;
    text += `👤 الاسم: ${name}\n`;
    text += `📞 الهاتف: ${phone || '-'}\n`;
    text += `🌍 الدولة: ${country}\n`;
    text += `📄 المستند: ${document || '-'}\n`;
    text += `⏰ الوقت: ${new Date().toLocaleString('ar-EG')}`;
    
    if (inviterId) {
      text += `\n\n🔗 بواسطة: <code>${inviterId}</code>\n`;
      text += `💰 الأرباح: 30% مسجل | 30% داعي | 40% إدارة`;
    } else {
      text += `\n\n💰 الأرباح: 50% مسجل | 50% إدارة`;
    }

    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    });

    return res.json({ message: 'تم استقبال بياناتك بنجاح.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في السيرفر أو الاتصال بتليجرام.' });
  }
});

module.exports = app;
