var express = require('express');
var router = express.Router();
var controller = require("../controllers/emotion.controller");
const multer = require('multer');
const upload = multer();

router.post('/analyze', upload.single('file'), controller.analyzeEmotion);

module.exports = router;