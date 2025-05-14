const { Model, DataTypes, STRING } = require("sequelize");
const sequelize = require("../config.js");

class Quiz extends Model {}

Quiz.init(
    {
        quiz_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        user_Id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        question_1: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        question_2: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        question_3: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "QUIZ",
        timestamps: false,
        paranoid: false
    }
);

module.exports = Quiz;