const SKY = "#aff8f8";

// The sun moves left and right between two bounds, like a floating animation.
let clouds = [];
let sunX = 900;
let sunSpeed = 1;

function setup() {
  createCanvas(1800, 900);

  // Create clouds with a large horizontal gap so they don't start on top of each other.
  // They can still overlap later if one cloud is faster than another.
  for (let i = 0; i < 12; i++) {
    let x = -400 - i * 500;
    let y = random(100, 500);
    let speed = random(4, 10);

    // Keep trying until this cloud is far enough away from earlier clouds.
    let tries = 0;
    while (tries < 50) {
      let overlaps = false;

      for (let other of clouds) {
        if (abs(x - other.x) < 350 && abs(y - other.y) < 180) {
          overlaps = true;
          x = -400 - i * 500 - random(100, 300);
          y = random(100, 500);
          break;
        }
      }

      if (!overlaps) {
        break;
      }

      tries++;
    }

    clouds.push({ x, y, speed });
  }
}

function draw() { 
  background(SKY);

  // Sun movement: move the sun, then reverse direction when it hits the edge.
  sunX += sunSpeed;

  if (sunX > width - 500 || sunX < 500) {
    sunSpeed *= -1;
  }

  drawSun(sunX, 150, 1);

  // Update each cloud: draw it, then move it forward by its own speed.
  for (let cloud of clouds) {
    drawCloud(cloud.x, cloud.y, 1);

    cloud.x += cloud.speed;

    // If the cloud goes past the right edge, send it back to the left.
    // We randomize the Y position so the clouds are not all lined up.
    if (cloud.x > width + 200) {
      cloud.x = -200;
      cloud.y = random(100, 500);
    }
  }
}

function drawCloud(x, y, size) {
  noStroke();
  push();

  // translate() moves the whole cloud to its position on the canvas.
  // scale() makes the cloud bigger or smaller without changing its shape.
  translate(x, y);
  scale(size);

  // Shadowy underside to make the cloud look a bit softer and deeper.
  fill(210, 220, 225);
  ellipse(0, 20, 250, 70);

  // Main cloud body: three circles with a flat bottom make a fluffy cloud.
  fill(255);
  ellipse(-70, 0, 100, 80);
  ellipse(0, -20, 120, 100);
  ellipse(70, 0, 100, 80);
  ellipse(0, 20, 250, 60);

  pop();
}

function drawSun(x, y, size) {
  push();
  translate(x, y);
  scale(size);

  // Sun center.
  fill(255, 220, 0);
  circle(0, 0, 100);

  // Sun rays: lines going out in 8 directions.
  stroke(255, 220, 0);
  strokeWeight(8);

  line(0, -70, 0, -100);
  line(0, 70, 0, 100);
  line(-70, 0, -100, 0);
  line(70, 0, 100, 0);

  line(-50, -50, -75, -75);
  line(50, -50, 75, -75);
  line(-50, 50, -75, 75);
  line(50, 50, 75, 75);

  pop();
}