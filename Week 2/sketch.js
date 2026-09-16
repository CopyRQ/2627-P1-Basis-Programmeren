const SKY = '#aff8f8';
const CANVAS_WIDTH = 1800;
const CANVAS_HEIGHT = 900;
const CLOUD_COUNT = 12;
const CAR_SPEED = 8;
const REVERSE_CAR_SPEED = 8;
const CAR_MIN_GAP = 190;
const BRAKING_ZONE = 220;

// Scene objects and animation state.
let clouds = [];
let sunX = CANVAS_WIDTH / 2;
let sunSpeed = 1;
let cars = [-180, -600, -1020, -1440];
let carColors = ['#d93636', '#2f80ed', '#e0a12b', '#8b5cf6'];
let carTypes = ['sedan', 'van', 'sports', 'pickup'];
let reverseCars = [1980, 2380, 2780, 3180];
let reverseCarColors = ['#25a18e', '#f06c9b', '#f4d35e', '#6c757d'];
let reverseCarTypes = ['van', 'sports', 'pickup', 'sedan'];
let reverseCarSpeeds = [REVERSE_CAR_SPEED, REVERSE_CAR_SPEED, REVERSE_CAR_SPEED, REVERSE_CAR_SPEED];
let trafficLightState = 0;
let trafficLightTimer = 0;
let carSpeeds = [CAR_SPEED, CAR_SPEED, CAR_SPEED, CAR_SPEED];
let carCommitted = [false, false, false, false];
let lightDurations = [240, 240, 140]; // Red, green, orange.

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  // Spread the clouds across the sky.
  for (let i = 0; i < CLOUD_COUNT; i++) {
    let x = -400 - i * 500;
    let y = random(-60, 400);
    let speed = random(2.5, 5);

    let tries = 0;
    while (tries < 50) {
      let overlaps = false;

      for (let other of clouds) {
        if (abs(x - other.x) < 350 && abs(y - other.y) < 180) {
          overlaps = true;
          x = -400 - i * 500 - random(100, 300);
          y = random(-60, 400);
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

  // Move the sun between the two sides of the scene.
  sunX += sunSpeed;

  if (sunX > width - 500 || sunX < 500) {
    sunSpeed *= -1;
  }

  drawSun(sunX, 150);
  drawRoad();

  // Clouds sit behind the mountains.
  for (let cloud of clouds) {
    drawCloud(cloud.x, cloud.y, 0.7);

    cloud.x += cloud.speed;

    if (cloud.x > width + 200) {
      cloud.x = -200;
      cloud.y = random(-60, 400);
    }
  }

  drawMountains();
  drawTree(350, 630, 0.7);
  drawTree(1450, 580, 1.2);

  // The car stops 180 pixels before the traffic light.
  let trafficLightX = width - 150;
  let carStopX = trafficLightX - 220;
  drawTrafficLight(trafficLightX, 520, 0.65);

  // Cycle through red, green, and orange automatically.
  trafficLightTimer++;
  if (trafficLightTimer >= lightDurations[trafficLightState]) {
    trafficLightState = (trafficLightState + 1) % 3;
    trafficLightTimer = 0;
  }

  for (let i = 0; i < cars.length; i++) {
    let distanceToLight = carStopX - cars[i];
    let lightTargetSpeed = CAR_SPEED;
    let brakingZone = BRAKING_ZONE;

    if (trafficLightState === 1) {
      // Green: always go.
      lightTargetSpeed = CAR_SPEED;
    } else if (trafficLightState === 2 && distanceToLight <= 20) {
      // Orange, and already at/past the stop line: too late to brake, continue through.
      lightTargetSpeed = CAR_SPEED * 1.25;
    } else if (distanceToLight > brakingZone) {
      // Red (or orange from far away): plenty of room, cruise normally.
      lightTargetSpeed = CAR_SPEED;
    } else if (distanceToLight > 0) {
      // Approaching the line: decelerate smoothly.
      let t = distanceToLight / brakingZone;
      lightTargetSpeed = CAR_SPEED * t * t;
    } else {
      // At or past the line on red: stay stopped, no matter how far momentum carried it.
      lightTargetSpeed = 0;
    }

    let nextCarX = Infinity;
    for (let j = 0; j < cars.length; j++) {
      if (j !== i && cars[j] > cars[i] && cars[j] < nextCarX) {
        nextCarX = cars[j];
      }
    }

    let followTargetSpeed = CAR_SPEED;
    let minGap = CAR_MIN_GAP;
    let followZone = 260;

    // Slow down smoothly when another car is too close ahead.
    if (nextCarX !== Infinity) {
      let gap = max(0, nextCarX - cars[i] - minGap);
      if (gap < followZone) {
        let t = gap / followZone;
        followTargetSpeed = CAR_SPEED * t * t;
      }
    }

    // Use the slower of the light and following-distance speeds.
    let targetSpeed = min(lightTargetSpeed, followTargetSpeed);

    carSpeeds[i] = lerp(carSpeeds[i], targetSpeed, 0.05);
    if (targetSpeed < 0.1 && carSpeeds[i] < 0.15) {
      carSpeeds[i] = 0;
    }

    cars[i] += carSpeeds[i];

    if (cars[i] > width + 180) {
      cars[i] = -180 - i * 260;
      carSpeeds[i] = CAR_SPEED;
      carCommitted[i] = false;
    }

    drawCar(cars[i], height * 0.82, carColors[i], 1, carTypes[i]);
  }

  for (let i = 0; i < reverseCars.length; i++) {
    let nextReverseCarX = -Infinity;
    for (let j = 0; j < reverseCars.length; j++) {
      if (j !== i && reverseCars[j] < reverseCars[i] && reverseCars[j] > nextReverseCarX) {
        nextReverseCarX = reverseCars[j];
      }
    }

    let followTargetSpeed = REVERSE_CAR_SPEED;
    let minGap = CAR_MIN_GAP;
    let followZone = 260;

    // Slow down smoothly when another car is too close ahead.
    if (nextReverseCarX !== -Infinity) {
      let gap = max(0, reverseCars[i] - nextReverseCarX - minGap);
      if (gap < followZone) {
        let t = gap / followZone;
        followTargetSpeed = REVERSE_CAR_SPEED * t * t;
      }
    }

    let targetSpeed = followTargetSpeed;

    reverseCarSpeeds[i] = lerp(reverseCarSpeeds[i], targetSpeed, 0.05);
    if (targetSpeed < 0.1 && reverseCarSpeeds[i] < 0.15) {
      reverseCarSpeeds[i] = 0;
    }

    reverseCars[i] -= reverseCarSpeeds[i];

    if (reverseCars[i] < -180) {
      reverseCars[i] = width + 180 + i * 260;
      reverseCarSpeeds[i] = REVERSE_CAR_SPEED;
    }

    drawCar(reverseCars[i], height * 0.91, reverseCarColors[i], -1, reverseCarTypes[i]);
  }

  drawTree(1100, 800, 1.0);
}

function drawCloud(x, y, size) {
  noStroke();
  push();

  translate(x, y);
  scale(size);

  fill(210, 220, 225);
  ellipse(0, 20, 250, 70);

  fill(255);
  ellipse(-70, 0, 100, 80);
  ellipse(0, -20, 120, 100);
  ellipse(70, 0, 100, 80);
  ellipse(0, 20, 250, 60);

  pop();
}

function drawSun(x, y) {
  push();
  translate(x, y);

  let rayLength = 100 + sin(frameCount * 0.05) * 10;
  let diagonalRayLength = rayLength * 0.7;

  fill(255, 220, 0);
  circle(0, 0, 100);

  stroke(255, 220, 0);
  strokeWeight(8);

  line(0, -70, 0, -rayLength);
  line(0, 70, 0, rayLength);
  line(-70, 0, -rayLength, 0);
  line(70, 0, rayLength, 0);

  line(-50, -50, -diagonalRayLength, -diagonalRayLength);
  line(50, -50, diagonalRayLength, -diagonalRayLength);
  line(-50, 50, -diagonalRayLength, diagonalRayLength);
  line(50, 50, diagonalRayLength, diagonalRayLength);

  pop();
}

function drawRoad() {
  let roadTop = height * 0.78;
  let roadBottom = height;
  let roadMiddle = (roadTop + roadBottom) / 2;

  noStroke();
  fill(90, 180, 80);
  rect(0, roadTop - 20, width, roadBottom - roadTop + 20);

  fill(65);
  rect(0, roadTop, width, roadBottom - roadTop);

  stroke(255, 220, 80);
  strokeWeight(8);
  line(0, roadTop + 25, width, roadTop + 25);
  line(0, height - 25, width, height - 25);

  stroke(255);
  strokeWeight(6);
  for (let x = 0; x < width; x += 100) {
    line(x, roadMiddle, x + 55, roadMiddle);
  }
}

function drawTrafficLight(x, y, size) {
  push();
  translate(x, y);
  scale(size);

  stroke(35);
  strokeWeight(8);
  line(0, 70, 0, (height * 0.78 - y) / size);

  fill(35);
  rect(-45, -80, 90, 160, 12);

  noStroke();
  fill(trafficLightState === 0 ? 255 : 70, 40, 40);
  circle(0, -40, 35);

  fill(trafficLightState === 2 ? 255 : 90, trafficLightState === 2 ? 150 : 80, 30);
  circle(0, 0, 35);

  fill(trafficLightState === 1 ? 50 : 40, trafficLightState === 1 ? 220 : 100, 70);
  circle(0, 40, 35);

  pop();
}

function drawCar(x, y, bodyColor, direction = 1, type = 'sedan') {
  push();
  translate(x, y);
  scale(direction, 1);

  // subtle body shadow for depth
  noStroke();
  fill(0, 0, 0, 25);
  rect(2, 3, 150, 45, 8);

  fill(bodyColor);
  rect(0, 0, 150, 45, 8);

  // soft highlight along the top edge of the body
  fill(255, 255, 255, 35);
  rect(6, 3, 138, 8, 4);

  if (type === 'van') {
    fill(bodyColor);
    rect(20, -48, 110, 53, 8);
    fill(120, 210, 225);
    rect(32, -40, 35, 25, 4);
    rect(73, -40, 42, 25, 4);
    stroke(0, 0, 0, 60);
    strokeWeight(1.5);
    line(52.5, -40, 52.5, -15);
    noStroke();
  } else if (type === 'sports') {
    fill(bodyColor);
    quad(25, 0, 42, -30, 105, -30, 130, 0);
    fill(120, 210, 225);
    quad(48, -25, 72, -25, 68, -7, 42, -7);
    quad(78, -25, 100, -25, 111, -7, 76, -7);
  } else if (type === 'pickup') {
    fill(bodyColor);
    rect(5, -25, 72, 25, 4);
    rect(82, -38, 43, 38, 7);
    fill(120, 210, 225);
    quad(88, -31, 102, -31, 102, -8, 85, -8);
    quad(106, -31, 119, -31, 122, -8, 106, -8);
  } else {
    fill(bodyColor);
    rect(35, -35, 80, 40, 8);
    fill(120, 210, 225);
    quad(45, -28, 75, -28, 75, -5, 42, -5);
    quad(82, -28, 108, -28, 110, -5, 82, -5);
    stroke(0, 0, 0, 60);
    strokeWeight(1.5);
    line(78.5, -28, 78.5, -5);
    noStroke();
  }

  // headlight and taillight
  fill(255, 250, 210);
  ellipse(145, 8, 8, 10);
  fill(200, 40, 40);
  ellipse(5, 8, 6, 9);

  // bumper strip
  fill(180);
  rect(0, 38, 150, 5, 3);

  // wheels with rims
  fill(25);
  circle(35, 45, 35);
  circle(115, 45, 35);

  fill(170);
  circle(35, 45, 14);
  circle(115, 45, 14);

  fill(120);
  circle(35, 45, 5);
  circle(115, 45, 5);

  stroke(220);
  strokeWeight(2);
  let wheelAngle = x * 0.12;
  for (let wheelX of [35, 115]) {
    push();
    translate(wheelX, 45);
    rotate(wheelAngle);
    line(-8, 0, 8, 0);
    line(0, -8, 0, 8);
    pop();
  }

  pop();
}

function keyPressed() {
  if (keyCode === ENTER) {
    trafficLightState = (trafficLightState + 1) % 3;
    trafficLightTimer = 0;
  }
}

function drawMountains() {
  let mountainBase = height * 0.78 - 20;

  noStroke();

  fill(120, 150, 170);
  triangle(0, mountainBase, 300, 451, 650, mountainBase);
  triangle(400, mountainBase, 760, 421, 1100, mountainBase);
  triangle(900, mountainBase, 1250, 481, 1600, mountainBase);
  triangle(1350, mountainBase, 1600, 441, width, mountainBase);

  fill(155, 180, 190);
  triangle(120, mountainBase, 300, 451, 390, mountainBase);
  triangle(585, mountainBase, 760, 421, 850, mountainBase);
  triangle(1120, mountainBase, 1250, 481, 1360, mountainBase);
}

function drawTree(x, y, size) {
  push();
  translate(x, y);
  scale(size);

  noStroke();
  fill(110, 70, 40);
  rect(-18, 0, 36, 100);

  fill(45, 135, 65);
  circle(0, -55, 130);
  circle(-45, -15, 100);
  circle(45, -15, 100);

  pop();
}
