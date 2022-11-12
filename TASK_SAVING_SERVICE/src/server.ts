import express, { Application } from "express";
import path from "path";
import dotenv from "dotenv";
import { Consume } from "./utils/consumer";
import db from "./db/database";
import amqp from "amqplib";
const { models } = require("./db");
const http = require("http");
const socketio = require("socket.io");

const app: Application = express();
const server = http.createServer(app);
const io = socketio(server);
dotenv.config();

io.on("connection", (socket: any) => {
  console.log("New WebSocket connection");
  socket.on("newTask", async () => {
    console.log("new task created");
    // await Consume();
    const connection = await amqp.connect("amqp://localhost:5672");
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
  });
});

const port = process.env.PORT || 4000;

const dbConnect = async () => {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

dbConnect();

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//connect to io
io.on("connection", (socket: any) => {
  console.log("New WebSocket connection");
  socket.on("newTask", async () => {
    console.log("new task created");
    // await Consume();
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    await channel.assertExchange("taskExchange", "direct");

    const q = await channel.assertQueue("WarningAndErrorsQueue");

    await channel.bindQueue(q.queue, "taskExchange", "Warning");
    await channel.bindQueue(q.queue, "taskExchange", "Error");

    channel.consume(q.queue, async (msg: any) => {
      const data = JSON.parse(msg.content);
      console.log(data);
      const newTask = await models["Task"].build({
        title: data.title,
        description: data.description,
        userId: data.userId,
      });

      newTask.save();
      channel.ack(msg);
    });
  });
});
