const professorService = require('../service/professorService');

// 교수 목록보기
const professorList = (req, res) => {
    const userId = req.body.cusId; // 로그인한 회원 id 가져오기
    professorService.findAll(userId, res);
};

// 교수 상세보기 
const professorDetail = (req, res) => {
    const userId = req.body.cusId; // 로그인한 회원 id 가져오기
    let professorId = req.params.id;
    professorService.findById(userId, professorId, res);
};

// 교수 탈퇴
const professorQuit = (req, res) => {
    const professorId = req.params.id; // 교수 id 가져오기
    professorService.deleteById(professorId, res);
}

// 교수 즐겨찾기 토글 (추가/취소)
const toggleStar = async (req, res) => {
    const userId = req.body.cusId; // 로그인한 회원 id 가져오기
    const professorId = req.params.id;

    try {
        const isStared = await professorService.toggleStar(userId, professorId);
        res.status(200).send({
            success: true,
            message: isStared ? "즐겨찾는 교수에 추가했습니다." : "즐겨찾는 교수를 취소했습니다."
        });
    } catch (error) {
        console.error("즐겨찾기 처리 중 에러 발생:", error);
        res.status(500).send({
            success: false,
            message: "즐겨찾기 처리 중 에러가 발생했습니다. 나중에 다시 시도해주세요."
        });
    }

};

module.exports = { professorList, professorDetail, professorQuit, toggleStar }