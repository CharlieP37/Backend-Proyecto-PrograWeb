const jwt = require("jsonwebtoken");
const database = require("../database/config.js");
const Artist = require("../database/models/Artist.js");
const Genre = require("../database/models/Genre.js");
const Song = require("../database/models/Song.js");
const Quiz = require("../database/models/Quiz.js");

const JWT_SECRET = process.env.JWT_SECRET;

const getOptions = async (req, res, next) => {
    const genreOptions = (await Genre.findAll()).map(a => a.name);
    const artistOptions = (await Artist.findAll()).map(a => a.name);
    const songOptions = (await Song.findAll()).map(a => a.name);
    res.status(200).json({ genre: genreOptions, artists: artistOptions, songs: songOptions });
};

async function tokenVerification(token) {
    try {

        const verifiedtoken = jwt.verify(token, JWT_SECRET);
        return verifiedtoken;
        
    } catch (err) {
        return res.status(500).json({ message: "Token verification failed", error: err });
    }
};

const saveAnswers = async (req, res, next) => {

    const { token, genre_Id, artist_Id, song_Id } = req.body;

    const tokenpayload = await tokenVerification(token);

    let quizcreated = null;

    try {

        const newQuiz = await Quiz.create({
            user_Id: tokenpayload.id,
            question_1: genre_Id,
            question_2: artist_Id,
            question_3: song_Id
        });

        quizcreated = newQuiz;
        return res.status(200).json({ message: "Quiz created successfully", quizcreated });

    }
    catch (err) {
        res.status(500).json({ error: "Error al guardar nuevo quiz", details: err.message});
    }

};

module.exports = { getOptions, saveAnswers };