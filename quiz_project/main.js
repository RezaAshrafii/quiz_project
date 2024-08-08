const images = ["../image/angular.svg", "../image/aurelia.svg", "../image/backbone.svg", "../image/ember.svg", "../image/react.svg", "../image/vue.svg"];
let gameBoard = document.getElementById("game-board");
let resetButton = document.getElementById("reset-game");
let clearScoresButton = document.getElementById("clear-scores");
let scoreTable = document.getElementById("score-table").querySelector("tbody");
let openedCards = [];
let matchedPairs = 0;
let moves = 0;
let scores = JSON.parse(localStorage.getItem("scores")) || [];

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createBoard() {
  gameBoard.innerHTML = "";
  let shuffledImages = shuffle([...images, ...images]);
  shuffledImages.forEach((image, index) => {
    let imgElement = document.createElement("img");
    imgElement.src = `./image/js.svg`;
    imgElement.dataset.image = image;
    imgElement.dataset.index = index;
    imgElement.addEventListener("click", handleCardClick);
    gameBoard.appendChild(imgElement);
  });
}
function handleCardClick(event) {
  let selectedCard = event.target;
  if (openedCards.length < 2 && !openedCards.includes(selectedCard)) {
    selectedCard.classList.add("flip-card");
    selectedCard.src = `images/${selectedCard.dataset.image}`;
    openedCards.push(selectedCard);
    if (openedCards.length === 2) {
      checkForMatch();
    }
  }
}

async function checkForMatch() {
  moves++;
  let [firstCard, secondCard] = openedCards;
  if (firstCard.dataset.image === secondCard.dataset.image) {
    matchedPairs++;
    openedCards = [];
    if (matchedPairs === images.length) {
      setTimeout(() => {
        endGame();
      }, 500);
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flip-card");
      firstCard.classList.add("flip-card-back");
      secondCard.classList.remove("flip-card");
      secondCard.classList.add("flip-card-back");
      setTimeout(async () => {
        await new Promise((resolve) => {
          firstCard.src = `./image/js.svg`;
          secondCard.src = `./image/js.svg`;
          resolve(); 
        }).then(()=>{
            firstCard.classList.remove("flip-card-back");
            secondCard.classList.remove("flip-card-back");
            openedCards = [];
        });
      }, 500);
    }, 1000);
  }
}

function endGame() {
  let playerName = prompt("تبریک! شما برنده شدید. لطفا نام خود را وارد کنید:");
  scores.push({ name: playerName, score: moves });
  scores.sort((a, b) => a.score - b.score);
  localStorage.setItem("scores", JSON.stringify(scores));
  updateScoreTable();
  createBoard();
  resetGame();
}

function updateScoreTable() {
  scoreTable.innerHTML = "";
  scores.forEach((score) => {
    let row = document.createElement("tr");
    let nameCell = document.createElement("td");
    nameCell.textContent = score.name;
    let scoreCell = document.createElement("td");
    scoreCell.textContent = score.score;
    row.appendChild(nameCell);
    row.appendChild(scoreCell);
    scoreTable.appendChild(row);
  });
}

function resetGame() {
  matchedPairs = 0;
  moves = 0;
  openedCards = [];
  createBoard();
}

resetButton.addEventListener("click", resetGame);

clearScoresButton.addEventListener("click", () => {
  localStorage.removeItem("scores");
  scores = [];
  updateScoreTable();
});

window.onload = () => {
  updateScoreTable();
  createBoard();
};
