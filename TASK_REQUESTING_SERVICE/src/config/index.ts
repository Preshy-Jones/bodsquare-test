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
