const communityService = require('../service/communityService');

// 커뮤니티 목록보기
const communityList = (req, res) => {
    communityService.findAll(res);
};

// 커뮤니티 상세보기
const communityDetail = (req, res) => {
    const userId = req.cookies.user_id;

    if (!userId) {
        return res.status(401).send({
            success: false,
            message: "로그인이 필요한 페이지입니다."
        });
    }
    let communityId = req.params.communityId;
    communityService.findById(userId, communityId, res);
};

// 커뮤니티 글쓰기
const communityUpload = (req, res) => {
    const userId = req.cookies.user_id;

    if (!req.body.title || !req.body.content) {
        return res.status(400).send({
            success: false,
            message: "제목 또는 내용을 작성해주세요."
        });
    }

    communityService.uploadByUserId(userId, req, res);
};

// 커뮤니티 글 수정
const communityModify = (req, res) => {
    const userId = req.cookies.user_id;
    let communityId = req.params.communityId;

    if (!req.body.title || !req.body.content) {
        return res.status(400).send({
            success: false,
            message: "제목 또는 내용을 작성해주세요."
        });
    }

    if (req.body.cusId != userId) {
        return res.status(403).send({
            success: false,
            message: "글을 수정할 권한이 없습니다."
        });
    }

    communityService.updateById(communityId, req, res);
};

// 커뮤니티 글 삭제
const communityDelete = (req, res) => {
    const userId = req.cookies.user_id;
    let communityId = req.params.communityId;

    console.log(userId);
    console.log(req.body.cusId);

    if (req.body.cusId != userId) {
        return res.status(403).send({
            success: false,
            message: "글을 삭제할 권한이 없습니다."
        });
    }

    communityService.deleteById(communityId, req, res);
}

// 커뮤니티 좋아요 추가
const createLike = async (req, res) => {
    const userId = req.cookies.user_id;
    const communityId = req.params.communityId;

    communityService.createLike(userId, communityId, res);
};

// 커뮤니티 좋아요 삭제
const deleteLike = async (req, res) => {
    const userId = req.cookies.user_id;
    const communityId = req.params.communityId;

    communityService.deleteLike(userId, communityId, res);
};

// 커뮤니티 댓글 작성
const createComment = async (req, res) => {
    const userId = req.cookies.user_id;
    const communityId = req.params.communityId;
    const content = req.body.content;
    const parentId = req.body.parentId ? req.body.parentId : null;

    console.log("parentId : " + parentId);

    communityService.createComment(userId, communityId, content, parentId, res);
};

// 커뮤니티 댓글 삭제
const deleteComment = async (req, res) => {
    const userId = req.cookies.user_id;
    const commentId = req.params.commentId;

    if (req.body.cusId != userId) {
        return res.status(403).send({
            success: false,
            message: "댓글을 삭제할 권한이 없습니다."
        });
    }

    communityService.deleteComment(commentId, res);
};


module.exports = { communityList, communityDetail, communityUpload, communityModify, communityDelete, createLike, deleteLike, createComment, deleteComment, }