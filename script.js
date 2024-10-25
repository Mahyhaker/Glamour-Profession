const playerScoreElement = document.getElementById("playerScore");
const computerScoreElement = document.getElementById("computerScore");
const startButton = document.getElementById("startButton");
const resultDisplay = document.getElementById("result");
const choices = document.querySelectorAll(".choice");

let playerScore = 0;
let computerScore = 0;
let gameActive = false;

// Carrega os arquivos de áudio
const sounds = {
    dragao: new Audio("sons/dragão(MP3_160K).mp3"),
    mago: new Audio("sons/mago(MP3_160K).mp3"),
    dragon_slayer: new Audio("sons/dragon_slaeyer(MP3_160K).mp3")
};

const gameState = {
    start() {
        playerScore = 0;
        computerScore = 0;
        gameActive = true;
        playerScoreElement.textContent = playerScore;
        computerScoreElement.textContent = computerScore;
        resultDisplay.textContent = "Escolha uma carta para jogar!";
        console.log("Jogo iniciado");
    },
    end() {
        gameActive = false;
        const winner = playerScore > computerScore ? "Você venceu!" : "O Inimigo venceu!";
        resultDisplay.textContent = `${winner} Jogo finalizado.`;
        console.log("Jogo finalizado");
    }
};

function getComputerChoice() {
    const choices = ["dragao", "mago", "dragon_slayer"];
    return choices[Math.floor(Math.random() * choices.length)];
}

function checkWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return "Empate!";
    if (
        (playerChoice === "dragao" && computerChoice === "mago") ||
        (playerChoice === "mago" && computerChoice === "dragon_slayer") ||
        (playerChoice === "dragon_slayer" && computerChoice === "dragao")
    ) {
        playerScore++;
        playSound(playerChoice); // Toca o som do vencedor
        return "Você ganhou esta rodada!";
    } else {
        computerScore++;
        playSound(computerChoice); // Toca o som do vencedor
        return "O Inimigo ganhou esta rodada!";
    }
}

function formatChoiceName(choice) {
    switch (choice) {
        case "dragon_slayer":
            return "Dragon Slayer";
        case "mago":
            return "Mago Negro";
        case "dragao":
            return "Dragão";
        default:
            return choice;
    }
}

function playRound(event) {
    if (!gameActive) return;

    const clickedElement = event.target;
    const playerChoice = clickedElement.getAttribute("data-choice") || clickedElement.parentElement.getAttribute("data-choice");
    
    const computerChoice = getComputerChoice();
    const result = checkWinner(playerChoice, computerChoice);

    const formattedPlayerChoice = formatChoiceName(playerChoice);
    const formattedComputerChoice = formatChoiceName(computerChoice);

    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;
    resultDisplay.textContent = `Você escolheu ${formattedPlayerChoice}, Inimigo escolheu ${formattedComputerChoice}. ${result}`;

    if (playerScore === 3 || computerScore === 3) gameState.end();
}

// Função para tocar o som da escolha vencedora
function playSound(choice) {
    sounds[choice]?.play(); // Toca o som da escolha vencedora
}

startButton.addEventListener("click", () => gameState.start());
choices.forEach(choice => choice.addEventListener("click", playRound));
