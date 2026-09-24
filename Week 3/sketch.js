let grid = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];

let confetti = [];

let numberOfColumns = 3;
let numberOfRows = 3;
let cellSize = 200; // Width and height of each cell in pixels
let cellGap = 20; // Gap between cells in pixels

let gridOffsetX, gridOffsetY; // Distance from the edge of the canvas to the grid

let currentPlayer = 1; // 1 = Red, 2 = Blue
let gameState = 'playing';
let winner;
let gameOverSoundPlayed = false;

let transitionAmount = 0; // 0 = fully red, 1 = fully blue

async function setup() {

  createCanvas(1878, 956);

  mySound = await loadSound('weird-route-jingle.mp3');
  mySound2 = await loadSound('win.mp3');
  mySound.setVolume(0.1);
  mySound2.setVolume(0.3);

  // Calculate offsets to center the grid on the canvas
  // Grid offset specifies where the center of the board is to draw the squares around it
  gridOffsetX = (width - numberOfColumns * cellSize) / 2;
  gridOffsetY = (height - numberOfRows * cellSize) / 2;

}

function draw() {

  let targetAmount;

  if (gameState === 'game_over') {
    // 0 = red, 1 = blue
    targetAmount = winner === 1 ? 0 : winner === 2 ? 1 : transitionAmount;
  } else {
    targetAmount = currentPlayer === 1 ? 0 : 1;
  }

  transitionAmount = lerp(transitionAmount, targetAmount, 0.1); // Linear interpolation
  let redColor = color('#e60b0b');
  let blueColor = color('#0329ff');
  let currentBackgroundColor = lerpColor(redColor, blueColor, transitionAmount);
  background(currentBackgroundColor);
  cursor(ARROW);

  // Draw the grid
  for (let column = 0; column < numberOfColumns; column++) {
    for (let row = 0; row < numberOfRows; row++) {
      let cellX = gridOffsetX + column * cellSize;
      let cellY = gridOffsetY + row * cellSize;

      // Check if the mouse is hovering over this cell
      let isHovering =
        mouseX > cellX + cellGap / 2 &&
        mouseX < cellX + cellSize - cellGap / 2 &&
        mouseY > cellY + cellGap / 2 &&
        mouseY < cellY + cellSize - cellGap / 2;

      // Draw the cell background
      if (isHovering && grid[column][row] === 0 && gameState === 'playing') {
        fill('#e8e8e8');
        stroke('#777777');
        cursor(HAND);
      } else {
        fill(255);
        stroke(0);
      }

      strokeWeight(2);
      rect(cellX + cellGap / 2, cellY + cellGap / 2, cellSize - cellGap, cellSize - cellGap);

      // Draw a circle (O) for Blue (player 2)
      if (grid[column][row] === 2) {
        noFill();
        stroke('#0329ff');
        strokeWeight(8);
        let circleCenterX = cellX + cellSize / 2;
        let circleCenterY = cellY + cellSize / 2;
        circle(circleCenterX, circleCenterY, cellSize * 0.6);
      }

      // Draw a cross (X) for Red (player 1)
      if (grid[column][row] === 1) {
        stroke('#e60b0b');
        strokeWeight(8);
        let crossPadding = 40; // Space between the X and the cell edge
        line(
          cellX + crossPadding,
          cellY + crossPadding,
          cellX + cellSize - crossPadding,
          cellY + cellSize - crossPadding
        ); // top-left to bottom-right
        line(
          cellX + cellSize - crossPadding,
          cellY + crossPadding,
          cellX + crossPadding,
          cellY + cellSize - crossPadding
        ); // top-right to bottom-left
      }
    }
  }

  // Draw the winner announcement
  textFont('Comic Sans MS');
  textAlign(CENTER, CENTER);
  textSize(64);
  if (gameState === 'game_over') {
    let winnerText = winner === 1 ? 'Red Wins!' : winner === 2 ? 'Blue Wins!' : 'Its a Draw!';
    let winnerColor = winner === 1 ? '#e60b0b' : winner === 2 ? '#0329ff' : '#000000';

    let padding = 16;
    let boxWidth = textWidth(winnerText) + padding * 2; // fits the text width
    let boxHeight = textSize() + padding * 2; // fits the text height
    let textCenterX = width / 2;
    let textCenterY = height * 0.1;

    // Draw box tightly around the text
    fill(255);
    stroke(0);
    strokeWeight(4);
    rect(textCenterX - boxWidth / 2, textCenterY - boxHeight / 2, boxWidth, boxHeight);

    // Draw text on top
    fill(winnerColor);
    noStroke();
    text(winnerText, textCenterX, textCenterY);
  }

  // Draw the restart button (only visible when game is over)
  if (gameState === 'game_over') {
    textSize(32);
    let restartLabel = 'Restart';
    let padding = 12;
    let boxWidth = textWidth(restartLabel) + padding * 2; // fits the text width
    let boxHeight = textSize() + padding * 2; // fits the text height

    let restartX = width / 2;
    let restartY = height * 0.9;

    // Hover detection based on the text-fitted box
    let isHoveringOverRestartButton = 
    mouseX > restartX - boxWidth / 2 &&
    mouseX < restartX + boxWidth / 2 &&
    mouseY > restartY - boxHeight / 2 &&
    mouseY < restartY + boxHeight / 2;

    // Draw box
    if (isHoveringOverRestartButton) {
      fill('#1dbb3f');
      stroke('#1dbb3f');
      cursor(HAND);
    } else {
      fill(255);
      stroke(0);
    }
    strokeWeight(3);
    rect(restartX - boxWidth / 2, restartY - boxHeight / 2, boxWidth, boxHeight);

    // Draw text on top
    noStroke();
    fill(isHoveringOverRestartButton ? 255 : 0);
    text(restartLabel, restartX, restartY);
  }

  if (gameState === 'game_over' && !gameOverSoundPlayed) {
    mySound2.play();
    gameOverSoundPlayed = true;
  }

  updateConfetti();

}

