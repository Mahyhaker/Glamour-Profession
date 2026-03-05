// ── DATA ──
const choices = ["dragao", "mago", "dragon_slayer"];

const cardData = {
    dragao: {
        name: "Blue-Eyes White Dragon",
        type: "Dragão / LIGHT",
        beats: "Vence contra: Mago Negro",
        img: "imagens/dragao.png",
        fallbackColor: "#1a2a4a"
    },
    mago: {
        name: "Dark Magician",
        type: "Mago / DARK",
        beats: "Vence contra: Dragon Slayer",
        img: "imagens/mago_negro.png",
        fallbackColor: "#2a1a4a"
    },
    dragon_slayer: {
        name: "Dragon Slayer",
        type: "Guerreiro / LIGHT",
        beats: "Vence contra: Dragão",
        img: "imagens/dragon_slayer.png",
        fallbackColor: "#4a3a1a"
    }
};

// ── STATE ──
let state = {
    playerScore: 0,
    computerScore: 0,
    drawScore: 0,
    round: 0,
    gameActive: false,
    playerDeck: [],
    computerDeck: [],
    roundResults: []
};

// ── DOM ──
const $ = id => document.getElementById(id);
const playerScoreEl     = $("playerScore");
const computerScoreEl   = $("computerScore");
const drawScoreEl       = $("drawScore");
const resultBanner      = $("result");
const playerHand        = $("playerHand");
const computerHand      = $("computerHand");
const playerDisplayCard = $("playerDisplayCard");
const computerDisplayCard = $("computerDisplayCard");
const playerDisplayName   = $("playerDisplayName");
const computerDisplayName = $("computerDisplayName");
const cardTooltip   = $("cardTooltip");
const tooltipName   = $("tooltipName");
const tooltipType   = $("tooltipType");
const tooltipBeats  = $("tooltipBeats");
const gameOverlay   = $("gameOverlay");
const gameOverTitle = $("gameOverTitle");
const gameOverScore = $("gameOverScore");
const startButton   = $("startButton");
const playAgainButton = $("playAgainButton");

// ── HELPERS ──
function getRandom() {
    return choices[Math.floor(Math.random() * choices.length)];
}

function checkWinner(p, c) {
    if (p === c) return "draw";
    if (
        (p === "dragao" && c === "mago") ||
        (p === "mago" && c === "dragon_slayer") ||
        (p === "dragon_slayer" && c === "dragao")
    ) return "player";
    return "computer";
}

function updateScoreDisplay() {
    playerScoreEl.textContent   = state.playerScore;
    computerScoreEl.textContent = state.computerScore;
    drawScoreEl.textContent     = state.drawScore;
}

function updatePips() {
    for (let i = 0; i < 5; i++) {
        const pip = $(`pip-${i}`);
        pip.className = "round-pip";
        if (i < state.roundResults.length) {
            const r = state.roundResults[i];
            pip.classList.add(r === "player" ? "win" : r === "computer" ? "loss" : "draw-pip");
        }
    }
}

function setResult(text, cls = "") {
    resultBanner.textContent = text;
    resultBanner.className = "result-banner" + (cls ? " " + cls : "");
}

function makeCardImg(cardType, isFaceDown = false) {
    const img = document.createElement("img");
    img.src = isFaceDown ? "imagens/carta_fundo.png" : cardData[cardType].img;
    img.onerror = () => {
        img.style.display = "none";
        img.parentElement.style.background = cardData[cardType]?.fallbackColor || "#1a1a2a";
        if (!isFaceDown) {
            const label = document.createElement("div");
            label.textContent = cardData[cardType].name.split(" ")[0];
            label.style.cssText = "color:var(--gold);font-size:0.6rem;text-align:center;padding:4px;position:absolute;bottom:4px;left:0;right:0;";
            img.parentElement.appendChild(label);
        }
    };
    return img;
}

// ── DEAL ──
function dealHands() {
    state.playerDeck   = Array.from({ length: 5 }, getRandom);
    state.computerDeck = Array.from({ length: 5 }, getRandom);
    renderHands();
}

