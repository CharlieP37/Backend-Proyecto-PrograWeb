var express = require('express');
var router = express.Router();
var controller = require("../controllers/emotion.controller");

router.post('/analyze', controller.analyzeEmotion);

module.exports = router;