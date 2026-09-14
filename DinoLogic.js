const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');

const GROUND_Y = 250;
const GRAVITY = 0.6;
const JUMP_FORCE = -11;

let gameSpeed = 6;
let score = 0;
let bestScore = parseInt(localStorage.getItem('dinoBest') || '0', 10);
let isGameOver = false;
let isStarted = false;
let frame = 0;


const dino = {
  x: 50,
  y: GROUND_Y - 40,
  width: 40,
  height: 40,
  duckHeight: 22,
  vy: 0,
  isJumping: false,
  isDucking: false,
};

function resetDino() {
  dino.y = GROUND_Y - 40;
  dino.vy = 0;
  dino.isJumping = false;
  dino.isDucking = false;
}


let obstacles = [];

function spawnObstacle() {
  const types = [
    { w: 20, h: 40, y: GROUND_Y - 40, type: 'cactusSmall' },
    { w: 30, h: 50, y: GROUND_Y - 50, type: 'cactusBig' },
    { w: 34, h: 24, y: GROUND_Y - 90, type: 'bird' },     // vuela alto
    { w: 34, h: 24, y: GROUND_Y - 40, type: 'birdLow' },  // obliga a agacharse
  ];
  const t = types[Math.floor(Math.random() * types.length)];
  obstacles.push({
    x: canvas.width,
    y: t.y,
    width: t.w,
    height: t.h,
    type: t.type,
  });
}

let nextSpawnFrame = 90;


let groundOffset = 0;


let clouds = [
  { x: 200, y: 60 },
  { x: 500, y: 100 },
  { x: 750, y: 50 },
];

function drawGround() {
  ctx.strokeStyle = '#535353';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(canvas.width, GROUND_Y);
  ctx.stroke();

  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width / 20 + 2; i++) {
    const x = (i * 20 - (groundOffset % 20));
    ctx.beginPath();
    ctx.moveTo(x, GROUND_Y + 5);
    ctx.lineTo(x + 8, GROUND_Y + 5);
    ctx.stroke();
  }
}

function drawClouds() {
  ctx.fillStyle = '#c8c8c8';
  clouds.forEach(c => {
    ctx.fillRect(c.x, c.y, 40, 8);
    ctx.fillRect(c.x + 8, c.y - 6, 24, 8);
  });
}

function updateClouds() {
  clouds.forEach(c => {
    c.x -= gameSpeed * 0.3;
    if (c.x < -50) {
      c.x = canvas.width + Math.random() * 100;
      c.y = 40 + Math.random() * 80;
    }
  });
}

function drawDino() {
  ctx.fillStyle = '#535353';
  const h = dino.isDucking ? dino.duckHeight : dino.height;
  const y = dino.isDucking ? GROUND_Y - dino.duckHeight : dino.y;
  const w = dino.isDucking ? dino.width + 15 : dino.width;

  ctx.fillRect(dino.x, y, w, h);

  if (!dino.isJumping && !dino.isDucking) {
    const legOffset = Math.floor(frame / 6) % 2 === 0 ? 0 : 6;
    ctx.fillRect(dino.x + 5 + legOffset, y + h, 6, 6);
    ctx.fillRect(dino.x + w - 11 - legOffset, y + h, 6, 6);
  }

  ctx.fillStyle = '#fff';
  ctx.fillRect(dino.x + w - 12, y + 6, 4, 4);
}

function drawObstacle(o) {
  ctx.fillStyle = '#535353';
  if (o.type === 'bird' || o.type === 'birdLow') {
    const wingUp = Math.floor(frame / 10) % 2 === 0;
    ctx.fillRect(o.x, o.y + (wingUp ? 0 : 6), o.width, 6);
    ctx.fillRect(o.x + 10, o.y - 6, 6, 6);
  } else {
    ctx.fillRect(o.x, o.y, o.width, o.height);
    ctx.fillRect(o.x - 4, o.y + 8, 4, 6);
    ctx.fillRect(o.x + o.width, o.y + 14, 4, 6);
  }
}

function checkCollisions() {
  const h = dino.isDucking ? dino.duckHeight : dino.height;
  const y = dino.isDucking ? GROUND_Y - dino.duckHeight : dino.y;
  const w = dino.isDucking ? dino.width + 15 : dino.width;

  for (const o of obstacles) {
    const margin = 6;
    if (
      dino.x + margin < o.x + o.width - margin &&
      dino.x + w - margin > o.x + margin &&
      y + margin < o.y + o.height - margin &&
      y + h - margin > o.y + margin
    ) {
      return true;
    }
  }
  return false;
}

function update() {
  if (!isStarted || isGameOver) return;

  frame++;
  groundOffset += gameSpeed;

  dino.vy += GRAVITY;
  dino.y += dino.vy;
  if (dino.y > GROUND_Y - dino.height) {
    dino.y = GROUND_Y - dino.height;
    dino.vy = 0;
    dino.isJumping = false;
  }

  updateClouds();

  obstacles.forEach(o => o.x -= gameSpeed);
  obstacles = obstacles.filter(o => o.x + o.width > -20);

  if (frame >= nextSpawnFrame) {
    spawnObstacle();
    nextSpawnFrame = frame + 60 + Math.random() * 60 - gameSpeed * 2;
    if (nextSpawnFrame - frame < 40) nextSpawnFrame = frame + 40;
  }

  score += 1;
  if (score % 100 === 0) {
    gameSpeed += 0.3;
  }

  if (checkCollisions()) {
    gameOver();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawClouds();
  drawGround();
  drawDino();
  obstacles.forEach(drawObstacle);

  const displayScore = Math.floor(score / 5);
  scoreEl.textContent =
    'PUNTAJE: ' + String(displayScore).padStart(4, '0') +
    '  MEJOR: ' + String(bestScore).padStart(4, '0');
}

function gameOver() {
  isGameOver = true;
  const finalScore = Math.floor(score / 5);
  if (finalScore > bestScore) {
    bestScore = finalScore;
    localStorage.setItem('dinoBest', bestScore);
  }
  messageEl.textContent = 'GAME OVER — Presiona ESPACIO para reiniciar';
}

function startGame() {
  isStarted = true;
  isGameOver = false;
  score = 0;
  gameSpeed = 6;
  frame = 0;
  nextSpawnFrame = 90;
  obstacles = [];
  resetDino();
  messageEl.textContent = '';
}

function jump() {
  if (!dino.isJumping && !isGameOver) {
    dino.vy = JUMP_FORCE;
    dino.isJumping = true;
    dino.isDucking = false;
  }
}

function duck(state) {
  if (!dino.isJumping) {
    dino.isDucking = state;
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    if (!isStarted || isGameOver) {
      startGame();
    } else {
      jump();
    }
  }
  if (e.code === 'ArrowDown') {
    e.preventDefault();
    duck(true);
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowDown') {
    duck(false);
  }
});

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!isStarted || isGameOver) {
    startGame();
  } else {
    jump();
  }
});

messageEl.textContent = 'Presiona ESPACIO para comenzar';

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
