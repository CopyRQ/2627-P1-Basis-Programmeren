function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  let x = 100 
  let greeting =  'Hello world!' 
  let a = 20 
  let b = 10 
  let y = 80 
  let optellen
  let aftrekken
  let vermenigvuldigen
  let delen

  optellen = a + b // a + b is output
  aftrekken = a - b // a - b is output
  vermenigvuldigen = a * b // a * b is output
  delen = a / b // a / b is output

  text(x, 20, 20) 
  text(greeting, 20, 60)
  text(optellen, 20, y) 
  y = y + 20
  text(aftrekken, 20, y)
  y = y + 20
  text(vermenigvuldigen, 20, y)
  y = y + 20
  text(delen, 20, y)
}
