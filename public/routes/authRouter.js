const express = require('express');
const router = express.Router();
const authController = require('../api/authController');

// 로그인 상태 확인
router.get('/check-login', authController.checkLogin);

// 로그아웃
router.post('/logout', authController.logout);

module.exports = router;