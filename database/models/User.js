const { Model, DataTypes, STRING } = require("sequelize");
const sequelize = require("../config.js");

class User extends Model {}

User.init(
    {
        user_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "USER",
        timestamps: true,
        paranoid: true
    }
);

module.exports = User;