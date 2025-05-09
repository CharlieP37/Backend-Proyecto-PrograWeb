var express = require('express');
var router = express.Router();
var controller = require("../controllers/recommendations.controller");

router.post('/', controller.getRecommendation);
router.get('/history', controller.getHistory);
router.get('/latest', controller.getLatest);

module.exports = router;