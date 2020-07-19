document.addEventListener(`DOMContentLoaded`, () => {
  const grid = document.querySelector(`.grid`);
  const drogon = document.querySelector(`.drogon`);
  const gameOverAlert = document.getElementById(`game-over-alert`);
  let isFlyingUp = false;
  let isGameOver = false;
  let gravity = 0.9;

  const flyControl = (event) => {
    //SPACEBAR
    if (event.keyCode === 32) {
      //START isFlyingUp
      if (!isFlyingUp && !isGameOver) {
        isFlyingUp = true;
        fly();
      }
    }
  };

  document.addEventListener(`keyup`, flyControl);

  let drogonPositionY = 0;
  const fly = () => {
    let flyCount = 0;

    let flyDuration = setInterval(() => {
      //DROGON DOWN
      if (flyCount === 15) {
        clearInterval(flyDuration);

        let fallDuration = setInterval(() => {
          //RESET isFlyingUp
          if (flyCount === 0) {
            clearInterval(fallDuration);
            isFlyingUp = false;
          }

          flyCount--;
          drogonPositionY -= 0.5;
          drogonPositionY *= gravity;
          drogon.style.bottom = `${drogonPositionY}rem`;
        }, 80);
      }

      //DROGON UP
      flyCount++;
      drogonPositionY += 3;
      drogonPositionY *= gravity;
      drogon.style.bottom = `${drogonPositionY}rem`;
    }, 80);
  };

  const generateObstacle = () => {
    const cloud = document.createElement(`div`);
    const obstacle = document.createElement(`div`);
    const mountains = [
      "assets/mountain1.svg",
      "assets/mountain2.svg",
      "assets/mountain3.svg",
      "assets/mountain4.svg",
      "assets/mountain5.svg",
    ];
    const randomizer = Math.round(Math.random() * 4);

    let cloudPositionX = 100;
    let obstaclePositionX = 100;
    let randomTime = Math.random() * 2000 + 3000;

    if (!isGameOver) {
      obstacle.classList.add(`obstacle`);
      cloud.classList.add(`cloud`);
    }

    grid.appendChild(cloud);
    cloud.style.left = `${cloudPositionX}rem`;

    grid.appendChild(obstacle);
    obstacle.style.left = `${obstaclePositionX}rem`;
    obstacle.style.backgroundImage = `url(${mountains[randomizer]})`;

    let timer = setInterval(() => {
      //GAME OVER
      if (
        obstaclePositionX > 0 &&
        obstaclePositionX < 10 &&
        drogonPositionY < 10
      ) {
        clearInterval(timer);
        gameOverAlert.innerHTML = `GAME OVER`;
        isGameOver = true;

        drogon.classList.add(`stop`);
        document.getElementById(`drogon1`).remove();
        document.getElementById(`drogon2`).remove();
      }

      cloudPositionX -= 0.5;
      cloud.style.left = `${cloudPositionX}rem`;

      obstaclePositionX -= 1;
      obstacle.style.left = `${obstaclePositionX}rem`;

      if (cloud.style.left === `-20rem`) cloud.parentNode.removeChild(cloud);

      if (obstacle.style.left === `-20rem`)
        obstacle.parentNode.removeChild(obstacle);
    }, 20);

    let obstacleTimer = () => setTimeout(generateObstacle, randomTime);

    if (isGameOver) clearTimeout(obstacleTimer);
    if (!isGameOver) obstacleTimer();
  };

  generateObstacle();
});
