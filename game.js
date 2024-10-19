const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas size to the browser window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreEl = document.getElementById('score');
const healthEl = document.getElementById('health');
const highScoreEl = document.getElementById('highScore');

// Load the image
const img = new Image();
img.src = 'cassidy.jpeg'; // Path to the image you provided

// Calculate the centered position for the image on the canvas
const imageWidth = 578;
const imageHeight = 768;
const imageX = (canvas.width - imageWidth) / 2;  // Center horizontally
const imageY = (canvas.height - imageHeight) / 2; // Center vertically

// Coordinates for the nose, relative to the centered image's position
const noseX = imageX + 117; // Adjusted to account for the image position on the centered canvas
const noseY = imageY + 428; // Adjusted to account for the image position on the centered canvas

// Booger class
class Booger {
  constructor(x, y, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();
  }
}

let boogers = [];
let score = 0;
let health = 3;
let highScore = localStorage.getItem('highScore') || 0;
highScoreEl.textContent = highScore;

// Generate a random booger
function spawnBooger() {
  const angle = Math.random() * Math.PI * 2;
  const speed = 1 + Math.random() * 1.5; // Adjusted speed for slower boogers
  const speedX = Math.cos(angle) * speed;
  const speedY = Math.sin(angle) * speed;
  boogers.push(new Booger(noseX, noseY, speedX, speedY));
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight); // Draw the image at its centered coordinates

  // Update boogers
  for (let i = 0; i < boogers.length; i++) {
    boogers[i].update();
    boogers[i].draw();

    // Check if booger is out of bounds of the entire screen (browser window)
    if (boogers[i].x < 0 || boogers[i].x > window.innerWidth || boogers[i].y < 0 || boogers[i].y > window.innerHeight) {
      boogers.splice(i, 1);
      health--;
      healthEl.textContent = health;
      if (health <= 0) {
        alert('Game Over! Your score: ' + score);
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('highScore', highScore);
          highScoreEl.textContent = highScore;
        }
        resetGame();
      }
    }
  }
  requestAnimationFrame(updateGame);
}

function resetGame() {
  score = 0;
  health = 3;
  boogers = [];
  scoreEl.textContent = score;
  healthEl.textContent = health;
}

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  for (let i = 0; i < boogers.length; i++) {
    const dx = mouseX - boogers[i].x;
    const dy = mouseY - boogers[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if clicked on booger
    if (distance < boogers[i].radius) {
      score++;
      boogers.splice(i, 1);
      scoreEl.textContent = score;
      break;
    }
  }
});

// Game initialization
img.onload = () => {
  // Center the visible area to the image (optional if the image isn't large enough)
  window.scrollTo({
    top: imageY - window.innerHeight / 2 + imageHeight / 2,
    left: imageX - window.innerWidth / 2 + imageWidth / 2,
    behavior: 'smooth'
  });

  setInterval(spawnBooger, 3000); // Slower spawn rate
  updateGame();
};
