let art = []; // de array die de shapes vast houd

function setup() {

 createCanvas(1878, 956);

};

function draw() {

  background(0);

  let duration = 6000 // how long the shapes stay
  art = art.filter(shapeData => millis() - shapeData.timestamp < duration) 

  generateArt(); // calls generate art

  for (let i = 0; i < art.length; i++){  // puts all the shapes made by generate shapes in an array
    let shapeData = art[i];
    generateShapes(
      shapeData.x, 
      shapeData.y, 
      shapeData.color, 
      shapeData.type,
      shapeData.rotation, 
      shapeData.size,
      shapeData.strokeW,
    )
  };

};

function generateArt () {

  for (let i = 0; i < 2; i++) {
    if (keyIsDown(8)) {
      let randX = floor(random(0, width)); // random pos op het scherm
      let randY = floor(random(0, height));
      let colors = ['#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff','#ffffff',]; 
      let randColor = random(colors); // grabs colors from the colors variable 
      let shapes = ["square", "circle", "triangle", "ellipse"] 
      let randShape = random(shapes); // randomly decides shape
      let randRotation = random(0, TWO_PI); // random rotation
      let randSize = random(50,125); // random size between 50 and 125
      let randStrokeWeight = random(0,18); // random stroke weight

      art.push({ // pushes the variables into the shape generator
         x: randX, 
         y: randY, 
         timestamp: millis(), // the time that the shapes stay alive for
         color: randColor, 
         type: randShape, 
         rotation: randRotation, 
         size: randSize,
         strokeW: randStrokeWeight 
        });
    };
  };

};

function generateShapes (x,y, color, type, rotation, size, strokeW) {

  push();

  translate(x, y);
  rotate(rotation)
  stroke("#333030")
  strokeWeight(strokeW)
  fill(color);

  switch(type){ // switches between the diffrent shapes
    case "circle":
      circle(20,20,size);
      break;
    case "square":
      square(20,20,size);
      break;
    case "triangle":
      triangle(size,0,0,0,size,size);
      break;
    case "ellipse":
    ellipse(20,20,size,size);
    break;
  }
  
  pop(); // so if i had other functions with shape generation it woudnt effect those
  
};