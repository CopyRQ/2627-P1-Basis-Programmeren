function setup() {
  createCanvas(1200, 800);
}

function draw() {
  background(220);
  
  fill(255);
  stroke(0);
  strokeWeight(3);
  
  textSize(32);
  textStyle(BOLD);
  text("Michael van Eijnsbergen", 25, 50);
    
  drawFlag();
  drawCheckerboard(25, 220, 150, 8); 
  drawHouse(25, 450, 120, 150);
  drawStoplight();
  drawDice()
}

function drawFlag() {
  noStroke();
  fill(200,0,0);
  rect(25,75,150,40);

  fill(255,255,255);
  rect(25,115,150,40);

  fill(0,0,125);
  rect(25,155,150,40);
}

function drawCheckerboard(x, y, boardSize, size) {
  let tileSize = boardSize / size;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {

      if ((row + col) % 2 === 0) {
        fill(255);
      } else {
        fill(0);
      }
      

      let tileX = x + col * tileSize;
      let tileY = y + row * tileSize;

      rect(tileX, tileY, tileSize, tileSize);
    }
  }
}

function drawHouse(x, y, sz, alphaValue) {
  fill(200, 100, 100, alphaValue);
  rect(x, y, sz, sz);
  
  fill(120, 40, 40, alphaValue);
  triangle(x, y, x + sz / 2, y - sz * 0.6, x + sz, y);
  
  let doorW = sz * 0.25;
  let doorH = sz * 0.45;
  let doorX = x + (sz / 2) - (doorW / 2);
  let doorY = y + sz - doorH;
  fill(90, 50, 20, alphaValue);
  rect(doorX, doorY, doorW, doorH);
  
  fill(255, 215, 0, alphaValue);
  ellipse(doorX + doorW * 0.8, doorY + doorH * 0.5, sz * 0.04);

  let winSz = sz * 0.22;
  let winY = y + sz * 0.2;
  let winLeftX = x + sz * 0.15;
  let winRightX = x + sz * 0.63;
  
  fill(200, 230, 255, alphaValue);
  rect(winLeftX, winY, winSz, winSz);
  rect(winRightX, winY, winSz, winSz);
  
  stroke(0, alphaValue); 

  line(winLeftX + winSz/2, winY, winLeftX + winSz/2, winY + winSz);
  line(winLeftX, winY + winSz/2, winLeftX + winSz, winY + winSz/2);

  line(winRightX + winSz/2, winY, winRightX + winSz/2, winY + winSz);
  line(winRightX, winY + winSz/2, winRightX + winSz, winY + winSz/2);
  noStroke();
}

function drawStoplight() {
  fill(150)
  stroke(0)
  rect(250, 75, 100, 230);
  fill("red")
  circle(300, 120, 60);
  fill("orange")
  circle(300, 190, 60);
  fill("green")
  circle(300, 260, 60);
}

function drawDice () {
  fill(255);
  rect(250, 350, 100);
  fill(0);
  circle(275, 375, 20);
  circle(300, 400, 20);
  circle(325, 375, 20);
  circle(325, 425, 20);
  circle(275, 425, 20);
}