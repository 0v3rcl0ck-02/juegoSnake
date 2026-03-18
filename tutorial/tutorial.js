const canvas = document.getElementById("tutorialCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [
  { x: 9 * box, y: 10 * box },
  { x: 8 * box, y: 10 * box },
  { x: 7 * box, y: 10 * box }
];

let direction = "RIGHT";
let speed = 200; 
let game;
let paralyzed = false;
let reversed = false;

// Dibujar serpiente y estado
function drawSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.forEach((segment, i) => {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(segment.x, segment.y, box, box);
  });

  // Mostrar estado actual
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  let estado = "Normal";
  if (paralyzed) estado = "Paralizado";
  else if (reversed) estado = "Invertido";
  ctx.fillText("Estado: " + estado, 10, 20);
}

// Movimiento automático con wrap-around
function moveSnake() {
  if (paralyzed) {
    drawSnake();
    return;
  }

  let headX = snake[0].x;
  let headY = snake[0].y;

  // Usar dirección actual tal cual (no se invierte la serpiente)
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
  snake.unshift(newHead);
  snake.pop();

  drawSnake();
}

function startGame() {
  if (game) clearInterval(game);
  game = setInterval(moveSnake, speed);
}

startGame();

// Efectos de las comidas
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
    setTimeout(() => {
      paralyzed = false;
    }, 2000); // paralizado 2 segundos
  }
  if (effect === "reverse") {
    reversed = !reversed; // toggle controles invertidos
  }
  drawSnake();
}

// Botones de comida
document.querySelectorAll(".food-buttons button").forEach(btn => {
  btn.addEventListener("click", () => {
    const effect = btn.getAttribute("data-effect");
    applyEffect(effect);
  });
});

// Controles WASD
document.addEventListener("keydown", event => {
  if (!reversed) {
    if (event.key === "w" && direction !== "DOWN") direction = "UP";
    if (event.key === "a" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "s" && direction !== "UP") direction = "DOWN";
    if (event.key === "d" && direction !== "LEFT") direction = "RIGHT";
  } else {
    // Controles invertidos
    if (event.key === "w" && direction !== "UP") direction = "DOWN";
    if (event.key === "a" && direction !== "LEFT") direction = "RIGHT";
    if (event.key === "s" && direction !== "DOWN") direction = "UP";
    if (event.key === "d" && direction !== "RIGHT") direction = "LEFT";
  }
});

// Botones en pantalla
document.querySelectorAll(".control-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const dir = btn.getAttribute("data-dir");
    if (!reversed) {
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
