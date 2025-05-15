var express = require('express');
var router = express.Router();
var controller = require("../controllers/user.controller");

router.get('/me', controller.obtainInfo);
router.get('/options', controller.obtainOptions);
router.post('/save', controller.saveInfo);

module.exports = router;