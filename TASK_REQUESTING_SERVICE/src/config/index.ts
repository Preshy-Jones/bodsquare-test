import path from "path";
const env = require("dotenv");

env.config({ path: path.join(__dirname, "../.env") });

const config = {
  env: {
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV === "development",
    isTest: process.env.NODE_ENV === "test",
  },
  db: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  app: {
    secret: process.env.JWT_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    bcryptRounds: 10,
    port: process.env.PORT,
  },
};

module.exports = config;
