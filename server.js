const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Настройка почтового транспорта через SMTP (Mail.ru)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mail.ru',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // true для порта 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Маршрут для получения заявок с сайта
app.post('/api/lead', async (req, res) => {
    const { name, phone, objectType, messenger, comment } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ success: false, message: 'Имя и телефон обязательны для заполнения.' });
    }

    try {
        const mailOptions = {
            from: `"ЦПБ Защита" <${process.env.SMTP_USER}>`,
            to: process.env.MAIL_TO || 'cpbprotection@gmail.com',
            subject: 'Новая заявка с сайта ЦПБ «Защита»!',
            text: `Поступила новая заявка с квиза:
            
Имя: ${name}
Телефон: ${phone}
Тип объекта: ${objectType || 'Не указано'}
Мессенджер: ${messenger || 'Не указано'}
Комментарий: ${comment || 'Нет'}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                    <h2 style="color: #d9534f;">🔥 Новая заявка с сайта ЦПБ «Защита»</h2>
                    <p><strong>Имя:</strong> ${name}</p>
                    <p><strong>Телефон:</strong> <a href="tel:${phone}">${phone}</a></p>
                    <p><strong>Тип объекта:</strong> ${objectType || 'Не указано'}</p>
                    <p><strong>Мессенджер:</strong> ${messenger || 'Не указано'}</p>
                    <p><strong>Комментарий:</strong> ${comment || 'Нет'}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Письмо успешно отправлено через SMTP!');
        res.json({ success: true, message: 'Заявка успешно отправлена!' });
    } catch (error) {
        console.error('Ошибка отправки письма:', error);
        res.status(500).json({ success: false, message: 'Ошибка при отправке письма.' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
