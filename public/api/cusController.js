const pool = require('../../config/databaseSet'); // DB 설정

const register = async (req, res) => {
    const paramId = req.body.id;
    const paramName = req.body.name;
    const paramAge = req.body.age;
    const paramPassword = req.body.password;
   
    try {
        conn = await pool.getConnection();

        // 1. 사용자 ID 중복 확인
        const [existingUser] = await conn.query('SELECT user_id FROM users WHERE user_id = ?', [paramId]);
        if (existingUser.length > 0) {
            res.status(400).json({ message: '이미 존재하는 사용자 ID입니다.' });
            return;
        }

        // 2. 사용자 ID 추가
        await conn.query('INSERT INTO users (user_id, user_type) VALUES (?, ?)', [paramId, 'cus']);

        // 3. 고객 정보 추가
        await conn.query(
            'INSERT INTO cus (id, cus_name, cus_age, cus_password) VALUES (?, ?, ?, ?)',
            [paramId, paramName, paramAge, paramPassword]
        );

        // 회원가입 성공 후 login.html로 이동
        res.send(`
            <script>
                alert('회원가입이 성공적으로 완료되었습니다');
                window.location.href = '/public/login.html';
            </script>
        `);
    } catch (err) {
        console.error('회원가입 오류:', err);

        // 서버 오류 응답
        res.status(500).json({ message: '회원가입 중 문제가 발생했습니다.', error: err });
    } finally {
        if (conn) conn.release(); // 커넥션 반환
    }
};

module.exports = { register };
