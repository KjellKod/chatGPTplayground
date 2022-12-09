const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const SIZE = 20; // size of each grid cell
const SPEED = 175; // speed of the snake
const WIDTH = 500;
const HEIGHT = 500;
let paused = false; 

// create the initial snake
const snake = [{ x: 160, y: 160 }, { x: 140, y: 160 }, { x: 120, y: 160 }];

// create the initial food
let food = { x: 200, y: 200 };

let hasEatenFood = false;

// draw the head
drawSquare(snake[0].x, snake[0].y, SIZE);

  // change the color back to green for the rest of the snake
  ctx.fillStyle = 'green';
  for (const segment of snake) {
    drawSquare(segment.x, segment.y, SIZE);
  }

// draw a square at the given x, y coordinates with the given size
function drawSquare(x, y, size) {
  ctx.fillRect(x, y, size, size);
}


// draw the snake by drawing each of its segments
function drawSnake() {
  // change the color of the head to brown
  ctx.fillStyle = 'black';

  // draw the head
  drawSquare(snake[0].x, snake[0].y, SIZE);

  // change the color back to green for the rest of the snake
  ctx.fillStyle = 'green';

  // draw the rest of the snake
  for (const [index, segment] of snake.entries()) {
    // skip the first segment (the head)
    if (index === 0) {
      continue;
    }

    drawSquare(segment.x, segment.y, SIZE);
  }
}



// draw the food by drawing a red square at its x, y coordinates
function drawFood() {
  // if the snake has eaten food, draw an explosion instead of the food
  if (hasEatenFood) {
    drawExplosion();
    drawExplosionParticles();
  } else {
    // if the snake hasn't eaten food, draw a red square at the food's position
    ctx.fillStyle = 'red';
    drawSquare(food.x, food.y, SIZE);
  }
}

// draw the explosion using the canvas context's arc() method
function drawExplosion() {
  // create a gradient for the explosion using the canvas context's createLinearGradient() method
  const gradient = ctx.createLinearGradient(
    food.x,
    food.y,
    food.x + SIZE,
    food.y + SIZE
  );
  gradient.addColorStop(0, 'orange');
  gradient.addColorStop(1, 'red');

  // draw the explosion using the canvas context's arc() method
  ctx.beginPath();
  ctx.arc(
    food.x + SIZE / 2,
    food.y + SIZE / 2,
    SIZE / 2 * 4, // increase the radius of the explosion to make it 4 times larger
    0,
    Math.PI * 2
  );
  ctx.fillStyle = gradient;
  ctx.fill();
}



// draw the explosion particles using the canvas context's fillRect() method
function drawExplosionParticles() {
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = 'rgba(255, 165, 0, 0.8)';
    ctx.fillRect(
      food.x + SIZE / 2 + (Math.random() - 0.5) * SIZE,
      food.y + SIZE / 2 + (Math.random() - 0.5) * SIZE,
      2,
      2
    );
  }
}




// move the snake in the current direction
function moveSnake() {

    if (paused) {
    return;
  }

  const head = snake[0]; // the head is the first segment of the snake
  let newHead; // the new position of the head

  // move the head in the current direction
  if (currentDirection === 'right') {
    newHead = { x: (head.x + SIZE) % canvas.width, y: head.y };
  } else if (currentDirection === 'down') {
    newHead = { x: head.x, y: (head.y + SIZE) % canvas.height };
  } else if (currentDirection === 'left') {
    newHead = { x: (head.x - SIZE + canvas.width) % canvas.width, y: head.y };
  } else if (currentDirection === 'up') {
    newHead = { x: head.x, y: (head.y - SIZE + canvas.height) % canvas.height };
  }

  // add the new head to the beginning of the snake
  snake.unshift(newHead);

  // if the snake hasn't eaten food, remove its tail
  if (!hasEatenFood) {
    snake.pop();
  } else {
    // if the snake has eaten food, create a new food at a random location
    createFood();
  }
}


// create a new food at a random location on the canvas
function createFood() {
  food = {
    x: Math.floor(Math.random() * 20) * SIZE,
    y: Math.floor(Math.random() * 20) * SIZE
  };
}

// draw the game by drawing the snake and the food
function draw() {
  if (paused) {
    return;
  }

  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw the snake and the food
  drawSnake();
  drawFood();


// main game loop
//function gameLoop() {
  // check if the game is over
  if (hasGameEnded()) {
    //alert('Game Over!\n');
    return;
  }

  // move the snake in the current direction
  moveSnake();


 // update the game state
  hasEatenFood = hasSnakeEatenFood();
}


  //
// initialize the current direction to 'right'
let currentDirection = 'right';

// handle keyboard events to change the direction of the snake
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') {
    currentDirection = 'right';
  } else if (event.key === 'ArrowDown') {
    currentDirection = 'down';
  } else if (event.key === 'ArrowLeft') {
    currentDirection = 'left';
  } else if (event.key === 'ArrowUp') {
    currentDirection = 'up';
  } else if (event.key === ' ') {
    console.log("space bar used");
    if (paused === true) {
      paused = false;
    } else {
      paused = true;
    }
  } else {
    console.log(event.key);
  }
});

// check if the game is over
function hasGameEnded() {
  // the game is over if the snake hits a wall or itself
  const head = snake[0];
  return (
    head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
    snake.slice(1).includes(head)
  );
}

// check if the snake has eaten food
function hasSnakeEatenFood() {
  return snake[0].x === food.x && snake[0].y === food.y;
}

// update the game state and draw the game at a fixed interval
setInterval(() => {
  // update the game state
  hasEatenFood = hasSnakeEatenFood();
  draw();
}, SPEED);

