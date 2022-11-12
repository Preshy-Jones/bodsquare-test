import amqp from "amqplib";
const { models } = require("../db");
import dotenv from "dotenv";
dotenv.config();
const connect = async () => {
  try {
    const amqpServer = "amqp://localhost:5672";
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();

    channel.consume("tasks", (message) => {
      return async () => {
        /// @ts-ignore
        const input = JSON.parse(message.content);
        console.log(`Recieved task with input `, input);
        console.log(input);
        const newTask = await models["Task"].build({
          title: input.title,
          description: input.description,
          userId: input.userId,
        });

        newTask.save();
        //@ts-ignore
        channel.ack(message);
      };
    });

    console.log("Waiting for messages...");
  } catch (ex) {
    console.error(ex);
  }
};

export { connect as Consume };
