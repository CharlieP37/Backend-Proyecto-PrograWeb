const { Model, DataTypes, STRING } = require("sequelize");
const sequelize = require("../config.js");

class Emotion extends Model {}

Emotion.init(
    {
        emotion_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        emotiontype_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "Emotion",
        timestamps: false,
        paranoid: false
    }
);

module.exports = Emotion;