const registerNewUser = async (req, res, next) => {
    res.status(200).json({ message: "Exito" });
};


const loginUser = async (req, res, next) => {
    res.status(200).json({ message: "Exito" });
};

module.exports = { registerNewUser, loginUser };