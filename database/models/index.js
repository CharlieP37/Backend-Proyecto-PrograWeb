const sequelize = require("../config.js");
const Artist = require("./Artist.js");
const Country = require("./Country.js");
const Emotion = require("./Emotion.js");
const EmotionAnalysis = require("./EmotionAnalysis.js");
const EmotionType = require("./EmotionType.js");
const Genre = require("./Genre.js");
const History = require("./History.js");
const Person = require("./Person.js");
const Quiz = require("./Quiz.js");
const Recommendation = require("./Recommendation.js");
const Song = require("./Song.js");
const Type = require("./Type.js");
const User = require("./User.js");
require("./associations.js");

sequelize.sync({ force: false })
.then(() => {
    console.log("Database synchronized");
}).catch((err) => {
    console.log("Sequelize error: ", err);
});

module.exports = { sequelize, Artist, Country, Emotion, EmotionAnalysis, EmotionType, Genre, History, Person, Quiz, Recommendation, Song, Type, User };