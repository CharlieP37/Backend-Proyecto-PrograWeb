const { Model, DataTypes, STRING } = require("sequelize");
const sequelize = require("../config.js");

class Type extends Model {}

Type.init(
    {
        type_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "Type",
        timestamps: false,
        paranoid: false
    }
);

module.exports = Type;