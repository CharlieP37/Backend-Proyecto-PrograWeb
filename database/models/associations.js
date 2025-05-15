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

Country.hasMany(Person, {foreignKey: "country_Id"});
Person.belongsTo(Country, {foreignKey: "country_Id"});

User.hasOne(Person, {foreignKey: "user_Id"});
Person.belongsTo(User, {foreignKey: "user_Id"});

Genre.hasMany(Quiz, {foreignKey: "question_Id"});
Quiz.belongsTo(Genre, {foreignKey: "question_Id"});

Artist.hasMany(Quiz, {foreignKey: "question_2"});
Quiz.belongsTo(Artist, {foreignKey: "question_2"});

Song.hasMany(Quiz, {foreignKey: "question_3"});
Quiz.belongsTo(Song, {foreignKey: "question_3"});

User.hasOne(Quiz, {foreignKey:"user_Id"});
Quiz.belongsTo(User, {foreignKey:"user_Id"});

User.hasOne(History, {foreignKey: "user_Id"});
History.belongsTo(User, {foreignKey: "user_Id"});

History.hasMany(Recommendation, {foreignKey: "history_Id"});
Recommendation.belongsTo(History, {foreignKey: "history_Id"});

Type.hasMany(Recommendation, {foreignKey: "type_Id"});
Recommendation.belongsTo(Type, {foreignKey: "type_Id"});

EmotionType.hasMany(Emotion, {foreignKey:"emotiontype_Id"});
Emotion.belongsTo(EmotionType, {foreignKey: "emotiontype_Id"});

Emotion.hasMany(EmotionAnalysis, {foreignKey: "emotion_Id"});
EmotionAnalysis.belongsTo(Emotion, {foreignKey: "emotion_Id"});

EmotionAnalysis.hasMany(Recommendation, {as: 'recommendations1', foreignKey: "emotion_1"});
EmotionAnalysis.hasMany(Recommendation, {as: 'recommendations2', foreignKey: "emotion_2"});
EmotionAnalysis.hasMany(Recommendation, {as: 'recommendations3', foreignKey: "emotion_3"});

Recommendation.belongsTo(EmotionAnalysis, {as: 'emotion1', foreignKey: "emotion_1"});
Recommendation.belongsTo(EmotionAnalysis, {as: 'emotion2', foreignKey: "emotion_2"});
Recommendation.belongsTo(EmotionAnalysis, {as: 'emotion3', foreignKey: "emotion_3"});