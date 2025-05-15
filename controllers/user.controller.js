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
        return res.status(500).json({ message: "Token verification failed", error: err });
    }
};

const obtainInfo = async (req, res, next) => {
    const { token } = req.body;

    const tokenpayload = await tokenVerification(token);

    try {
        const personInfo = await Person.findAll({ where: {user_Id: tokenpayload.id}});
        console.log(personInfo);
        res.status(200).json({ profile: personInfo });
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

module.exports = { obtainInfo, obtainOptions, saveInfo };