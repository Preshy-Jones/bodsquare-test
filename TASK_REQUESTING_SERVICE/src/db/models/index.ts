'use strict';

const fs = require('fs');
import path from 'path';
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};


// @ts-ignore
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter((file:any) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts');
  })
  .forEach((file:any) => {
    // @ts-ignore
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    // @ts-ignore
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  // @ts-ignore
  if (db[modelName].associate) {
    // @ts-ignore
    db[modelName].associate(db);
  }
});

// @ts-ignore
db.sequelize = sequelize;
// @ts-ignore
db.Sequelize = Sequelize;

module.exports = db;
