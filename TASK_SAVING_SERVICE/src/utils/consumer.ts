import amqp from "amqplib";

const connect = async (queueName: string) => {
  try {
    const amqpServer = process.env.RABBITMQ_URL!;
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();
    await channel.assertQueue("tasks");

    channel.consume("tasks", (message) => {
      /// @ts-ignore
      const input = JSON.parse(message.content);
      console.log(`Recieved task with input `, input);
      console.log(input);

      // if (input.number == 7) channel.ack(message);
    });

    console.log("Waiting for messages...");
  } catch (ex) {
    console.error(ex);
  }
};

export { connect as Consume };
