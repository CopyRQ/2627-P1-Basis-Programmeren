// array om alle vormen in op te slaan
let art = [];

function setup() {
  createCanvas(1920, 1080);
  // zet het middelpunt van rechthoeken centraal
  rectMode(CENTER);
}

function draw() {
  background(0);

  generateArt();

  // loop door alle bestaande vormen
  for (let i = 0; i < art.length; i++) {
    let shapeData = art[i];

    // pas de positie aan op basis van de snelheid
    shapeData.x += shapeData.vx;
    shapeData.y += shapeData.vy;

    // vertraag de snelheid door wrijving
    shapeData.vx *= shapeData.friction;
    shapeData.vy *= shapeData.friction;

    let radius = shapeData.size / 2;

    // botsing met de linker- en rechterkant van het scherm
    if (shapeData.x - radius < 0) {
      shapeData.x = radius;
      shapeData.vx *= -1;
    } else if (shapeData.x + radius > width) {
      shapeData.x = width - radius;
      shapeData.vx *= -1;
    }

    // botsing met de boven- en onderkant van het scherm
    if (shapeData.y - radius < 0) {
      shapeData.y = radius;
      shapeData.vy *= -1;
    } else if (shapeData.y + radius > height) {
      shapeData.y = height - radius;
      shapeData.vy *= -1;
    }

    // bereken het kloppende effect
    let pulseFactor = 1 + sin(frameCount * shapeData.pulseSpeed + shapeData.pulseOffset) * 0.3;

    // bereken de afstand tot de muis
    let d = dist(mouseX, mouseY, shapeData.x, shapeData.y);
    let mouseRadius = 100;
    let hoverScale = 1;
    let pushPower = 3;

    // duw de vorm weg als de muis dichtbij is
    if (d < mouseRadius && d > 0) {
      let force = (mouseRadius - d) / mouseRadius;
      let angle = atan2(shapeData.y - mouseY, shapeData.x - mouseX);

      shapeData.vx += cos(angle) * force * pushPower;
      shapeData.vy += sin(angle) * force * pushPower;

      // maak de vorm iets groter bij hover
      hoverScale = 1 + force * 0.3;
    }

    // bereken de uiteindelijke grootte van de vorm
    let currentSize = shapeData.size * pulseFactor * hoverScale;

    // teken de vorm op het scherm
    generateShapes(
      shapeData.x,
      shapeData.y,
      shapeData.color,
      shapeData.type,
      shapeData.rotation,
      currentSize,
      shapeData.strokeW
    );
  }
}

// schokgolf bij het klikken van de muis
function mouseClicked() {
  let shockwaveRadius = 500;
  let shockwavePower = 35;

  for (let i = 0; i < art.length; i++) {
    let shapeData = art[i];
    let d = dist(mouseX, mouseY, shapeData.x, shapeData.y);

    // duw vormen weg die binnen de schokgolf vallen
    if (d < shockwaveRadius && d > 0) {
      let angle = atan2(shapeData.y - mouseY, shapeData.x - mouseX);
      let force = (1 - d / shockwaveRadius) * shockwavePower;

      shapeData.vx += cos(angle) * force;
      shapeData.vy += sin(angle) * force;
    }
  }
}

// genereer nieuwe vormen
function generateArt() {
  for (let i = 0; i < 5; i++) {
    // controleer of de backspace toets is ingedrukt
    if (keyIsDown(8)) {
      let randX = floor(random(0, width));
      let randY = floor(random(0, height));
      let colors = [
        "#FF0000", "#FF7F00", "#FFFF00", "#00FF00",
        "#0000FF", "#4B0082", "#ff00ea", "#00e1ff"
      ];
      let randColor = random(colors);
      let shapes = ["square", "circle", "triangle", "ellipse", "heart"];
      let randShape = random(shapes);
      let randRotation = random(0, TWO_PI);
      let randSize = random(50, 125);
      let randStrokeWeight = random(0, 24);

      // voeg de nieuwe vorm toe aan de array
      art.push({
        x: randX,
        y: randY,
        vx: 0,
        vy: 0,
        friction: 0.95,
        timestamp: millis(),
        color: randColor,
        type: randShape,
        rotation: randRotation,
        size: randSize,
        strokeW: randStrokeWeight,
        pulseSpeed: random(0.02, 0.05),
        pulseOffset: random(0, TWO_PI)
      });
    }
  }
}

// teken een specifieke vorm
function generateShapes(x, y, color, type, rotation, size, strokeW) {
  push();

  // verplaats en draai het assenstelsel
  translate(x, y);
  rotate(rotation);
  stroke(color);
  strokeWeight(strokeW);
  fill(color);

  // kies het juiste type vorm om te tekenen
  switch (type) {
    case "circle":
      circle(0, 0, size);
      break;
    case "square":
      square(0, 0, size);
      break;
    case "triangle":
      let h = (sqrt(3) / 2) * size;
      triangle(
        0, -(2 / 3) * h,
        -size / 2, (1 / 3) * h,
        size / 2, (1 / 3) * h
      );
      break;
    case "ellipse":
      ellipse(0, 0, size, size / 2);
      break;
    case "heart":
      beginShape();
      vertex(0, 0);
      bezierVertex(-size / 2, -size / 2, -size, size / 3, 0, size);
      bezierVertex(size, size / 3, size / 2, -size / 2, 0, 0);
      endShape(CLOSE);
      break;
  }

  pop();
}