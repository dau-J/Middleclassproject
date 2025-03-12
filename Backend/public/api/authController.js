// 로그인 상태 확인
const checkLogin = (req, res) => {
    const userId = req.cookies.user_id;

    if (userId) {
        res.status(200).json({ loggedIn: true, nickname: userId });
    } else {
        res.status(200).json({ loggedIn: false });
    }
};


// 로그아웃
const logout = (req, res) => {
    res.clearCookie('user_id');
    res.status(200).json({ message: '로그아웃 성공' });
};


module.exports = {checkLogin, logout };