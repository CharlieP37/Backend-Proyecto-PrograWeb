const { Model, DataTypes, STRING } = require("sequelize");
const sequelize = require("../config.js");

class EmotionType extends Model {}

EmotionType.init(
    {
        emotiontype_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(10),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "EMOTION_TYPE",
        timestamps: false,
        paranoid: false
    }
);

module.exports = EmotionType;