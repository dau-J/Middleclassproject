const pool = require('../../../../config/databaseSet');

// 커뮤니티 목록보기 
const findAll = async (res) => {

    let sql = `SELECT co.community_id, co.community_title, co.community_content, cu.cus_id, cu.cus_name, co.created_at 
                FROM community co
                JOIN cus cu
                ON co.cus_id = cu.cus_id
                ORDER BY co.created_at DESC;`;

    try {
        const [communityList] = await pool.query(sql);

        const result = communityList.map((c) => ({
            id: c.community_id,
            title: c.community_title,
            content: c.community_content,
            userId: c.cus_id,
            userName: c.cus_name,
            date: c.created_at
        }));

        console.log(result);

        res.status(200).send({
            success: true,
            list: result
        });

    } catch (error) {
        console.error("커뮤니티 목록 조회 중 에러 발생:", error);

        res.status(500).send({
            success: false,
            message: "커뮤니티 목록 조회 중 에러 발생"
        });
    }
}

// 댓글 -> 트리 구조 변환 함수
function nestComments(comments) {
    const commentMap = {}; // 댓글 ID를 키로 하는 맵 생성
    const nestedComments = []; // 최상위 댓글을 담을 배열

    // 모든 댓글을 맵에 저장하고, 기본 구조 생성
    comments.forEach(comment => {
        commentMap[comment.comment_id] = { ...comment, children: [] }; // children 초기화
    });

    // 댓글들을 순회하며 트리 구조 구성
    comments.forEach(comment => {
        const { parent_id, comment_id } = comment;

        if (!parent_id) {
            // 부모 댓글 (parent_id가 null)이면 최상위 배열에 추가
            nestedComments.push(commentMap[comment_id]);
        } else if (commentMap[parent_id]) {
            // 자식 댓글이면 부모 댓글의 children 배열에 추가
            commentMap[parent_id].children.push(commentMap[comment_id]);
        } else {
            console.error(`Parent comment with ID ${parent_id} not found.`);
        }
    });
    return nestedComments;
}


// 커뮤니티 상세보기 
const findById = async (userId, communityId, res) => {
    let sql1 = `SELECT c.community_id, c.community_title, c.cus_id, cu.cus_name, c.community_content, c.created_at,
                CASE WHEN EXISTS (
                        SELECT 1 
                        FROM \`like\` l 
                        WHERE l.community_id = c.community_id AND l.cus_id = ?
                    ) THEN true ELSE false 
                END AS is_like,
                (SELECT COUNT(*) FROM \`like\` l WHERE l.community_id = c.community_id) AS likes
                FROM community c
                JOIN cus cu ON c.cus_id = cu.cus_id
                WHERE c.community_id = ?;`;
    let sql2 = `SELECT co.comment_id, co.content, cu.cus_id, cu.cus_name, co.parent_id, co.created_at
                FROM comment co
                JOIN cus cu ON co.cus_id = cu.cus_id
                WHERE co.community_id = ?
                ORDER BY co.parent_id ASC, co.created_at ASC;`;

    try {

        console.log(userId, communityId)
        const [sql1Result] = await pool.query(sql1, [userId, communityId]);

        if (sql1Result.length === 0) {
            return res.status(404).send({
                success: false,
                message: "해당 글을 찾을 수 없습니다."
            });
        }

        const community = sql1Result[0];

        const [comments] = await pool.query(sql2, [communityId]);

        // 댓글 트리 구성
        const nestedComments = comments.length > 0 ? nestComments(comments) : [];

        const result = {
            community_id: community.community_id,
            title: community.community_title,
            cus_id: community.cus_id,
            author: community.cus_name,
            content: community.community_content,
            date: community.created_at,
            is_like: community.is_like,
            likes: community.likes,
            comments: nestedComments
        };

        res.status(200).send({
            success: true,
            detail: result
        });

    } catch (error) {
        console.error("커뮤니티 상세보기 조회 중 에러 발생:", error);
        res.status(500).send({
            success: false,
            message: "커뮤니티 상세보기 조회 중 에러 발생"
        });
    }
}

// 커뮤니티 글쓰기
const uploadByUserId = async (userId, req, res) => {
    let sql = `INSERT INTO community(community_title, community_content, cus_id, created_at) 
                    VALUES (?, ?, ?, NOW())`;
    try {
        const [result] = await pool.query(sql, [req.body.title, req.body.content, userId]);

        console.log(result);

        res.status(200).send({
            success: true,
            message: "글이 등록되었습니다."
        });

    } catch (error) {
        console.error("커뮤니티 글 저장 중 에러 발생:", error);
        res.status(500).send({
            success: false,
            message: "커뮤니티 글 저장 중 에러 발생. 나중에 다시 시도해주세요."
        });
    }
}

