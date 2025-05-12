const { Model, DataTypes, STRING } = require("sequelize");
const sequelize = require("../config.js");

class Genre extends Model {}

Genre.init(
    {
        genre_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        spotify_Id: {
            type: DataTypes.INTEGER,
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
        modelName: "GENRE",
        timestamps: true,
        paranoid: true
    }
);

module.exports = Genre;