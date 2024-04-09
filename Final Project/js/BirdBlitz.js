var canvas = document.getElementById("gameCanvas");
canvas.width = 1280;
canvas.height = 720;
var ctx = canvas.getContext("2d");

var player = {
  width: 100,
  height: 70,
  x: canvas.width / 2 - 50,
  y: canvas.height - 60,
  speed: 7,
  dx: 0,
  lastDx: 1,
};

var birds = [];
var score = 0;
var gameOver = false;
const birdPic = new Image();
birdPic.src = "/media/birdPic.png";
const turtle = new Image();
turtle.src = "/media/turtlePic.png";

var background = new Image();
background.src = "/media/Beach.jpg";

function drawPlayer(player) {
  ctx.save();

  if (player.dx !== 0) {
    player.lastDx = player.dx;
  }

  if (player.lastDx < 0) {
    ctx.scale(-1, 1);
    ctx.drawImage(
      turtle,
      -player.x - player.width,
      player.y,
      player.width,
      player.height
    );
  } else {
    ctx.drawImage(turtle, player.x, player.y, player.width, player.height);
  }

  ctx.restore();
}

function drawBird(bird) {
  ctx.drawImage(birdPic, bird.x, bird.y, 50, 50);
  bird.y += bird.dy;
}

function addBird() {
  var x = Math.random() * (canvas.width - 30) + 15;
  var y = -30;
  var dy = 2 + Math.random() * 3;
  birds.push({ x, y, dy });
}

function newPos() {
  player.x += player.dx;

  // Prevent player from going out of bounds
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  birds.forEach(function (bird, index) {
    if (
      bird.x < player.x + player.width &&
      bird.x + 50 > player.x &&
      bird.y < player.y + player.height &&
      bird.y + 50 > player.y
    ) {
      gameOver = true;
    }

    // Remove birds that go out of bounds
    if (bird.y > canvas.height) {
      birds.splice(index, 1);
      score++;
    }
  });
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 10, 30);
}

function showGameOver() {
  ctx.fillStyle = "black";
  ctx.font = "50px Arial";
  ctx.fillText("Game Over!", canvas.width / 2 - 150, canvas.height / 2);
}

function update() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    drawPlayer(player);
    birds.forEach(drawBird);
    newPos();
    drawScore();

    requestAnimationFrame(update);
  } else {
    showGameOver();
  }
}

function moveRight() {
  player.dx = player.speed;
}

function moveLeft() {
  player.dx = -player.speed;
}

function keyDown(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    moveRight();
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    moveLeft();
  }
}

function keyUp(e) {
  if (
    e.key == "Right" ||
    e.key == "ArrowRight" ||
    e.key == "Left" ||
    e.key == "ArrowLeft"
  ) {
    player.dx = 0;
  }
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

setInterval(addBird, 350); // Bird spawn speed
update();
