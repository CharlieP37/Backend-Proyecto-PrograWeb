const { Model, DataTypes, STRING } = require("sequelize");
const sequelize = require("../config.js");

class Song extends Model {}

Song.init(
    {
        song_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "SONG",
        timestamps: true,
        paranoid: true
    }
);

module.exports = Song;