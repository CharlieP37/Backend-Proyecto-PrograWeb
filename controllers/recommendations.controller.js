const getRecommendation = async (req, res, next) => {
    res.status(200).json({ message: "Exito" });
};

const getHistory = async (req, res, next) => {
    res.status(200).json({ message: "Exito" });
};

const getLatest = async (req, res, next) => {
    res.status(200).json({ message: "Exito" });
};

module.exports = { getRecommendation, getHistory, getLatest };