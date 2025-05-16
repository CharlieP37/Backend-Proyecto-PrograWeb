const { Model, DataTypes, STRING } = require("sequelize");
const sequelize = require("../config.js");

class EmotionAnalysis extends Model {}

EmotionAnalysis.init(
    {
        emotionanalysis_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        emotion_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        confidence: {
            type: DataTypes.DOUBLE(8,5),
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "EMOTION_ANALYSIS",
        timestamps: false,
        paranoid: false
    }
);

module.exports = EmotionAnalysis;