let a = 0
let b = 0

function setup() {
  createCanvas(400, 400);
}

function draw() {
  frameRate(10)
  background(220);


  if (keyIsDown(32)){
    a = round(random(100))
    b = round(random(100))
  }

  textSize(32)
  
  if (a < b) {
    text(a + " is kleiner dan " + b, 10, 40)
  } else if (a > b) {
    text(a + " is groter dan " + b, 10, 40)
  } else if (a == b) {
    text(a + " is gelijk aan " + b, 10, 40)
  }

}
