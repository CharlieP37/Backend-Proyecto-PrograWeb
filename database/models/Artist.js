const { Model, DataTypes, STRING } = require("sequelize");
const sequelize = require("../config.js");

class Artist extends Model {}

Artist.init(
    {
        artist_Id: {
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
        modelName: "ARTIST",
        timestamps: true,
        paranoid: true
    }
);

module.exports = Artist;