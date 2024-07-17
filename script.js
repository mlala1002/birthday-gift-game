const items = [
    { name: "입술 박치기", icon: "💋" },
    { name: "행운의 편지", icon: "✉️" },
    { name: "필살 베어허그", icon: "🤗" },
    { name: "사랑의 목줄", icon: "❤️" },
    { name: "이빨 피아노", icon: "🦷" }
];

let score = 0;
let time = 30;
let gameInterval;
let maxClickedItem = { name: "", count: 0 }; // 가장 많이 클릭된 상품 정보

const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

function startGame() {
    gameInterval = setInterval(() => {
        if (time <= 0) {
            clearInterval(gameInterval);
            endGame();
            return;
        }

        time--;
        timeDisplay.textContent = time;
        showRandomItem();
    }, 1000);
}

function showRandomItem() {
    const item = items[Math.floor(Math.random() * items.length)];
    const itemElement = document.createElement("div");
    itemElement.classList.add("item");
    itemElement.innerHTML = `<span>${item.icon}</span><br><span>${item.name}</span><br><span>${item.icon}</span>`;

    const x = Math.random() * (gameArea.clientWidth - 100);
    const y = Math.random() * (gameArea.clientHeight - 100);
    itemElement.style.left = `${x}px`;
    itemElement.style.top = `${y}px`;

    itemElement.addEventListener("click", () => {
        score++;
        scoreDisplay.textContent = score;
        gameArea.removeChild(itemElement);
        updateMaxClickedItem(item.name); // 클릭된 상품 갱신
    });

    gameArea.appendChild(itemElement);

    setTimeout(() => {
        if (gameArea.contains(itemElement)) {
            gameArea.removeChild(itemElement);
        }
    }, Math.random() * 400 + 300); // 0.3 ~ 0.7 초 사이 랜덤
}

function updateMaxClickedItem(itemName) {
    const item = items.find(i => i.name === itemName);
    if (item) {
        item.count = item.count ? item.count + 1 : 1;
        if (item.count > maxClickedItem.count) {
            maxClickedItem = { name: item.name, count: item.count };
        }
    }
}

function endGame() {
    // 게임 종료 시 팝업 생성
    const popup = document.createElement("div");
    popup.classList.add("popup");
    const popupContent = `
        <div>게임 오버!</div>
        <div>멍멍이가 획득한 상품은?</div>
	<div>${maxClickedItem.name} (${maxClickedItem.count}회)</div>
        <button onclick="restartGame()">Retry</button>
    `;
    popup.innerHTML = popupContent;
    gameArea.appendChild(popup);
}

function restartGame() {
    // 게임 재시작
    score = 0;
    time = 30;
    maxClickedItem = { name: "", count: 0 };
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;
    gameArea.innerHTML = ''; // 게임 영역 초기화
    startGame();
}

startGame();