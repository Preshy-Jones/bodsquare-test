const amqp = require("amqplib");

//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel on that connection
//step 3 : Create the exchange
//step 4 : Publish the message to the exchange with a routing key

class Producer {
  channel: any;

  async createChannel() {
    const connection = await amqp.connect("amqp://localhost:5672");
    this.channel = await connection.createChannel();
  }

  async publishMessage(routingKey: any, message: any) {
    if (!this.channel) {
      await this.createChannel();
    }

    const exchangeName = "taskExchange";
    await this.channel.assertExchange(exchangeName, "direct");

    const logDetails = {
      logType: routingKey,
      message: message,
      dateTime: new Date(),
    };
    await this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(logDetails))
    );

    console.log(
      `The new ${routingKey} log is sent to exchange ${exchangeName}`
    );
  }
}

module.exports = Producer;
