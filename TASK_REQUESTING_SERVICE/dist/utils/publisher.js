"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connect = (queueName, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const amqpServer = process.env.RABBITMQ_URL;
        console.log(amqpServer);
        const connection = yield amqplib_1.default.connect(amqpServer);
        const channel = yield connection.createChannel();
        yield channel.assertQueue("tasks");
        yield channel.sendToQueue("tasks", Buffer.from(JSON.stringify(payload)));
        console.log(`Task sent successfully`, payload);
        yield channel.close();
        yield connection.close();
    }
    catch (ex) {
        console.error(ex);
    }
});
exports.Publisher = connect;
