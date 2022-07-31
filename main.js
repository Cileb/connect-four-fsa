const body = document.querySelector("body");
const boardDiv = document.querySelector("#board");
const submitElement = document.getElementById("start-button");
const resetElement = document.getElementById("restart-button");
const computerElement = document.getElementById("play-computer");
const statusElement = document.getElementById("status-text");
const playerOneElement = document.getElementById("p1-input");
const playerTwoElement = document.getElementById("p2-input");
// const holeElement = document.querySelectorAll("game-hole");
let player1Name;
let player2Name;
let isPlayer1Turn = true;
let currentPiece = "red";
let gameOver = true;
let computerOpponent = false;

const board = [];
for (let i = 0; i < 7; i++) {
  board.push([]);
}

function checkFirstEmptyRow(column) {
  for (let i = 5; i > -1; i--) {
    if (board[i][column]) {
      continue;
    } else {
      return i;
    }
  }
}

function checkVertical(row, column) {
  let counter = 1;
  row = Number(row);
  let maxRow = row + 3;
  for (let i = row; i < maxRow; i++) {
    if (board[i + 1][column] === currentPiece) {
      counter += 1;
    } else break;
  }
  if (counter === 4) {
    return true;
  } else return false;
}

function checkHorizontal(row, column) {
  let counter = 1;
  let maxColumn = Number(column) + 3;
  let minColumn = column - 3;
  for (let i = column; i < maxColumn; i++) {
    if (board[row][i + 1] === currentPiece) {
      counter += 1;
    } else break;
  }
  for (let i = column; i > minColumn; i--) {
    if (board[row][i - 1] === currentPiece) {
      counter += 1;
    } else break;
  }
  if (counter === 4) {
    return true;
  } else return false;
}

function checkDiagonal(board) {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (board[i][j]) {
        if (
          i - 3 > -1 &&
          j + 3 < 7 &&
          board[i][j] == board[i - 1][j + 1] &&
          board[i][j] == board[i - 2][j + 2] &&
          board[i][j] == board[i - 3][j + 3]
        ) {
          return true;
        }
        if (
          i + 3 < 6 &&
          j + 3 < 7 &&
          board[i][j] == board[i + 1][j + 1] &&
          board[i][j] == board[i + 2][j + 2] &&
          board[i][j] == board[i + 3][j + 3]
        ) {
          return true;
        }
        if (
          i + 3 < 6 &&
          j - 3 > -1 &&
          board[i][j] == board[i + 1][j - 1] &&
          board[i][j] == board[i + 2][j - 2] &&
          board[i][j] == board[i + 3][j - 3]
        ) {
          return true;
        }
        if (
          i - 3 > -1 &&
          j - 3 > -1 &&
          board[i][j] == board[i - 1][j - 1] &&
          board[i][j] == board[i - 2][j - 2] &&
          board[i][j] == board[i - 3][j - 3]
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function checkWin(board, row, column) {
  let counter = 0;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (board[i][j]) {
        counter += 1;
      } else {
        break;
      }
    }
    if (counter === 42) {
      gameOver = true;
      statusElement.textContent = "Draw!";
    }
  }
  if (
    checkDiagonal(board) ||
    checkHorizontal(row, column) ||
    checkVertical(row, column)
  ) {
    gameOver = true;
    return true;
  } else return false;
}

function refreshBoard() {
  boardDiv.textContent = "";
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      let holeDiv = document.createElement("div");
      holeDiv.textContent = board[i][j];
      if (
        holeDiv.textContent === "red" &&
        !(holeDiv.textContent === "yellow")
      ) {
        holeDiv.setAttribute("class", "game-hole");
        holeDiv.id = "red";
      }
      if (holeDiv.textContent === "yellow") {
        holeDiv.setAttribute("class", "game-hole");
        holeDiv.id = "yellow";
      } else {
        holeDiv.setAttribute("class", "game-hole");
      }
      holeDiv.dataset.column = j;
      holeDiv.dataset.row = i;
      boardDiv.appendChild(holeDiv);
    }
  }
}

function randomNum() {
  return Math.floor(Math.random() * 7);
}

