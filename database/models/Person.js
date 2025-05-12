const { Model, DataTypes, STRING } = require("sequelize");
const sequelize = require("../config.js");

class Person extends Model {}

Person.init(
    {
        person_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        sex: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        country_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "PERSON",
        timestamps: true,
        paranoid: true
    }
);

module.exports = Person;