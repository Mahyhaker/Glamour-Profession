const playerScoreElement = document.getElementById("playerScore");
const computerScoreElement = document.getElementById("computerScore");
const startButton = document.getElementById("startButton");
const playerHand = document.getElementById("playerHand");
const computerHand = document.getElementById("computerHand");

// Criar área de informação da carta
const cardInfo = document.createElement("div");
cardInfo.className = "card-info";
document.body.appendChild(cardInfo);

const cardName = document.createElement("div");
cardName.className = "card-name";
cardInfo.appendChild(cardName);

const cardAttribute = document.createElement("div");
cardAttribute.className = "card-attribute";
cardInfo.appendChild(cardAttribute);

const playerSelectedCard = document.createElement("img");
playerSelectedCard.id = "playerSelectedCard";
playerSelectedCard.className = "selected-card";
document.querySelector(".left-play-area").appendChild(playerSelectedCard);

const computerSelectedCard = document.createElement("img");
computerSelectedCard.id = "computerSelectedCard";
computerSelectedCard.className = "selected-card";
document.querySelector(".left-play-area").appendChild(computerSelectedCard);

let playerScore = 0;
let computerScore = 0;
let gameActive = false;
let playerDeck = [];
let computerDeck = [];
let round = 0;

const choices = ["dragao", "mago", "dragon_slayer"];
const cardNames = {
    dragao: "Dragon",
    mago: "Dark Magician",
    dragon_slayer: "Dragon Slayer"
};

const cardAttributes = {
    dragao: "Fire",
    mago: "Dark",
    dragon_slayer: "Light"
};

const sounds = {
    dragao: new Audio("sons/dragão(MP3_160K).mp3"),
    mago: new Audio("sons/mago(MP3_160K).mp3"),
    dragon_slayer: new Audio("sons/dragon_slaeyer(MP3_160K).mp3")
};

const images = {
    dragao: "imagens/dragao.png",
    mago: "imagens/mago_negro.png",
    dragon_slayer: "imagens/dragon_slayer.png"
};

function getRandomCard() {
    return choices[Math.floor(Math.random() * choices.length)];
}

function dealNewHands() {
    playerDeck = Array.from({ length: 5 }, getRandomCard);
    computerDeck = Array.from({ length: 5 }, getRandomCard);
    displayDecks();
}

function displayDecks() {
    playerHand.innerHTML = "";
    computerHand.innerHTML = "";

    playerDeck.forEach((card, index) => {
        const cardElement = document.createElement("img");
        cardElement.src = "imagens/carta_fundo.png";
        cardElement.alt = card;
        cardElement.dataset.index = index;
        cardElement.dataset.cardType = card;
        cardElement.className = "card-back";
        
        cardElement.addEventListener("mouseenter", () => {
            cardInfo.style.display = "block";
            cardName.textContent = cardNames[card];
            cardAttribute.textContent = `Attribute: ${cardAttributes[card]}`;
        });
        
        cardElement.addEventListener("mouseleave", () => {
            cardInfo.style.display = "none";
        });
        
        cardElement.addEventListener("click", () => playRound(index));
        playerHand.appendChild(cardElement);
    });

    computerDeck.forEach(() => {
        const cardElement = document.createElement("img");
        cardElement.src = "imagens/carta_fundo.png";
        cardElement.className = "card-back";
        computerHand.appendChild(cardElement);
    });
}

function startGame() {
    playerScore = 0;
    computerScore = 0;
    round = 0;
    gameActive = true;
    playerScoreElement.textContent = `Win: ${playerScore} | Lose: ${computerScore}`;
    playerSelectedCard.style.display = "none";
    computerSelectedCard.style.display = "none";
    dealNewHands();
}

function checkWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return "draw";
    if (
        (playerChoice === "dragao" && computerChoice === "mago") ||
        (playerChoice === "mago" && computerChoice === "dragon_slayer") ||
        (playerChoice === "dragon_slayer" && computerChoice === "dragao")
    ) {
        playerScore++;
        playSound(playerChoice);
        return "player";
    } else {
        computerScore++;
        playSound(computerChoice);
        return "computer";
    }
}

function playRound(playerIndex) {
    if (!gameActive || round >= 5) return;

    const playerChoice = playerDeck[playerIndex];
    const computerChoice = computerDeck[Math.floor(Math.random() * computerDeck.length)];
    const winner = checkWinner(playerChoice, computerChoice);

    playerScoreElement.textContent = `Win: ${playerScore} | Lose: ${computerScore}`;
    
    playerSelectedCard.src = images[playerChoice];
    computerSelectedCard.src = images[computerChoice];
    playerSelectedCard.style.display = "block";
    computerSelectedCard.style.display = "block";
    
    round++;
    
    setTimeout(() => {
        if (round < 5) {
            dealNewHands();
        } else {
            gameActive = false;
        }
    }, 2000);
}

function playSound(choice) {
    sounds[choice]?.play();
}

startButton.addEventListener("click", startGame);