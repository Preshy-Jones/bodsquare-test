import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { logger, logEvents } from "./middlewares/logger";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { ErrorHandler, NotFoundHandler } from "./middlewares";
import mongoose, { ConnectOptions } from "mongoose";
const http = require("http");
const socketio = require("socket.io");
const app: Application = express();

const server = http.createServer(app);

const io = socketio(server);

//connect to io
io.on("connection", (socket: any) => {
  console.log("New WebSocket connection");
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

dotenv.config({ path: path.join(__dirname, ".env") });

app.use(logger);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
  })
);

app.use(passport.initialize());
require("./middlewares/passport");
app.use(passport.session());

app.use("/", require("./routes/index"));

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

const port = process.env.PORT || 8008;

app.use(NotFoundHandler);
app.use(ErrorHandler);

const mongooseConnect = async () => {
  console.log(process.env.DB_CONNECT);

  try {
    await mongoose.connect(process.env.DB_CONNECT!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    } as ConnectOptions);
    console.log("connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};

mongooseConnect();

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
