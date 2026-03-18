const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [
  { x: 9 * box, y: 10 * box },
  { x: 8 * box, y: 10 * box },
  { x: 7 * box, y: 10 * box }
]; // serpiente inicial

let direction = "RIGHT";
let food = spawnFood();
let score = 0;
let level = 1;
let speed = 150;
let game;

// Estados especiales
let paralyzed = false;
let reversedControls = false;

// Generar comida
function spawnFood() {
  const types = [
    { color: "red", effect: "grow" },
    { color: "purple", effect: "shrink" },
    { color: "orange", effect: "paralysis" },
    { color: "blue", effect: "reverse" }
  ];
  const chosen = types[Math.floor(Math.random() * types.length)];
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
    color: chosen.color,
    effect: chosen.effect
  };
}

// Dibujar comida
function drawFood() {
  ctx.fillStyle = food.color;
  ctx.fillRect(food.x, food.y, box, box);
}

// Dibujar serpiente
function drawSnake() {
  snake.forEach((segment, i) => {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(segment.x, segment.y, box, box);
  });
}

// Movimiento
function moveSnake() {
  if (paralyzed) return; // si está paralizada, no se mueve

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === "RIGHT") headX += box;
  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "DOWN") headY += box;

  // Wrap-around
  if (headX >= canvas.width) headX = 0;
  if (headX < 0) headX = canvas.width - box;
  if (headY >= canvas.height) headY = 0;
  if (headY < 0) headY = canvas.height - box;

  const newHead = { x: headX, y: headY };

  // Comer comida
  if (headX === food.x && headY === food.y) {
    applyEffect(food.effect);
    food = spawnFood();
    score++;
    document.getElementById("score").textContent = score;
    if (score % 10 === 0) {
      level++;
      document.getElementById("level").textContent = level;
    }
  } else {
    snake.pop();
  }

  // Colisión consigo misma
  if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
    clearInterval(game);
    showMessage("Game Over", "red");
  }

  snake.unshift(newHead);
}

// Aplicar efectos de comida
function applyEffect(effect) {
  if (effect === "grow") {
    const last = snake[snake.length - 1];
    snake.push({ x: last.x, y: last.y });
  }
  if (effect === "shrink") {
    if (snake.length > 2) {
      snake.pop();
      snake.pop();
    } else if (snake.length > 1) {
      snake.pop();
    }
  }
  if (effect === "paralysis") {
    paralyzed = true;
    showMessage("¡Parálisis!", "orange");
    setTimeout(() => {
      paralyzed = false;
    }, 3000); // paralizado 3 segundos
  }
  if (effect === "reverse") {
    reversedControls = !reversedControls; // toggle
    showMessage(reversedControls ? "¡Controles invertidos!" : "¡Controles normales!", "blue");
  }
}

// Dibujar todo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  drawSnake();
  moveSnake();
  drawStatus();
}

// Mostrar mensajes dentro del canvas
function showMessage(text, color) {
  ctx.fillStyle = color;
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

// Mostrar estado actual cerca del puntaje
function drawStatus() {
  let status = "Normal";
  if (paralyzed) status = "Paralizado";
  else if (reversedControls) status = "Invertido";

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText("Estado: " + status, 10, 20);
}

// Controles teclado
document.addEventListener("keydown", event => {
  let key = event.key;

  if (!reversedControls) {
    if ((key === "ArrowLeft" || key === "a") && direction !== "RIGHT") direction = "LEFT";
    if ((key === "ArrowUp" || key === "w") && direction !== "DOWN") direction = "UP";
    if ((key === "ArrowRight" || key === "d") && direction !== "LEFT") direction = "RIGHT";
    if ((key === "ArrowDown" || key === "s") && direction !== "UP") direction = "DOWN";
  } else {
    // Controles invertidos
    if ((key === "ArrowLeft" || key === "a") && direction !== "LEFT") direction = "RIGHT";
    if ((key === "ArrowUp" || key === "w") && direction !== "UP") direction = "DOWN";
    if ((key === "ArrowRight" || key === "d") && direction !== "RIGHT") direction = "LEFT";
    if ((key === "ArrowDown" || key === "s") && direction !== "DOWN") direction = "UP";
  }
});

// Controles en pantalla
document.querySelectorAll(".control-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    let dir = btn.getAttribute("data-dir");

    if (!reversedControls) {
      if (dir === "UP" && direction !== "DOWN") direction = "UP";
      if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
      if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
      if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
    } else {
      // Controles invertidos
      if (dir === "UP" && direction !== "UP") direction = "DOWN";
      if (dir === "LEFT" && direction !== "LEFT") direction = "RIGHT";
      if (dir === "DOWN" && direction !== "DOWN") direction = "UP";
      if (dir === "RIGHT" && direction !== "RIGHT") direction = "LEFT";
    }
  });
});

game = setInterval(draw, speed);
