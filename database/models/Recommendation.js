const { Model, DataTypes, STRING } = require("sequelize");
const sequelize = require("../config.js");

class Recommendation extends Model {}

Recommendation.init(
    {
        recommendation_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        history_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        spotify_id: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        URL: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        feedback: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        JSON: {
            type: DataTypes.JSON,
            allowNull: false
        },
        type_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        emotion_1: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        emotion_2: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        emotion_3: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "Recommendation",
        timestamps: true,
        paranoid: true
    }
);

module.exports = Recommendation;