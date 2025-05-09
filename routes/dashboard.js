var express = require('express');
var router = express.Router();
var controller = require("../controllers/dashboard.controller");

router.post('/weekly-summary', controller.weeklySummary);

module.exports = router;