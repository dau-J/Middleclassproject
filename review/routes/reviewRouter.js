const express = require('express');
const { getProfessors, getReviewList, submitReview, likeReview } = require('../controller/reviewController');
const router = express.Router();

router.get('/professors', getProfessors);
router.get('/list', getReviewList);
router.post('/submit', submitReview);
router.post('/like', likeReview); // 좋아요 라우트

module.exports = router;
