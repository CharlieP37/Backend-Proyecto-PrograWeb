const jwt = require('jsonwebtoken');
const database = require('../database/config.js');
const Country = require('../database/models/Country.js');
const Person = require('../database/models/Person.js');
const User = require('../database/models/User.js');

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

const obtainInfo = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    const tokenpayload = await tokenVerification(token);

    if (!tokenpayload) {
        return res.status(403).json({ message: "Token verification failed" });
    }

    try {
        const personInfo = await Person.findAll({ where: {user_Id: tokenpayload.id}});
        const userInfo = await User.findByPk(personInfo[0].user_Id);
        const coutryname = await Country.findByPk(personInfo[0].country_Id);
        const profileInfo = { username: userInfo.username, email: userInfo.email, name: personInfo[0].name, lastname: personInfo[0].lastname, birthdate: personInfo[0].birthdate, sex: personInfo[0].sex, country: coutryname.name };
        res.status(200).json({ profile: profileInfo });
    } catch(error) {
        res.status(500).json({ error: "Error al obtener datos del usuario ", message: error.message });
    }
};

const obtainOptions = async (req, res, next) => {
    try {
        const countries = (await Country.findAll()).map(a => a.name);
        res.status(200).json({ country: countries });
    } catch (error) {
        res.status(500).json({ error: "Error al consultar en la base de datos", details: error.message });
    }
};

const saveInfo = async (req, res, next) => {
    const { token, profile } = req.body;

    const tokenpayload = await tokenVerification(token);

    if (!tokenpayload) {
        return res.status(403).json({ message: "Token verification failed" });
    }

    if (!profile.name || !profile.lastname || !profile.birthdate || !profile.sex || !profile.country){
        res.status(400).json({ error: "Error no se encuentran todos los datos necesarios" });
    }

    try {
        
        const newPerson = await Person.create({
            user_Id: tokenpayload.id,
            name: profile.name,
            lastname: profile.lastname,
            birthdate: profile.birthdate,
            sex: profile.sex,
            country_Id: profile.country
        });
        
        return res.status(200).json({ message: "Person created successfully", newPerson });

    } catch (error) {
        res.status(500).json({ error: "Error al crear nuevo perfil de persona", details: error.message});
    }
    
};

const updateInfo = async (req, res) => {
    const { token, profile } = req.body;

    const tokenpayload = await tokenVerification(token);

    if (!tokenpayload) {
        return res.status(403).json({ message: "Token verification failed" });
    }

    if (!profile.username || !profile.email || !profile.name || !profile.lastname || !profile.birthdate || !profile.sex || !profile.country){
        res.status(400).json({ error: "Error no se encuentran todos los datos necesarios" });
    }

    try {
        const user = await User.findByPk(tokenpayload.id);
        const person = await Person.findAll( {where: {user_Id: tokenpayload.id}} );

        await user.update({
            email: profile.email,
            updatedAt: new Date()
        });

        await person[0].update({
            name: profile.name,
            lastname: profile.lastname,
            sex: profile.sex, 
            country_Id: profile.country, 
            updatedAt: new Date()
        });

        res.status(200).json({message: "Perfil actualizado con éxito", data: {user, person}});

    } catch (error) {
        res.status(500).json({ error: "Error al actualizar información de perfil.", details: error.message});
    }
};

module.exports = { obtainInfo, obtainOptions, saveInfo, updateInfo };