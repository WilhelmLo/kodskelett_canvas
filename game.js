window.focus();
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
    this.y = Math.random() * (gameCanvas.height - height - SCREENHEIGHT * 0.12);
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

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x -= this.speed;
    this.attackPlayer();
  }
}

function generateEnemies() {
  setInterval(() => {
    let enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    let side = Math.floor(Math.random() * 2); 
    let x, y;

    switch (side) {
      case 0: 
        x = gameCanvas.width;
        y = Math.random() * (gameCanvas.height - enemyType.height);
        break;
      case 1: 
        x = 0 - enemyType.width; 
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

let frameWidth = 32;
let frameHeight = 64;
let currentFrame = 0;
let frameCount = 4;
let animationSpeed = 0.2;
let spriteX = gameCanvas.width / 2 - frameWidth / 2;
let spriteY = gameCanvas.height - frameHeight - SCREENHEIGHT * 0.12;
let isAttacking = false;
let attackDirection = "";

let idleSpriteImage = new Image();
let attackSpriteImage = new Image();

idleSpriteImage.onload = () => {
  console.log("Idle sprite image loaded");
  animate(); // Start animation loop after the idle sprite image is loaded
};
idleSpriteImage.src = "Pink_Monster.png";

attackSpriteImage.onload = () => {
  console.log("Attack sprite image loaded");
};
attackSpriteImage.src = "Pink_Monster_Attack2_6.png";

let currentSpriteImage = idleSpriteImage;

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    isAttacking = true;
    attackDirection = "left";
  } else if (event.key === "ArrowRight") {
    isAttacking = true;
    attackDirection = "right";
  }
});

function gameLoop() {
  c.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  enemies.forEach((enemy) => {
    enemy.draw();
    enemy.update();

    if (
      playerX + playerWidth >= enemy.x &&
      playerX <= enemy.x + enemy.width &&
      playerY + playerHeight >= enemy.y &&
      playerY <= enemy.y + enemy.height
    ) {
      enemy.health--;
      if (enemy.health <= 0) {
        enemies.splice(enemies.indexOf(enemy), 1); 
        score++; 
      }
    }
  });

  c.fillStyle = "black";
  c.font = "20px Arial";
  c.fillText("Lives: " + playerLives, 10, 30);
  c.fillText("Score: " + score, 10, 60);

  if (playerLives > 0) {
    requestAnimationFrame(gameLoop);
  } else {
    alert("Game Over! Your score: " + score);
    location.reload();
  }
}

function animate() {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  let frameX = Math.floor(currentFrame) * frameWidth;

  // Check if the player is attacking and switch to attack sprite image
  if (isAttacking && attackDirection === "left") {
    // Flip the sprite horizontally
    c.save();
    c.scale(-1, 1);
    c.drawImage(
      attackSpriteImage,
      frameX,
      0,
      frameWidth,
      frameHeight,
      -spriteX - frameWidth, // Flip the position as well
      spriteY,
      frameWidth,
      frameHeight
    );
    c.restore(); // Restore the canvas context to its original state
  } else if (isAttacking && attackDirection === "right") {
    c.drawImage(
      attackSpriteImage,
      frameX,
      0,
      frameWidth,
      frameHeight,
      spriteX,
      spriteY,
      frameWidth,
      frameHeight
    );
  } else {
    // If not attacking, use idle sprite image
    c.drawImage(
      idleSpriteImage,
      frameX,
      0,
      frameWidth,
      frameHeight,
      spriteX,
      spriteY,
      frameWidth,
      frameHeight
    );
  }

  currentFrame += animationSpeed;
  if (currentFrame >= frameCount) {
    currentFrame = 0;
    isAttacking = false; // Reset attacking state after finishing the animation
  }
}


function changeBackgroundImage(imagePath) {
  gameCanvas.style.backgroundImage = `url('${imagePath}')`;
  gameCanvas.style.backgroundSize = "cover";
  gameCanvas.style.backgroundRepeat = "no-repeat";
}

changeBackgroundImage("bakgrund.jpg");

animate();
