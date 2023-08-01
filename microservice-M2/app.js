const express = require('express');
const amqp = require('amqplib');

const app = express();
const PORT = process.env.PORT || 3001;
const QUEUE_NAME = 'tasks';

async function processTask(task) {
    // Здесь происходит обработка задания, которое приходит из RabbitMQ
    // Замените этот код на свою бизнес-логику

    // Просто симулируем обработку с задержкой в 2 секунды
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Task processed:', task);
}

async function startConsumer() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME);

        console.log('Waiting for messages in queue:', QUEUE_NAME);

        channel.consume(QUEUE_NAME, async (msg) => {
            const task = JSON.parse(msg.content.toString());
            await processTask(task);
            channel.ack(msg);
        });
    } catch (error) {
        console.error('Error:', error.message);
        console.error('Error:', error);
    }
}

startConsumer();

app.listen(PORT, () => {
    console.log(`Microservice M2 is running on http://localhost:${PORT}`);
});
