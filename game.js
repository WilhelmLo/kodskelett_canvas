//  ------------ Setup ------------
window.focus;
const SCREENWIDTH = window.innerWidth;
const SCREENHEIGHT = window.innerHeight;
let gameCanvas = document.getElementById("gameCanvas");
let c = gameCanvas.getContext("2d");
gameCanvas.height = SCREENHEIGHT;
gameCanvas.width = SCREENWIDTH;
document.body.style.overflow = "hidden";

let playerWidth = 20;
let playerHeight = 20;
let playerX = gameCanvas.width / 2 - playerWidth / 2;
let playerY = gameCanvas.height - playerHeight - SCREENHEIGHT * 0.12;
let playerLives = 10;
let score = 0;
let playerSpeed = 5;

let enemies = [];
let enemyTypes = [
  { width: 20, height: 20, speed: 3, health: 2 },
  { width: 20, height: 20, speed: 2, health: 3 },
  { width: 20, height: 20, speed: 4, health: 1 },
  { width: 30, height: 30, speed: 1, health: 5 },
];

class Enemy {
  constructor(x, width, height, speed, health) {
    this.x = x;
    this.y = gameCanvas.height - height - SCREENHEIGHT * 0.12;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.health = health;
    this.attackInterval = null;
  }

  attackPlayer() {
    if (
      playerX < this.x + this.width &&
      playerX + playerWidth > this.x &&
      playerY < this.y + this.height &&
      playerY + playerHeight > this.y
    ) {
      playerLives--;
      if (playerLives <= 0) {
        alert("Game Over! Your score: " + score);
        location.reload();
      }
    }
  }
}

function generateEnemies() {
  setInterval(() => {
    let enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    let side = Math.floor(Math.random() * 2);
    let x, y;

    switch (side) {
      case 1: // Right side
        x = gameCanvas.width;
        y = Math.random() * (gameCanvas.height - enemyType.height);
        break;
      case 2: // Left side
        x = 0;
        y = Math.random() * (gameCanvas.height - enemyType.height);
        break;
    }

    enemies.push(
      new Enemy(
        x,
        enemyType.width,
        enemyType.height,
        enemyType.speed,
        enemyType.health
      )
    );
  }, 2000);
}

generateEnemies();


let lastArrowKey = null;

function animate() {
  requestAnimationFrame(animate); 
  c.clearRect(0, 0, gameCanvas.width, gameCanvas.height); 

  c.fillStyle = "blue";
  c.fillRect(playerX, playerY, playerWidth, playerHeight);

  window.addEventListener("keydown", function (e) {
    switch (e.key) {
      case "ArrowLeft":
        lastArrowKey = "left";
        initiateAttack(lastArrowKey);
        break;
      case "ArrowRight":
        lastArrowKey = "right";
        initiateAttack(lastArrowKey);
        break;
      case "ArrowUp":
        lastArrowKey = "up";
        initiateAttack(lastArrowKey);
        break;
      case "ArrowDown":
        lastArrowKey = "down";
        initiateAttack(lastArrowKey);
        break;
    }
  });

  // Draw enemies
  enemies.forEach((enemy) => {
    enemy.draw();
    enemy.update();
    enemy.attackPlayer(); // Check for player collision

    // Check if player hits enemy
    if (
      playerX + playerWidth >= enemy.x &&
      playerX <= enemy.x + enemy.width &&
      playerY + playerHeight >= enemy.y &&
      playerY <= enemy.y + enemy.height
    ) {
      // Player hits enemy
      enemy.health--;
      if (enemy.health <= 0) {
        enemies.splice(enemies.indexOf(enemy), 1); // Remove the enemy
        score++; // Increase score
      }
    }
  });

  // Display player lives and score
  c.fillStyle = "black";
  c.font = "20px Arial";
  c.fillText("Lives: " + playerLives, 10, 30);
  c.fillText("Score: " + score, 10, 60);
}

  // Check for enemy collisions and damage enemies if hit
  enemies.forEach((enemy) => {
    if (
      attackX + playerWidth >= enemy.x &&
      attackX <= enemy.x + enemy.width &&
      attackY + playerHeight >= enemy.y &&
      attackY <= enemy.y + enemy.height
    ) {
      // Player hits enemy
      enemy.health--;
      if (enemy.health <= 0) {
        enemies.splice(enemies.indexOf(enemy), 1); // Remove the enemy
        score++; // Increase score
      }
    }
  });
}

function changeBackgroundImage(imagePath) {
  gameCanvas.style.backgroundImage = `url('${imagePath}')`;
  gameCanvas.style.backgroundSize = "cover";
  gameCanvas.style.backgroundRepeat = "no-repeat";
}

changeBackgroundImage("bakgrund.jpg");
animate();
