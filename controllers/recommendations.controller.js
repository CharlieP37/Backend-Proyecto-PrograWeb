const axios = require('axios');
const jwt = require("jsonwebtoken");
const database = require("../database/config.js");
const History = require("../database/models/History.js");
const Recommendation = require("../database/models/Recommendation.js");
const Type = require("../database/models/Type.js");
const Emotion = require("../database/models/Emotion.js");
const EmotionAnalysis = require("../database/models/EmotionAnalysis.js");
require('dotenv').config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

async function tokenVerification(token) {
    try {

        const verifiedtoken = jwt.verify(token, JWT_SECRET);
        return verifiedtoken;
        
    } catch (err) {
        console.error(`Token verification failed: ${err.message}`);
        return false;
    }
};

async function getAccessToken() {
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post('https://accounts.spotify.com/api/token',
            new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
            {
                headers: {
                    Authorization: `Basic ${authString}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.message);
        throw error;
    }
};

const getRecommendation = async (req, res, next) => {
    const mood = req.body.mood;
    const token = await getAccessToken();

    if (!mood) {
        return res.status(400).json({ message: "No mood specified", error: "A mood most be specified" });
    }

    try {
        const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                q: mood,
                type: 'playlist',
                limit: 50
            }
        });

        const playlists = searchResponse.data.playlists.items;
        const validPlaylists = playlists.filter(p => p !== null);

        if (validPlaylists.lenght === 0){
            return res.status(404).json({ error: `No playlists found for mood: ${mood}` });
        };
        
        const randomIndex = Math.floor(Math.random() * validPlaylists.length);
        const randomPlaylist = validPlaylists[randomIndex];
        const playlistId = randomPlaylist.id;

        const tracksResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                limit: 50
            }
        });

        const validTracks = tracksResponse.data.items.filter(item => item.track !== null);

        if (validTracks.lenght === 0) {
            return res.status(404).json({ error: `No valid tracks found in playlist: ${randomPlaylist.name}` });
        }

        const track = validTracks[Math.floor(Math.random() * validTracks.length)].track;
        res.status(200).json({ mood: mood, name: track.name, artist: track.artists.map(a => a.name).join(', '), cover: track.album.images[1].url, track: track });

    } catch (error) {
        console.error('Error fetching playlist tracks:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Internal Server Error'
        });
    };

};

const saveRecommendation = async (req, res, next) => {
    const { token, emotions, track } =  req.body;

    const tokenpayload = await tokenVerification(token);

    if (!tokenpayload) {
        return res.status(500).json({ message: "Token verification failed" });
    }

    try {

        const HistoryId = await History.findAll({ attributes: ['history_Id'], where: { user_Id: tokenpayload.id }});

        const EmotionId1 = await Emotion.findAll({ attributes: ['emotion_Id'], where: { name: emotions[0].Type } });
        const EmotionId2 = await Emotion.findAll({ attributes: ['emotion_Id'], where: { name: emotions[1].Type } });
        const EmotionId3 = await Emotion.findAll({ attributes: ['emotion_Id'], where: { name: emotions[2].Type } });

        const TypeId = await Type.findAll({attributes: ["type_Id"], where: { name: track.track.type }});

        const emotion1 = await EmotionAnalysis.create({
            emotion_Id: EmotionId1[0].dataValues.emotion_Id,
            confidence: emotions[0].Confidence,
            date: Date.now()
        });

        const emotion2 = await EmotionAnalysis.create({
            emotion_Id: EmotionId2[0].dataValues.emotion_Id,
            confidence: emotions[1].Confidence,
            date: Date.now()
        });

        const emotion3 = await EmotionAnalysis.create({
            emotion_Id: EmotionId3[0].dataValues.emotion_Id,
            confidence: emotions[2].Confidence,
            date: Date.now()
        });

        const recommendationcreated = await Recommendation.create({
            history_Id: HistoryId[0].dataValues.history_Id,
            spotify_id: track.track.id,
            name: track.track.name,
            URL: track.track.external_urls.spotify,
            feedback: null,
            JSON: track.track,
            type_Id: TypeId[0].dataValues.type_Id,
            emotion_1: emotion1.dataValues.emotionanalysis_Id,
            emotion_2: emotion2.dataValues.emotionanalysis_Id,
            emotion_3: emotion3.dataValues.emotionanalysis_Id
        });

        return res.status(200).json({ message: "Recommendation saved successfully", recommendationcreated });

    } catch (error) {
        res.status(500).json({ error: "Error al guardar recomendación", details: error.message});
    }
};

const getHistory = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    const tokenpayload = await tokenVerification(token);

    if (!tokenpayload) {
        return res.status(500).json({ message: "Token verification failed" });
    }

    try {
        const HistoryId = await History.findAll({ attributes: ['history_Id'], where: { user_Id: tokenpayload.id }});
        const Recommendations = await Recommendation.findAll({ where: {history_Id: HistoryId[0].dataValues.history_Id} });
        const Emotions = Recommendations.map((recomendation, index) => ({emotion: recomendation.emotion_1}));
        const EmotionId = (await Promise.all(Emotions.map(async (emotion) => EmotionAnalysis.findAll({ attributes: ["emotion_Id"], where: { emotionanalysis_Id: emotion.emotion } })))).flat();
        const EmotionName = (await Promise.all(EmotionId.map(async (emotion) => Emotion.findAll({ attributes: ["name"], where: { emotion_Id: emotion.emotion_Id } })))).flat();

        let data = [];
        for (let index = 0; index < Recommendations.length; index++) {
            const element = {
                title: Recommendations[index].JSON.name, 
                artist: Recommendations[index].JSON.artists.map(a => a.name).join(', '),
                image: Recommendations[index].JSON.album.images[1].url,
                emotion: EmotionName[index].name,
                feedback: Recommendations[index].feedback,
                date: Recommendations[index].createdAt.toISOString().split("T")[0]
            };
            data.push(element);
        }
        res.status(200).json({ result: data });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener recomendaciones", details: error.message});
    }
};

const getLatest = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    const tokenpayload = await tokenVerification(token);

    if (!tokenpayload) {
        return res.status(500).json({ message: "Token verification failed" });
    }

    try {
        const HistoryId = await History.findAll({ attributes: ['history_Id'], where: { user_Id: tokenpayload.id }});
        const Recommendations = await Recommendation.findAll({ where: {history_Id: HistoryId[0].dataValues.history_Id} });
        const Emotions = Recommendations.map((recomendation, index) => ({emotion: recomendation.emotion_1}));
        const EmotionId = (await Promise.all(Emotions.map(async (emotion) => EmotionAnalysis.findAll({ attributes: ["emotion_Id"], where: { emotionanalysis_Id: emotion.emotion } })))).flat();
        const EmotionName = (await Promise.all(EmotionId.map(async (emotion) => Emotion.findAll({ attributes: ["name"], where: { emotion_Id: emotion.emotion_Id } })))).flat();

        let data = [];
        for (let index = Recommendations.length - 1; index >= 0 && index > Recommendations.length - 4; index--) {
            const element = {
                title: Recommendations[index].JSON.name, 
                artist: Recommendations[index].JSON.artists.map(a => a.name).join(', '),
                image: Recommendations[index].JSON.album.images[1].url,
                emotion: EmotionName[index].name,
                feedback: Recommendations[index].feedback
            };
            data.push(element);
        }
        res.status(200).json({ result: data });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener recomendaciones", details: error.message});
    }
};

module.exports = { getRecommendation, getHistory, getLatest, saveRecommendation };