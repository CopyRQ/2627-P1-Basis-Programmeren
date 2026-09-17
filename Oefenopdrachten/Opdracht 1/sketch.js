function setup() {
  createCanvas(900, 600);
  noLoop();
}

function draw() {
  background(255);
  stroke(0);
  strokeWeight(6);

  // buitenste zwarte rand
  noFill();
  rect(0, 0, width, height);

  // grote vakken
  fill(0, 70, 180);
  rect(0, 0, 300, 160);

  fill(255);
  rect(300, 0, 180, 160);

  fill(255);
  rect(480, 0, 170, 160);

  fill(255, 215, 0);
  rect(650, 0, 250, 160);

  fill(255, 0, 0);
  rect(0, 160, 300, 200);

  fill(255);
  rect(300, 160, 180, 200);

  fill(0);
  rect(480, 160, 170, 200);

  fill(255);
  rect(650, 160, 250, 200);

  fill(0, 70, 180);
  rect(0, 360, 300, 240);

  fill(255);
  rect(300, 360, 180, 240);

  fill(255, 215, 0);
  rect(480, 360, 170, 240);

  fill(255);
  rect(650, 360, 250, 240);

  // zwarte delen die de compositie afbakenen
  fill(0);
  rect(300, 160, 6, 440);
  rect(480, 0, 6, 600);
  rect(650, 0, 6, 600);
  rect(0, 160, 900, 6);
  rect(0, 360, 900, 6);

  // extra witte vlakjes voor het reference-effect
  fill(255);
  rect(300, 0, 6, 160);
  rect(480, 0, 6, 160);
  rect(300, 360, 180, 6);
  rect(650, 360, 250, 6);
}
