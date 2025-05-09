const obtainInfo = async (req, res, next) => {
    res.status(200).json({ message: "Exito" });
};

module.exports = { obtainInfo };