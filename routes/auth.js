var express = require('express');
var router = express.Router();
var controller = require("../controllers/auth.controller");

router.post('/register', controller.registerNewUser);
router.post('/login', controller.loginUser);

module.exports = router;