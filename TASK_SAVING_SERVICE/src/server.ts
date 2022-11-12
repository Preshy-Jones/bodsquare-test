import express, { Application } from "express";
import path from "path";
import dotenv from "dotenv";
import { Consume } from "./utils/consumer";
const { db } = require("./db/database");
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
    await Consume();
  });
});

const port = process.env.PORT || 8008;

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
