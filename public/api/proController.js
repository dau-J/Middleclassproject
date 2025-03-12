const path = require('path');
const pool = require('../../config/databaseSet');

/*교수 로그인
const login = async (req, res) => {
    const paramId = req.body.id;
    const paramPassword = req.body.password;

    try {
        const conn = await pool.getConnection();
        const [rows] = await conn.query('SELECT `pro_id` FROM `pro` WHERE `pro_id` = ? AND `pro_password` = ?', [paramId, paramPassword]);
        conn.release();

        if (rows.length > 0) {
            res.cookie('user_id', paramId, { maxAge: 900000, httpOnly: true });
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
            res.write('<h2>로그인 성공</h2>');
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
            res.write('<h2>로그인 실패, 아이디와 패스워드를 확인하세요.</h2>');
            res.end();
        }
    } catch (err) {
        console.error("DB connection or query error:", err);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        res.write('<h1>DB 서버 연결 실패 또는 SQL query 실패</h1>');
        res.end();
    }
};
*/

// 교수 회원가입
const register = async (req, res) => {
    const paramId = req.body.id;
    const paramName = req.body.name;
    const paramAge = req.body.age;
    const paramPassword = req.body.password;
    const paramPath = req.file ? path.join('C:/proimage', req.file.filename) : '';

    try {
        const conn = await pool.getConnection();

        const [existingUser] = await conn.query('SELECT user_id FROM users WHERE user_id = ?', [paramId]);
        if (existingUser.length > 0) {
            conn.release();
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
            res.write('<h2>이미 존재하는 사용자 ID입니다.</h2>');
            res.end();
            return;
        }

        await conn.query('INSERT INTO users (user_id, user_type) VALUES (?, ?)', [paramId, 'pro']);
        await conn.query('INSERT INTO pro (pro_id, pro_name, pro_age, pro_password, pro_path, pro_check) VALUES (?, ?, ?, ?, ?, ?)', [paramId, paramName, paramAge, paramPassword, paramPath, false]);
        conn.release();

        res.send(`
            <script>
                alert('회원가입이 성공적으로 완료되었습니다');
                window.location.href = '/public/login.html';
            </script>
        `);
    } catch (err) {
        console.error("DB connection or query error:", err);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        res.write('<h1>사용자 추가 실패</h1>');
        res.end();
    }
};
module.exports = { register };