function placePiecePC() {
  if (!isPlayer1Turn && computerOpponent) {
    let randomColumn = randomNum();
    let lowestRow = checkFirstEmptyRow(randomColumn);
    for (let i = 0; i < 7; i++) {
      if (lowestRow) {
        board[lowestRow][randomColumn] = currentPiece;
        statusElement.textContent = `It's your turn, ${player1Name}! Place a Red piece.`;
        if (checkWin(board, lowestRow, randomColumn)) {
          statusElement.textContent = `Congratulations, ${player2Name}! You won!`;
          refreshBoard();
          break;
        } else {
          currentPiece = "red";
          isPlayer1Turn = true;
          refreshBoard();
          break;
        }
      } else if (!lowestRow) {
        randomColumn = i;
        lowestRow = checkFirstEmptyRow(i);
        if (lowestRow) {
          board[lowestRow][randomColumn] = currentPiece;
          if (checkWin(board, lowestRow, randomColumn)) {
            statusElement.textContent = `Congratulations, ${player2Name}! You won!`;
            refreshBoard();
            break;
          }
        }
      }
    }
  }
}

refreshBoard();

boardDiv.addEventListener("click", function (e) {
  if (!gameOver) {
    let target = e.target;
    let column = target.dataset.column;
    let row = target.dataset.row;
    let lowestRow = checkFirstEmptyRow(column);
    if (target.className === "game-hole") {
      if (board[0][column]) {
        statusElement.textContent =
          "Choose a different column, this one is full.";
      } else if (board[row][column]) {
        statusElement.textContent = "Already a piece here";
      } else if (isPlayer1Turn) {
        board[lowestRow][column] = currentPiece;
        statusElement.textContent = `It's your turn, ${player2Name}! Place a Yellow piece.`;
        if (checkWin(board, lowestRow, column)) {
          statusElement.textContent = `Congratulations, ${player1Name}! You won!`;
          refreshBoard();
        } else {
          currentPiece = "yellow";
          isPlayer1Turn = !isPlayer1Turn;
          refreshBoard();
        }
      } else if (!isPlayer1Turn && !computerOpponent) {
        board[lowestRow][column] = currentPiece;
        statusElement.textContent = `It's your turn, ${player1Name}! Place a Red piece.`;
        if (checkWin(board, lowestRow, column)) {
          statusElement.textContent = `Congratulations, ${player2Name}! You won!`;
          refreshBoard();
        } else {
          currentPiece = "red";
          isPlayer1Turn = true;
          refreshBoard();
        }
      }
      if (!isPlayer1Turn && computerOpponent) {
        setTimeout(placePiecePC, 1000);
      }
    }
  }
});

submitElement.addEventListener("click", function () {
  player1Name = playerOneElement.value;
  player2Name = playerTwoElement.value;
  if (randomNum() % 2 === 0) {
    isPlayer1Turn = true;
    currentPiece = "red";
  } else {
    isPlayer1Turn = false;
    currentPiece = "yellow";
  }
  if (isPlayer1Turn && player1Name && player2Name) {
    statusElement.textContent = `It's your turn, ${player1Name}! Place a ${currentPiece} piece somewhere.`;
  } else if (!isPlayer1Turn && player1Name && player2Name) {
    statusElement.textContent = `It's your turn, ${player2Name}! Place a ${currentPiece} piece somewhere.`;
  }
  if (player1Name && !isPlayer1Turn && computerOpponent) {
    setTimeout(placePiecePC, 1000);
  }
  if (player1Name && player2Name) {
    gameOver = false;
    submitElement.disabled = true;
    computerElement.disabled = true;
  } else {
    statusElement.textContent = `Please enter both names before starting the game.`;
  }
});

resetElement.addEventListener("click", function () {
  gameOver = true;
  computerOpponent = false;
  playerTwoElement.disabled = false;
  computerElement.disabled = false;
  playerOneElement.value = "";
  playerTwoElement.value = "";
  statusElement.textContent =
    "Please enter your names and click the Start button when you are ready to begin.";
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      board[i][j] = "";
    }
  }
  submitElement.disabled = false;
  refreshBoard();
});

computerElement.addEventListener("click", function () {
  playerTwoElement.value = "Computer";
  playerTwoElement.disabled = true;
  computerOpponent = true;
});
