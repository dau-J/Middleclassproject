const express = require('express');
const loginController = require('../api/loginController');

const router = express.Router();


// 로그인 요청 처리
router.post('/login', loginController.login);

module.exports = router;