// 커뮤니티 글 수정
const updateById = async (communityId, req, res) => {
    let sql = `UPDATE community 
                SET community_title = ?, community_content = ?
                WHERE community_id = ?`;

    try {
        const [result] = await pool.query(sql, [req.body.title, req.body.content, communityId]);

        console.log(result);

        res.status(200).send({
            success: true,
            message: "글이 수정되었습니다."
        });

    } catch (error) {
        console.error("커뮤니티 글 수정 중 에러 발생:", error);
        res.status(500).send({
            success: false,
            message: "커뮤니티 글 수정 중 에러 발생. 나중에 다시 시도해주세요."
        });
    }
}


// 커뮤니티 글 삭제
const deleteById = async (communityId, req, res) => {
    let sql1 = `DELETE FROM comment
                WHERE community_id = ? `
    let sql2 = `DELETE FROM \`like\`
                WHERE community_id = ? `
    let sql3 = `DELETE FROM community
                WHERE community_id = ?`;

    try {
        const [result1] = await pool.query(sql1, [communityId]);
        console.log(result1);

        const [result2] = await pool.query(sql2, [communityId]);
        console.log(result2);

        const [result3] = await pool.query(sql3, [communityId]);
        console.log(result3);

        res.status(200).send({
            success: true,
            message: "글이 삭제되었습니다."
        });

    } catch (error) {
        console.error("커뮤니티 글 삭제 중 에러 발생:", error);
        res.status(500).send({
            success: false,
            message: "커뮤니티 글 삭제 중 에러 발생. 나중에 다시 시도해주세요."
        });
    }
}

// 좋아요 추가
const createLike = async (userId, communityId, res) => {
    const sql = `INSERT INTO \`like\` (cus_id, community_id, created_at) 
                        VALUES (?, ?, NOW())`;

    try {
        const [result] = await pool.query(sql, [userId, communityId]);

        console.log(result);

        res.status(200).send({
            success: true,
            message: "좋아요를 추가했습니다."
        });
    } catch (error) {
        console.error("좋아요 처리 중 에러 발생:", error);
        res.status(500).send({
            success: false,
            message: "좋아요 처리 중 에러가 발생했습니다. 나중에 다시 시도해주세요."
        });
    }
};

// 좋아요 삭제
const deleteLike = async (userId, communityId, res) => {
    const sql = `DELETE FROM \`like\` 
                        WHERE cus_id = ? AND community_id = ?`;

    try {
        const [result] = await pool.query(sql, [userId, communityId]);

        console.log(result);

        res.status(200).send({
            success: true,
            message: "좋아요를 삭제했습니다."
        });
    } catch (error) {
        console.error("좋아요 처리 중 에러 발생:", error);
        res.status(500).send({
            success: false,
            message: "좋아요 처리 중 에러가 발생했습니다. 나중에 다시 시도해주세요."
        });
    }

};

// 커뮤니티 댓글 및 대댓글 작성
const createComment = async (userId, communityId, content, parentId, res) => {

    const sql = `INSERT INTO comment (community_id, cus_id, parent_id, content, created_at) 
    VALUES (?, ?, ?, ?, NOW())`;

    try {

        const [result] = await pool.query(sql, [communityId, userId, parentId, content]);

        console.log(result);

        const comment = {
            commentId: result.insertId,
            communityId,
            userId,
            parentId,
            content,
            createdAt: new Date()
        };

        res.status(201).json({
            success: true,
            message: "댓글이 작성되었습니다.",
            data: comment
        });
    } catch (error) {
        console.error("커뮤니티 댓글 작성 중 에러 발생:", error);
        res.status(500).json({
            success: false,
            message: "댓글 작성 중 에러가 발생했습니다. 나중에 다시 시도해주세요."
        });
    }

};

// 커뮤니티 댓글 삭제
const deleteComment = async (commentId, res) => {
    let sql = `DELETE FROM comment
                WHERE comment_id = ? OR parent_id = ?`;

    try {
        const [result] = await pool.query(sql, [commentId, commentId]);

        console.log(result);

        res.status(200).send({
            success: true,
            message: "댓글이 삭제되었습니다."
        });

    } catch (error) {
        console.error("커뮤니티 댓글 삭제 중 에러 발생:", error);
        res.status(500).send({
            success: false,
            message: "커뮤니티 댓글 삭제 중 에러 발생. 나중에 다시 시도해주세요."
        });
    }
}

module.exports = { findAll, findById, uploadByUserId, updateById, deleteById, createLike, deleteLike, createComment, deleteComment }