import dotenv from "dotenv";
const config = require("../config");
const { Sequelize } = require("sequelize");

dotenv.config();
const db = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: "mysql",
  }
);

export { db };
