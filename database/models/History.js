const { Model, DataTypes, STRING } = require("sequelize");
const sequelize = require("../config.js");

class History extends Model {}

History.init(
    {
        history_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        user_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "HISTORY",
        timestamps: true,
        paranoid: true
    }
);

module.exports = History;