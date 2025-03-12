document.addEventListener('DOMContentLoaded', async () => {
    const userMessage = document.getElementById('userMessage'); // 로그인 메시지 표시 요소
    const userActionButton = document.getElementById('userActionButton'); // 버튼 요소

    try {
        // 로그인 상태 확인 API 호출
        const response = await fetch('/routes/check-login', {
            method: 'GET',
            credentials: 'include' // 쿠키 포함 요청
        });
        const data = await response.json();

        if (data.loggedIn) {
            // 로그인 상태 UI 업데이트
            userMessage.textContent = `${data.nickname}님 환영합니다!`;
            userActionButton.textContent = '로그아웃';
            userActionButton.onclick = async () => {
                // 로그아웃 API 호출
                await fetch('/routes/logout', { method: 'POST', credentials: 'include' });
                location.reload(); // 페이지 새로고침
            };
        } else {
            // 비로그인 상태 UI 유지
            userMessage.textContent = '로그인 후 이용해주세요';
            userActionButton.textContent = '로그인';
            userActionButton.onclick = () => {
                window.location.href = '../public/login.html'; // 로그인 페이지로 이동
            };
        }
    } catch (error) {
        console.error('로그인 상태 확인 실패:', error); // 에러 출력
    }
});