function renderHands() {
    playerHand.innerHTML   = "";
    computerHand.innerHTML = "";

    // Computer hand (face down)
    state.computerDeck.forEach(() => {
        const card = document.createElement("div");
        card.className = "card computer-card";
        card.appendChild(makeCardImg(null, true));
        computerHand.appendChild(card);
    });

    // Player hand
    state.playerDeck.forEach((cardType, index) => {
        const card = document.createElement("div");
        card.className = "card player-card";
        card.dataset.index = index;
        card.appendChild(makeCardImg(cardType));

        card.addEventListener("mouseenter", () => {
            tooltipName.textContent  = cardData[cardType].name;
            tooltipType.textContent  = cardData[cardType].type;
            tooltipBeats.textContent = cardData[cardType].beats;
            cardTooltip.classList.add("visible");
        });
        card.addEventListener("mouseleave", () => {
            cardTooltip.classList.remove("visible");
        });
        card.addEventListener("click", () => {
            if (!state.gameActive) return;
            cardTooltip.classList.remove("visible");
            playRound(index);
        });

        playerHand.appendChild(card);
    });
}

// ── PLAY ROUND ──
function playRound(playerIndex) {
    if (!state.gameActive || state.round >= 5) return;

    const playerChoice   = state.playerDeck[playerIndex];
    const computerChoice = state.computerDeck[Math.floor(Math.random() * state.computerDeck.length)];
    const winner = checkWinner(playerChoice, computerChoice);

    // Mark chosen card as played
    const playedCard = playerHand.children[playerIndex];
    if (playedCard) playedCard.classList.add("played");

    // Show in arena
    playerDisplayCard.innerHTML   = "";
    computerDisplayCard.innerHTML = "";
    playerDisplayCard.classList.remove("empty", "win-card", "loss-card", "reveal");
    computerDisplayCard.classList.remove("empty", "win-card", "loss-card", "reveal");

    playerDisplayCard.appendChild(makeCardImg(playerChoice));
    computerDisplayCard.appendChild(makeCardImg(computerChoice));

    // Force reflow to restart animation
    void playerDisplayCard.offsetWidth;
    playerDisplayCard.classList.add("reveal");
    computerDisplayCard.classList.add("reveal");

    playerDisplayName.textContent   = cardData[playerChoice].name;
    computerDisplayName.textContent = cardData[computerChoice].name;

    // Result
    if (winner === "player") {
        state.playerScore++;
        state.roundResults.push("player");
        playerDisplayCard.classList.add("win-card");
        computerDisplayCard.classList.add("loss-card");
        setResult(`⚔️  Sua carta vence! ${cardData[playerChoice].name} triunfa!`, "win");
    } else if (winner === "computer") {
        state.computerScore++;
        state.roundResults.push("computer");
        computerDisplayCard.classList.add("win-card");
        playerDisplayCard.classList.add("loss-card");
        setResult(`💀  Oponente vence! ${cardData[computerChoice].name} prevalece!`, "loss");
    } else {
        state.drawScore++;
        state.roundResults.push("draw");
        setResult(`⚡  Empate! As cartas se anulam!`, "draw");
    }

    updateScoreDisplay();
    updatePips();

    state.round++;

    if (state.round >= 5) {
        state.gameActive = false;
        setTimeout(showGameOver, 1200);
    } else {
        setTimeout(dealHands, 1800);
    }
}

// ── GAME OVER ──
function showGameOver() {
    const p = state.playerScore;
    const c = state.computerScore;
    const d = state.drawScore;

    let cls, msg;
    if (p > c)      { cls = "victory"; msg = "VITÓRIA!"; }
    else if (c > p) { cls = "defeat";  msg = "DERROTA!"; }
    else            { cls = "tie";     msg = "EMPATE!";  }

    gameOverTitle.className   = "game-over-title " + cls;
    gameOverTitle.textContent = msg;
    gameOverScore.textContent = `${p} Vitórias · ${d} Empates · ${c} Derrotas`;
    gameOverlay.classList.add("show");
}

// ── START ──
function startGame() {
    state = {
        playerScore: 0, computerScore: 0, drawScore: 0,
        round: 0, gameActive: true,
        playerDeck: [], computerDeck: [], roundResults: []
    };

    updateScoreDisplay();
    updatePips();

    playerDisplayCard.innerHTML = "";
    playerDisplayCard.className = "card-display empty";
    computerDisplayCard.innerHTML = "";
    computerDisplayCard.className = "card-display empty";
    playerDisplayName.textContent   = "";
    computerDisplayName.textContent = "";

    gameOverlay.classList.remove("show");
    setResult("Escolha uma carta da sua mão para jogar");
    dealHands();
}

// ── EVENTS ──
startButton.addEventListener("click", startGame);
playAgainButton.addEventListener("click", startGame);

// Init
updatePips();