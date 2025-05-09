var express = require('express');
var router = express.Router();
var controller = require("../controllers/user.controller");

router.get('/me', controller.obtainInfo);

module.exports = router;