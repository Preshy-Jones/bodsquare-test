import amqp from "amqplib";
const { models } = require("../db");
import dotenv from "dotenv";
dotenv.config();
const connect = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();

    await channel.assertExchange("taskExchange", "direct");

    const q = await channel.assertQueue("Taskqueue");

    await channel.bindQueue(q.queue, "taskExchange", "Task");

    channel.consume(q.queue, async (msg: any) => {
      const data = JSON.parse(msg.content);
      console.log(data);
      const newTask = await models["Task"].build({
        title: data.message.title,
        description: data.message.description,
        userId: data.message.userId,
      });

      newTask.save();
      channel.ack(msg);
    });
  } catch (ex) {
    console.error(ex);
  }
};

export { connect as Consume };
