const { Model, DataTypes, STRING } = require("sequelize");
const sequelize = require("../config.js");

class Country extends Model {}

Country.init(
    {
        country_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        code: {
            type: DataTypes.STRING(3),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "COUNTRY",
        timestamps: false,
        paranoid: false
    }
);

module.exports = Country;