const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

app.post('/api/lead', async (req, res) => {
    try {
        const { name, phone, objectType, messenger, comment } = req.body;

        if (!phone) {
            return res.status(400).json({ success: false, message: 'Номер телефона обязателен' });
        }

        const mailOptions = {
            from: `"ЦПБ Защита Сайт" <${process.env.SMTP_USER}>`,
            to: 'cpbprotection@gmail.com',
            subject: 'Новая заявка с сайта ЦПБ «Защита»!',
            text: `
Новая заявка с сайта:

Имя: ${name}
Телефон: ${phone}
Тип объекта: ${objectType}
Связь через: ${messenger}
Комментарий: ${comment}
            `,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f6f4; border-radius: 10px;">
                    <h2 style="color: #bf0603; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Новая заявка с сайта ЦПБ «Защита»</h2>
                    <p><strong>Имя:</strong> ${name}</p>
                    <p><strong>Телефон:</strong> <a href="tel:${phone}">${phone}</a></p>
                    <p><strong>Тип объекта:</strong> ${objectType}</p>
                    <p><strong>Способ связи:</strong> ${messenger}</p>
                    <p><strong>Комментарий:</strong> ${comment}</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666;">Письмо сформировано автоматически с вашего сайта.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: 'Письмо успешно отправлено' });

    } catch (error) {
        console.error('Ошибка отправки письма:', error);
        return res.status(500).json({ success: false, message: 'Ошибка сервера при отправке письма' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер бэкенда запущен на порту ${PORT}`);
});
