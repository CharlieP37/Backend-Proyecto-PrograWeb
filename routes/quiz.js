var express = require('express');
var router = express.Router();
var controller = require("../controllers/quiz.controller");

router.get('/', controller.getOptions);
router.post('/', controller.saveAnswers);

module.exports = router;