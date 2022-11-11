"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const env = require("dotenv");
env.config({ path: path_1.default.join(__dirname, "../.env") });
const config = {
    env: {
        isProduction: process.env.NODE_ENV === "production",
        isDevelopment: process.env.NODE_ENV === "development",
        isTest: process.env.NODE_ENV === "test",
    },
    db: {
        database: process.env.DB_CONNECT,
    },
    app: {
        // name: process.env.APP_NAME,
        // domain: process.env.APP_DOMAIN,
        // logo: process.env.APP_LOGO,
        // isProduction: process.env.APP_ENV === "production",
        secret: process.env.JWT_SECRET,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
        bcryptRounds: 10,
        port: process.env.PORT,
    },
};
module.exports = config;
