const items = [
    { name: "입술 박치기", icon: "💋", count: 0 },
    { name: "구애의 막춤", icon: "💃", count: 0 },
    { name: "필살 베어허그", icon: "🐻", count: 0 },
    { name: "고급 귀이개", icon: "👂", count: 0 },
    { name: "바디 프렌드", icon: "💆", count: 0 }
];

let score = 0;
let time = 30;
let gameInterval;
let itemIntervals = [];
let maxClickedItems = []; // 가장 많이 클릭된 선물 정보 (최대 2개)

const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const countdownDisplay = document.createElement("div");

countdownDisplay.classList.add("countdown");
gameArea.appendChild(countdownDisplay);

function showItemList() {
    const itemList = document.createElement("div");
    itemList.classList.add("item-list");
    items.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("item");
        itemElement.innerHTML = `<span>${item.icon}</span><br><span>${item.name}</span><br><span>${item.icon}</span>`;
        itemList.appendChild(itemElement);
    });
    gameArea.appendChild(itemList);
    return itemList;
}

function startCountdown(callback) {
    let countdown = 5;
    countdownDisplay.textContent = countdown;
    const itemList = showItemList();

    const countdownInterval = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            gameArea.removeChild(countdownDisplay);
            gameArea.removeChild(itemList);
            callback();
        }
    }, 1000);
}

function startGame() {
    gameInterval = setInterval(() => {
        if (time <= 0) {
            clearInterval(gameInterval);
            clearItemIntervals();
            endGame();
            return;
        }

        time--;
        timeDisplay.textContent = time;
    }, 1000);

    items.forEach(item => {
        const interval = setInterval(() => showRandomItem(item), Math.random() * 1000 + 500); // 0.5 ~ 1.5 초 사이 랜덤
        itemIntervals.push(interval);
    });
}

function showRandomItem(item) {
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
        updateMaxClickedItems(item.name); // 클릭된 선물 갱신
    });

    gameArea.appendChild(itemElement);

    setTimeout(() => {
        if (gameArea.contains(itemElement)) {
            gameArea.removeChild(itemElement);
        }
    }, Math.random() * 500 + 500); // 0.5 ~ 1 초 사이 랜덤
}

function updateMaxClickedItems(itemName) {
    const item = items.find(i => i.name === itemName);
    if (item) {
        item.count++;
        maxClickedItems = items
            .slice() // 배열 복사
            .sort((a, b) => b.count - a.count) // 클릭 수 기준 내림차순 정렬
            .slice(0, 2); // 상위 2개만 추출
    }
}

function endGame() {
    // 게임 종료 시 팝업 생성
    const popup = document.createElement("div");
    popup.classList.add("popup");

    // 가장 많이 클릭된 상위 2개 선물 정보 생성
    const popupContent = `
        <div>게임 오버!</div>
        <div>멍멍이가 획득한 선물은?</div>
        ${maxClickedItems.map(item => `
            <div>${item.name} (${item.count}회)</div>
        `).join('')}
        <button onclick="restartGame()">Retry</button>
    `;
    popup.innerHTML = popupContent;
    gameArea.appendChild(popup);
}

function restartGame() {
    // 게임 재시작
    score = 0;
    time = 30;
    maxClickedItems = []; // 가장 많이 클릭된 선물 초기화
    items.forEach(item => item.count = 0); // 각 아이템의 count 초기화
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;
    gameArea.innerHTML = ''; // 게임 영역 초기화

    // countdownDisplay와 팝업 다시 추가
    countdownDisplay.classList.add("countdown");
    gameArea.appendChild(countdownDisplay);

    startCountdown(startGame); // 카운트다운 후 게임 시작
}

function clearItemIntervals() {
    itemIntervals.forEach(interval => clearInterval(interval));
    itemIntervals = [];
}

startCountdown(startGame); // 페이지 로드 시 카운트다운 시작
