import amqp from "amqplib";

const connect = async (data:any) => {
  try {
    const amqpServer = process.env.RABBITMQ_URL!;
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();
    await channel.assertQueue("jobs");

    channel.consume(data, (message) => {
      const input = JSON.parse(message.content.toString());
      console.log(`Recieved job with input ${input.number}`);
      //"7" == 7 true
      //"7" === 7 false

      if (input.number == 7) channel.ack(message);
    });

    console.log("Waiting for messages...");
  } catch (ex) {
    console.error(ex);
  }
};

export { connect as Consumer };
