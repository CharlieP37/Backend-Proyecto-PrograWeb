const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_CONNECTION,
        dialect: "mysql",
        logging: false,
        define: {
            freezeTableName: true
        }
    }
);

module.exports = sequelize;