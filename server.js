const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = process.env.PORT || 3000;

// Инициализация Resend вашим ключом из переменных окружения Render
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// Маршрут для получения заявок с сайта
app.post('/api/lead', async (req, res) => {
    const { name, phone, objectType, messenger, comment } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ success: false, message: 'Имя и телефон обязательны для заполнения.' });
    }

    try {
        // Отправка письма через Resend API
        const data = await resend.emails.send({
            from: 'CPB Zashchita <onboarding@resend.dev>', // Официальный тестовый домен Resend (работает без настройки домена)
            to: ['cpbprotection@gmail.com'],             // Почта, куда приходят заявки
            subject: '🔔 Новая заявка с сайта ЦПБ «Защита»!',
            html: `
                <h2>Поступила новая заявка с сайта!</h2>
                <p><strong>Имя:</strong> ${name}</p>
                <p><strong>Телефон:</strong> ${phone}</p>
                <p><strong>Тип объекта:</strong> ${objectType || 'Не указан'}</p>
                <p><strong>Способ связи:</strong> ${messenger || 'Не указан'}</p>
                <p><strong>Комментарий:</strong> ${comment || 'Нет комментария'}</p>
            `
        });

        console.log('Письмо успешно отправлено:', data);
        res.status(200).json({ success: true, message: 'Заявка успешно отправлена!' });

    } catch (error) {
        console.error('Ошибка отправки письма через Resend:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера при отправке сообщения.' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер успешно запущен на порту ${PORT}`);
});
