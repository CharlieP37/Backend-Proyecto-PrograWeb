const { Op } = require("sequelize");
const EmotionAnalysis = require("../database/models/EmotionAnalysis.js");
const Emotion = require("../database/models/Emotion.js");
const EmotionType = require("../database/models/EmotionType.js");
const Recommendation = require("../database/models/Recommendation.js");
const History = require("../database/models/History.js");

async function getWeeklySummary  (req, res) {
    try {
        const userId = req.user.id;

        const history = await History.findOne({ where: { user_Id: userId } });
        if (!history) return res.status(404).json({ message: "Historial no encontrado para el usuario." });

        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);

        const recommendations = await Recommendation.findAll({
                    where: {
                        createdAt: { [Op.gte]: lastWeek }
                    },
                    include: [
                        {
                            model: EmotionAnalysis,
                            as: 'emotion1',
                            include: {
                                model: Emotion,
                                include: EmotionType
                            }
                        },
                        {
                            model: History,
                            where: { user_Id: userId },
                            attributes: []
                        }
                    ]
                });

        const allEmotions = [];
        recommendations.forEach(rec => {
            ['emotion1', 'emotion2', 'emotion3'].forEach(key => {
                const emoAnal = rec[key];
                if (emoAnal && emoAnal.EMOTION && emoAnal.EMOTION.EMOTION_TYPE) {
                    allEmotions.push({
                        name: emoAnal.EMOTION.name,
                        type: emoAnal.EMOTION.EMOTION_TYPE.name,
                        date: emoAnal.date.toISOString().split('T')[0]
                    });
                }
            });
        });

        const emotionCounts = {};
        allEmotions.forEach(e => {
            emotionCounts[e.name] = (emotionCounts[e.name] || 0) + 1;
        });

        const emotionTypeCount = { Positiva: 0, Negativa: 0, Neutra: 0 };
        allEmotions.forEach(e => {
            if (e.type === 'POSITIVO') emotionTypeCount.Positiva++;
            else if (e.type === 'NEGATIVO') emotionTypeCount.Negativa++;
            else if (e.type === 'NEUTRO') emotionTypeCount.Neutra++;
        });

        const dailyStats = {};
        allEmotions.forEach(e => {
            dailyStats[e.date] = (dailyStats[e.date] || 0) + 1;
        });

        return res.status(200).json({
            emotionChart: emotionCounts,
            emotionTypeChart: emotionTypeCount,
            dailyChart: dailyStats
        });

    } catch (error) {
        console.error("Error en getDashboardSummary:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

module.exports = { getWeeklySummary };
