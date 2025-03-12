const express = require('express');
const router = express.Router();
const path = require('path');
const communityController = require('../../api/community/controller/communityController');

router.get('/writer', (req, res) => {
    res.sendFile(path.join(__dirname, "../../../view/communityPost.html"))
});

// 커뮤니티 목록보기
router.get('/list', communityController.communityList);
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../view/communityList.html"));
});

// 커뮤니티 상세보기 
router.get('/list/:communityId', communityController.communityDetail);
router.get("/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../view/communityDetail.html"));
});

// 커뮤니티 글쓰기
router.post('/upload', communityController.communityUpload);

// 커뮤니티 글 수정
router.patch('/:communityId', communityController.communityModify);

// 커뮤니티 글 삭제
router.delete('/:communityId', communityController.communityDelete);

// 커뮤니티 좋아요 추가
router.post('/:communityId/like', communityController.createLike);

// 커뮤니티 좋아요 삭제
router.delete('/:communityId/like', communityController.deleteLike);

// 커뮤니티 댓글 작성
router.post('/:communityId/comments', communityController.createComment);

// 커뮤니티 댓글 삭제
router.delete('/:communityId/comments/:commentId', communityController.deleteComment);

module.exports = router;