// Handle mouse clicks
function mousePressed() {

  // Calculate which cell was clicked (taking offsets into account)
  let clickedColumn = floor((mouseX - gridOffsetX) / cellSize);
  let clickedRow = floor((mouseY - gridOffsetY) / cellSize);

  // Place a piece if the click is within the grid and the game is still going
  if (
    clickedColumn >= 0 &&
    clickedColumn < numberOfColumns &&
    clickedRow >= 0 &&
    clickedRow < numberOfRows
  ) {
    // when you click on any of the boxes in the grid this executes
    if (grid[clickedColumn][clickedRow] === 0 && gameState === 'playing') {
      grid[clickedColumn][clickedRow] = currentPlayer;

      mySound.play();

      // Switch turns
      if (currentPlayer === 1) {
        currentPlayer = 2;
      } else {
        currentPlayer = 1;
      }
    }
  }

  // Check if the restart button was clicked when the game is over
  if (gameState === 'game_over') {
    let restartX = width / 2;
    let restartY = height * 0.9;
    let padding = 12;
    let boxWidth = textWidth('Restart') + padding * 2;
    let boxHeight = 32 + padding * 2;
    let isClickingRestartButton =
      mouseX > restartX - boxWidth / 2 &&
      mouseX < restartX + boxWidth / 2 &&
      mouseY > restartY - boxHeight / 2 &&
      mouseY < restartY + boxHeight / 2;
    if (isClickingRestartButton) {
      mySound2.stop();
      restartGame();
    }
  }

  checkWinner();

}

function checkWinner() {

  // Check all rows and columns
  for (let lineIndex = 0; lineIndex < 3; lineIndex++) {
    // Check row lineIndex
    if (
      grid[0][lineIndex] !== 0 &&
      grid[0][lineIndex] === grid[1][lineIndex] &&
      grid[1][lineIndex] === grid[2][lineIndex]
    ) {
      winner = grid[0][lineIndex];
      gameState = 'game_over';
    }
    // Check column lineIndex
    if (
      grid[lineIndex][0] !== 0 &&
      grid[lineIndex][0] === grid[lineIndex][1] &&
      grid[lineIndex][1] === grid[lineIndex][2]
    ) {
      winner = grid[lineIndex][0];
      gameState = 'game_over';
    }
  }

  // Check diagonal top-left to bottom-right
  if (grid[0][0] !== 0 && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
    winner = grid[0][0];
    gameState = 'game_over';
  }

  // Check diagonal top-right to bottom-left
  if (grid[2][0] !== 0 && grid[2][0] === grid[1][1] && grid[1][1] === grid[0][2]) {
    winner = grid[2][0];
    gameState = 'game_over';
  }

  // Check for a draw (no empty cells left and no winner)
  if (gameState === 'playing') {
    let emptyCellCount = 0;
    for (let column = 0; column < 3; column++) {
      for (let row = 0; row < 3; row++) {
        if (grid[column][row] === 0) {
          emptyCellCount++;
        }
      }
    }
    if (emptyCellCount === 0) {
      winner = 0; // 0 means draw
      gameState = 'game_over';
    }
  }
}

function restartGame() {

  // Reset all cells to empty
  for (let column = 0; column < 3; column++) {
    for (let row = 0; row < 3; row++) {
      grid[column][row] = 0;
    }
  }

  gameOverSoundPlayed = false;
  gameState = 'playing';
  currentPlayer = 1;
  winner = undefined;
  confetti = [];
}

function updateConfetti() {
  // Keep generating confetti while the win sound is playing
  if (mySound2.isPlaying()) {
    for (let i = 0; i < 6; i++) {
      confetti.push({
        x: random(width),
        y: random(-50, -10),
        size: random(8, 16),
        speedY: random(2, 6),
        speedX: random(-2, 2),
        rotation: random(TWO_PI),
        rotationSpeed: random(-0.1, 0.1),
        color: random([
          '#ff0000',
          '#00ff00',
          '#0000ff',
          '#ffff00',
          '#ff00ff',
          '#00ffff',
          '#ffffff',
        ]),
      });
    }
  }

  // Update and draw confetti
  for (let i = confetti.length - 1; i >= 0; i--) {
    let piece = confetti[i];

    piece.x += piece.speedX;
    piece.y += piece.speedY;
    piece.rotation += piece.rotationSpeed;

    push();
    translate(piece.x, piece.y);
    rotate(piece.rotation);

    fill(piece.color);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, piece.size, piece.size * 0.6);

    pop();

    // Remove confetti that has fallen off screen
    if (piece.y > height + 50) {
      confetti.splice(i, 1);
    }
  }
}