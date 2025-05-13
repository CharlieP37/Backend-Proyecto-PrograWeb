const AWS = require('aws-sdk');
require('dotenv').config();

const { AWS_KEY_VALUE, AWS_SECRET_KEY_VALUE, AWS_REGION_VALUE } = process.env

if (!AWS_KEY_VALUE || !AWS_REGION_VALUE || !AWS_SECRET_KEY_VALUE) {
    throw new Error('Missing aws enviroment vars');
};

const analyzeEmotion = async (req, res, next) => {
    const { file } = req;

    if (!file) {
        return res.status(400).json({ error: "Archivo de imagen no cargado" });
    };

    var creds = new AWS.Credentials(AWS_KEY_VALUE, AWS_SECRET_KEY_VALUE);

    AWS.config.credentials = creds;

    AWS.config.update({region: AWS_REGION_VALUE});

    const rekognition = new AWS.Rekognition();

    const params = {
        Image: {
            Bytes: file.buffer
        },
        Attributes: ["ALL"]
    };

    try {
        const response = await rekognition.detectFaces(params).promise();
        if (response.FaceDetails.length > 0) {
            const emotions = [response.FaceDetails[0].Emotions[0], response.FaceDetails[0].Emotions[1], response.FaceDetails[0].Emotions[2]];
            res.status(200).json({response: emotions});
        } else {
            res.status(200).json({ response: response.FaceDetails, message: "No se detectaron rostros" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(error.response.status).json({ error: error, details: error.message});
    }

};

module.exports = { analyzeEmotion };