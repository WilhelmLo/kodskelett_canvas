//  ------------ Setup ------------
window.focus;
const SCREENWIDTH = window.innerWidth;
const SCREENHEIGHT = window.innerHeight;
let gameCanvas = document.getElementById("gameCanvas");
let c = gameCanvas.getContext("2d"); // Drawing object
gameCanvas.height = SCREENHEIGHT;
gameCanvas.width = SCREENWIDTH;
document.body.style.overflow = "hidden"; // Remove scroll bars
// -------------------------------------
// Player variables
let playerWidth = 20;
let playerHeight = 20;
let playerX = gameCanvas.width / 2 - playerWidth / 2;
let playerY = gameCanvas.height - playerHeight;
let playerLives = 10;
let score = 0;
// -------------------------------------
// Enemy variables
let enemies = [];
let enemyTypes = [
  { width: 20, height: 20, speed: 3, health: 2 },
  { width: 20, height: 20, speed: 2, health: 3 },
  { width: 20, height: 20, speed: 4, health: 1 }
];

class Enemy {
  constructor(x, width, height, speed, health) {
    this.x = x;
    this.y = gameCanvas.height - height; // Set y position at the bottom of the screen
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.health = health;
    this.attackInterval = null; // Interval for attacking player
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    // Move towards the player
    if (playerX > this.x) this.x += this.speed;
    else if (playerX < this.x) this.x -= this.speed;
  }

  attackPlayer() {
    // Check collision with player
    if (
      playerX < this.x + this.width &&
      playerX + playerWidth > this.x &&
      playerY < this.y + this.height &&
      playerY + playerHeight > this.y
    ) {
      playerLives--; // Decrease player lives
      if (playerLives <= 0) {
        alert("Game Over! Your score: " + score);
        location.reload(); // Restart the game
      }
    }
  }
}

// Create initial enemies
function createEnemies() {
  for (let i = 0; i < enemyTypes.length; i++) {
    let enemyType = enemyTypes[i];
    let x = Math.random() * (gameCanvas.width - enemyType.width);
    enemies.push(new Enemy(x, enemyType.width, enemyType.height, enemyType.speed, enemyType.health));
  }
}

createEnemies();

// -------------------------------------
// ------------ Animation ------------
function animate() {
  requestAnimationFrame(animate); // Run gameloop recursively
  c.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Clear screen

  // Draw player
  c.fillStyle = "blue";
  c.fillRect(playerX, playerY, playerWidth, playerHeight);

  // Move player with arrow keys
  window.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'ArrowLeft':
        if (playerX > 0) playerX -= playerSpeed;
        break;
      case 'ArrowRight':
        if (playerX < gameCanvas.width - playerWidth) playerX += playerSpeed;
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

// -------------------------------------
// ------------ Start game ------------
animate();