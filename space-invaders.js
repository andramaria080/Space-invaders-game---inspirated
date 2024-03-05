const grid = document.querySelector(`.grid`);
const scoreDisplay = document.querySelector(`.score`);
const width = 15;
const invadersRemoved = [];
let currentShooterIndex = 202;
let invadersId;
let isGoingRight = true;
let direction = 1;
let score = 0;

for (let i = 0; i < width * width; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
}

const space = Array.from(document.querySelectorAll(".grid div"));
const invaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 16, 17, 18, 19, 20, 21, 22, 23, 30, 31, 32, 33,
  34, 35, 36, 37, 38,
];

const draw = () => {
  for (let i = 0; i < invaders.length; i++) {
    if (!invadersRemoved.includes(i)) {
      space[invaders[i]].classList.add("invader");
    }
  }
};
draw();

space[currentShooterIndex].classList.add("shooter");

const remove = () => {
  for (let i = 0; i < invaders.length; i++) {
    space[invaders[i]].classList.remove("invader");
  }
};

const moveShooter = () => {
  space[currentShooterIndex].classList.remove("shooter");
  switch (event.key) {
    case "ArrowLeft":
      if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
      break;
    case "ArrowRight":
      if (currentShooterIndex % width < 14) currentShooterIndex += 1;
      break;
  }
  space[currentShooterIndex].classList.add("shooter");
};
document.addEventListener("keydown", moveShooter);

const moveInvaders = () => {
  const leftEdge = invaders[0] % width === 0;
  const rightEdge = invaders[invaders.length - 1] % width === width - 1;
  remove();

  if (rightEdge && isGoingRight) {
    for (let i = 0; i < invaders.length; i++) {
      invaders[i] += width + 1;
      direction = -1;
      isGoingRight = false;
    }
  }
  if (leftEdge && !isGoingRight) {
    for (let i = 0; i < invaders.length; i++) {
      invaders[i] += width - 1;
      direction = 1;
      isGoingRight = true;
    }
  }
  for (let i = 0; i < invaders.length; i++) {
    invaders[i] += direction;
  }
  draw();

  if (space[currentShooterIndex].classList.contains("invader")) {
    scoreDisplay.innerHTML = "GAME OVER";
    clearInterval(invadersId);
  }
  if (invadersRemoved.length === invaders.length) {
    scoreDisplay.innerHTML = "YOU WIN";
    clearInterval(invadersId);
  }
};
invadersId = setInterval(moveInvaders, 600);

function shoot() {
  let laserId;
  let currentLaserIndex = currentShooterIndex;
  const moveLaser = () => {
    space[currentLaserIndex].classList.remove("laser");
    currentLaserIndex -= width;
    space[currentLaserIndex].classList.add("laser");

    if (space[currentLaserIndex].classList.contains("invader")) {
      space[currentLaserIndex].classList.remove("laser");
      space[currentLaserIndex].classList.remove("invader");
      space[currentLaserIndex].classList.add("boom");

      setTimeout(() => space[currentLaserIndex].classList.remove("boom"), 300);
      clearInterval(laserId);

      const invaderRemoved = invaders.indexOf(currentLaserIndex);
      invadersRemoved.push(invaderRemoved);
      score++;
      scoreDisplay.innerHTML = score;
    }
  };

  if (event.key === "ArrowUp") {
    laserId = setInterval(moveLaser, 100);
  }
}

document.addEventListener("keydown", shoot);
