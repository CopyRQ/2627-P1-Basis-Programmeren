function setup() {
  createCanvas(1200, 950);
}

function draw() {
  background(220);

  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      fill("#fce300")
      ellipse(i * 50 + 25, j * 50 + 25, 40, 40);
      fill(255)
      square(i * 50 + 15, j * 50 + 15, 20)
      fill(0)
      text("0" - 0 + 1 * 1 + j + i, i * 50 + 21, j * 50 + 29)
    }
  }

}
