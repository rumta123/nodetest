const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const amqp = require('amqplib');

const app = express();
const PORT = process.env.PORT || 3000;
const M2_QUEUE_NAME = 'tasks';
const M2_API_URL = 'http://localhost:3001/process';

app.use(bodyParser.json());

// Подключение к RabbitMQ и создание канала
async function connectToRabbitMQ() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(M2_QUEUE_NAME);

        return channel;
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error.message);
        throw error;
    }
}

// Обработка HTTP POST запросов
app.post('/process', async (req, res) => {
    try {
        // Асинхронная обработка запроса, например, отправка данных в RabbitMQ или другую асинхронную систему
        // В данном примере мы отправляем данные микросервису М2 с помощью RabbitMQ
        const channel = await connectToRabbitMQ();
        const dataToSend = req.body;

        await channel.sendToQueue(M2_QUEUE_NAME, Buffer.from(JSON.stringify(dataToSend)));

        res.status(200).json({ message: 'Data sent to M2 for processing' });
    } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Microservice M1 is running on http://localhost:${PORT}`);
});
