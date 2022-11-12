import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const connect = async (queueName: string, payload: any) => {
  try {
    const amqpServer = process.env.RABBITMQ_URL!;
    console.log(amqpServer);

    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();
    await channel.assertQueue("tasks");
    await channel.sendToQueue(
      "tasks",
      Buffer.from(JSON.stringify({ payload }))
    );
    console.log(`Task sent successfully`, payload);
    await channel.close();
    await connection.close();
  } catch (ex) {
    console.error(ex);
  }
};

//export connect() as Publisher vairable
export { connect as Publish };
