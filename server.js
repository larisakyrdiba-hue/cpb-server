const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Инициализация Resend с вашим ключом
const resend = new Resend('re_QvEdRBKH_FUV1sKEToYcNq8vn3JQkoNiu');

// Маршрут для получения заявок с сайта
app.post('/api/lead', async (req, res) => {
    const { name, phone, objectType, messenger, comment } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ success: false, message: 'Имя и телефон обязательны для заполнения.' });
    }

    try {
        const data = await resend.emails.send({
            from: 'ЦПБ Защита <onboarding@resend.dev>',
            to: process.env.MAIL_TO || 'cpbprotection@gmail.com',
            subject: 'Новая заявка с сайта ЦПБ «Защита»!',
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
        });

        console.log('Письмо успешно отправлено через Resend:', data);
        res.json({ success: true, message: 'Заявка успешно отправлена!' });
    } catch (error) {
        console.error('Ошибка отправки письма через Resend:', error);
        res.status(500).json({ success: false, message: 'Ошибка при отправке письма.' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
