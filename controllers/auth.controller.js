const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const database = require("../database/config.js");
const User = require("../database/models/User.js");
require('dotenv').config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const PEPPER = parseInt(process.env.PEPPER);
const JWT_SECRET = process.env.JWT_SECRET;

async function hashPassword(passwordPlain){
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const peppered = PEPPER + passwordPlain;
    try {
        const response = bcrypt.hash(peppered, salt);
        return response;
    }
    catch (error) {
        console.error('Error creating the hash.', error.message);
        return res.status(error.status).json({ message: 'Error creating the hash.', error: error.message});
    }
};

async function comparePassword(passwordPlain, hashStored) {
    const peppered = PEPPER + passwordPlain;
    try {
        const response = bcrypt.compare(peppered, hashStored);
        return response;
    }
    catch (error) {
        console.error('Error validating the hash.', error.message);
        return res.status(error.status).json({ message: 'Error validation the hash.', error: error.message});
    }
};

const registerNewUser = async (req, res, next) => {
    const { user, email, password, birthday } = req.body;

    if (!user && !email && !password && !birthday) {
        return res.status(400).json({ message: "Registration failed", error: "Credenciales inválidas. Se requiere usuario, email, contraseña y fecha de nacimiento." });
    }

    if (!user) {
        return res.status(400).json({ message: "Registration failed", error: "Credenciales inválidas. Se requiere usuario." });
    }

    if (!email) {
        return res.status(400).json({ message: "Registration failed", error: "Credenciales inválidas. Se requiere email." });
    }

    if (!password) {
        return res.status(400).json({ message: "Registration failed", error: "Credenciales inválidas. Se requiere contraseña." });
    }

    if (!birthday) {
        return res.status(400).json({ message: "Registration failed", error: "Credenciales inválidas. Se requiere fecha de nacimiento." });
    }

    const hashedpass = await hashPassword(password);

    let usercreated = null;

    try {

        const newUser = await User.create({
            username: user,
            password: hashedpass,
            email: email
        });

        usercreated = newUser;

    }
    catch (err) {
        res.status(500).json({ error: "Error al crear nuevo usuario", details: err});
    }

    try {
        const token = jwt.sign(
            { id: usercreated.user_Id, user: user, email: email },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({ message: "Registration successful", token });
        
    } catch (err) {
        return res.status(500).json({ message: "Registration failed", error: err });
    }

};

const loginUser = async (req, res, next) => {
    const { user, password } = req.body;

    if (!user && !password) {
        return res.status(400).json({ message: "Login failed", error: "Credenciales inválidas. Se requiere email y contraseña." });
    }

    if (!user) {
        return res.status(400).json({ message: "Login failed", error: "Credenciales inválidas. Se requiere email." });
    }

    if (!password) {
        return res.status(400).json({ message: "Login failed", error: "Credenciales inválidas. Se requiere contraseña." });
    }

    const usercredentials = await User.findAll({where: {username: user}})

    if (!usercredentials) {
        return res.status(404).json({ message: "Login failed", error: "Usuario no existe." });
    }

    const hashedpass = usercredentials[0].dataValues.password;
    const result = await comparePassword(password, hashedpass);

    if (!result) {
        return res.status(401).json({ message: "Login failed", error: "Contraseña incorrecta." });
    }

    try {
        const token = jwt.sign(
            { id: usercredentials[0].dataValues.user_Id, user: user, email: usercredentials[0].dataValues.email },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({ message: "Login successful", token });
        
    } catch (err) {
        return res.status(500).json({ message: "Login failed", error: err.message });
    }

};

module.exports = { registerNewUser, loginUser };