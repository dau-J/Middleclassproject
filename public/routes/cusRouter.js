// cusRouter.js
const express = require('express');
const router = express.Router();
const cusController = require('../api/cusController');

// 고객 회원가입
router.post('/cus', cusController.register);

module.exports = router;