function setup() {
  createCanvas(400, 200);
}

function draw() {
  let score = floor(random(100));

  frameRate(0)
  background(220);
  textSize(32)
  fill(0)
  text(score, 10, 80)

  if (score >= 90) {
    fill("green")
    text("Uitstekend!", 10, 40)
  } else if (score > 70 && score <= 89) {
    fill("yellow")
    text("Goed gedaan!", 10, 40)
  } else if (score > 50 && score <= 69) {
    fill("orange")
    text("Voldoende", 10, 40)
  } else {
    fill("red")
    text("Onvoldoende", 10, 40)
  }

}
