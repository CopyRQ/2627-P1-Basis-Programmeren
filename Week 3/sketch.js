function setup() {
  createCanvas(1200, 800);
}

function draw() {
  background(220);
  drawCar()
}


function drawCar(x, y, bodyColor, direction = 1, type = 'sedan') {
  push();
  translate(x, y);
  scale(direction, 1);
  noStroke();
  fill(0, 0, 0, 18);
  rect(4, 6, 150, 44, 10);
  fill(bodyColor);
  if (type === 'van') {
    rect(0, 0, 150, 54, 10);
    rect(22, -28, 106, 28, 8);
  } else if (type === 'sports') {
    rect(0, 0, 150, 38, 10);
    quad(22, 0, 48, -26, 102, -26, 128, 0);
  } else if (type === 'pickup') {
    rect(0, 0, 150, 40, 10);
    rect(92, -18, 52, 18, 6);
  } else {
    rect(0, 0, 150, 40, 10);
    rect(26, -20, 98, 20, 8);
  }
  fill(180, 220, 255);
  if (type === 'van') {
    rect(32, -10, 40, 18, 4);
    rect(78, -10, 40, 18, 4);
  } else if (type === 'sports') {
    rect(38, -8, 32, 18, 4);
    rect(78, -8, 32, 18, 4);
  } else if (type === 'pickup') {
    rect(34, -8, 28, 16, 4);
    rect(70, -8, 28, 16, 4);
    rect(104, -8, 20, 16, 4);
  } else {
    rect(34, -8, 30, 16, 4);
    rect(72, -8, 30, 16, 4);
    rect(110, -8, 10, 16, 4);
  }
  fill(35);
  circle(36, 52, 26);
  circle(114, 52, 26);
  fill(180);
  circle(36, 52, 12);
  circle(114, 52, 12);
  pop();
}