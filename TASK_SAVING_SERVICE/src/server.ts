import express, { Application } from "express";
import path from "path";
import dotenv from "dotenv";
import { Consume } from "./utils/consumer";
import db from "./db/database";
const http = require("http");
const socketio = require("socket.io");
const { models } = require("./db");


const app: Application = express();
const server = http.createServer(app);
const io = socketio(server);
dotenv.config();

//connect to io
io.on("connection", (socket: any) => {
  console.log("New WebSocket connection");
  socket.on("newTask", () => {
    console.log("new task created");
    Consume("tasks");
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
