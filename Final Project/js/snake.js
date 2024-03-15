const snakeBoard = document.querySelector("#snakeBoard");
const ctx = snakeBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const restartButton = document.querySelector("#restart");
const gameWidth = snakeBoard.width;
const gameHeight = snakeBoard.height;
const snakeColor = "#00a2ff";
const snakeBoarder = "black";
const foodColor = "red";
const boardBackground = "black";
const eatSound = new Audio("media/pop.mp3");
eatSound.volume = 0.8;
const unitSize = 25;
let running = false;
let xVel = unitSize;
let yVel = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];

window.addEventListener(
  "keydown",
  function (event) {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    ) {
      event.preventDefault();
    }
  },
  false
);

window.addEventListener("keydown", changeDirection);
restartButton.addEventListener("click", restartGame);

initializeGame();

function initializeGame() {
  Clear();
  drawGrid();
  makeFood();
  drawFood();
  drawSnake();
}

function startGame() {
  if (!running) {
    running = true;
    scoreText.textContent = score;
    nextTick();
  }
}

function nextTick() {
  if (running) {
    setTimeout(() => {
      Clear();
      drawGrid();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 75);
  } else {
    displayGameOver();
  }
}

function Clear() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function drawGrid() {
  for (let x = 0; x <= gameWidth; x += unitSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, gameHeight);
    ctx.strokeStyle = "grey";
    ctx.stroke();
  }

  for (let y = 0; y <= gameHeight; y += unitSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(gameWidth, y);
    ctx.strokeStyle = "grey";
    ctx.stroke();
  }
}
function makeFood() {
  function randFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randFood(0, gameWidth - unitSize);
  foodY = randFood(0, gameWidth - unitSize);
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.beginPath();

  ctx.arc(
    foodX + unitSize / 2,
    foodY + unitSize / 2,
    unitSize / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

function moveSnake() {
  const head = { x: snake[0].x + xVel, y: snake[0].y + yVel };
  snake.unshift(head);
  if (snake[0].x == foodX && snake[0].y == foodY) {
    eatSound.play();
    score += 1;
    scoreText.textContent = score;
    makeFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBoarder;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}

function changeDirection(event) {
  const pressed = event.keyCode;
  const left = 37;
  const right = 39;
  const up = 38;
  const down = 40;
  const moveUp = yVel == -unitSize;
  const moveDown = yVel == unitSize;
  const moveLeft = xVel == -unitSize;
  const moveRight = xVel == unitSize;

  switch (true) {
    case pressed == left && !moveRight:
      xVel = -unitSize;
      yVel = 0;
      break;

    case pressed == up && !moveDown:
      xVel = 0;
      yVel = -unitSize;
      break;

    case pressed == right && !moveLeft:
      xVel = unitSize;
      yVel = 0;
      break;

    case pressed == down && !moveUp:
      xVel = 0;
      yVel = unitSize;
      break;
  }
}

function checkGameOver() {
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;

    case snake[0].x >= gameWidth:
      running = false;
      break;

    case snake[0].y < 0:
      running = false;
      break;

    case snake[0].y >= gameHeight:
      running = false;
      break;
  }
  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) running = false;
  }
}

function displayGameOver() {
  ctx.font = "50px MV boli";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", gameWidth / 2, gameHeight / 2 - 25);
  ctx.fillText(`Score: ${score}`, gameWidth / 2, gameHeight / 2 + 25);
  running = false;
}

function restartGame() {
  score = 0;
  xVel = unitSize;
  yVel = 0;
  snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  startGame();
}
