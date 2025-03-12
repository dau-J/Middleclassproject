// 서버에서 데이터 가져오기
fetch("/community/list")
    .then((res) => res.json())
    .then((data) => {
        renderCommunityList(data);
    })
    .catch((error) => console.error("Error fetching community list:", error));

function renderCommunityList(communityData) {
    const communityListContainer = document.querySelector("#community-list");

    console.log(communityData);

    communityData.list.forEach((community) => {
        const { id, title, content, userId, userName, date } = community;

        const card = document.createElement("div");
        card.className = "card mb-4 shadow-sm border-0";
        card.style.cursor = "pointer";
        card.setAttribute(
            "onclick",
            `window.location.href='/community/${id}'`
        );

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text text-muted">${content}</p>
                <small class="text-muted">${userName} · ${new Date(date).toLocaleString()}</small>
            </div>
        `;

        communityListContainer.appendChild(card);
    });
}