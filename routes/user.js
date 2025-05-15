var express = require('express');
var router = express.Router();
var controller = require("../controllers/user.controller");

router.get('/me', controller.obtainInfo);
router.get('/options', controller.obtainOptions);

module.exports = router;