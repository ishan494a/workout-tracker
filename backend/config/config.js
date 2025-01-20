require('dotenv').config();
const { Sequelize } = require('sequelize');
const ENV = "dev";
const sequelize = new Sequelize({
  host: ENV === "prod" ? process.env.DB_HOST : process.env.DB_HOST_LOCAL,
  port: ENV === "prod" ? process.env.DB_PORT : process.env.DB_PORT_LOCAL,
  database: ENV === "prod" ? process.env.DB_NAME : process.env.DB_NAME_LOCAL,
  username: ENV === "prod" ? process.env.DB_USER : process.env.DB_USER_LOCAL,
  password: ENV === "prod" ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_LOCAL,
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;