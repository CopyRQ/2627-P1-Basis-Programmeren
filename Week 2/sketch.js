const SKY = "#aff8f8";
const CANVAS_WIDTH = 1800;
const CANVAS_HEIGHT = 900;
const CLOUD_COUNT = 12;
const CAR_SPEED = 5;
const REVERSE_CAR_SPEED = 4;
const CAR_MIN_GAP = 190;
const BRAKING_ZONE = 220;

// Scene objects and animation state.
let clouds = [];
let sunX = CANVAS_WIDTH / 2;
let sunSpeed = 1;
let cars = [-180, -600, -1020, -1440];
let carColors = ["#d93636", "#2f80ed", "#e0a12b", "#8b5cf6"];
let reverseCars = [1980, 2380, 2780, 3180];
let reverseCarColors = ["#25a18e", "#f06c9b", "#f4d35e", "#6c757d"];
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
  let carStopX = trafficLightX - 180;
  drawTrafficLight(trafficLightX, 520, 0.65);

  // Cycle through red, green, and orange automatically.
  trafficLightTimer++;
  if (trafficLightTimer >= lightDurations[trafficLightState]) {
    trafficLightState = (trafficLightState + 1) % 3;
    trafficLightTimer = 0;

    // Decide which cars can still clear the intersection.
    if (trafficLightState === 2) {
      let framesLeft = lightDurations[2];
      let safeStopDistance = CAR_MIN_GAP;

      for (let i = 0; i < cars.length; i++) {
        let d = carStopX - cars[i];
        if (d <= 20) continue;

        let timeToCross = d / CAR_SPEED;
        let canClearInTime = timeToCross < framesLeft - 5;
        let tooCloseToStop = d < safeStopDistance;

        if (canClearInTime || tooCloseToStop) {
          carCommitted[i] = true;
        }
      }
    }
  }

  for (let i = 0; i < cars.length; i++) {
    let distanceToLight = carStopX - cars[i];
    let lightTargetSpeed = CAR_SPEED;
    let brakingZone = BRAKING_ZONE;

    // Cars already past the light can continue at full speed.
    if (distanceToLight <= -20) {
      lightTargetSpeed = CAR_SPEED;
      carCommitted[i] = false;
    } else if (carCommitted[i]) {
      lightTargetSpeed = CAR_SPEED;
    } else if (trafficLightState === 1) {
      lightTargetSpeed = CAR_SPEED;
    } else {
      if (distanceToLight > brakingZone) {
        lightTargetSpeed = CAR_SPEED;
      } else if (distanceToLight > 0) {
        let t = distanceToLight / brakingZone;
        lightTargetSpeed = CAR_SPEED * t * t;
      } else {
        lightTargetSpeed = 0;
      }
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
      let gap = max(0, (nextCarX - cars[i]) - minGap);
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

    if (nextCarX !== Infinity) {
      cars[i] = min(cars[i], nextCarX - CAR_MIN_GAP);
    }

    if (cars[i] > width + 180) {
      cars[i] = -180 - i * 260;
      carSpeeds[i] = CAR_SPEED;
      carCommitted[i] = false;
    }

    drawCar(cars[i], height * 0.82, carColors[i]);
  }

  for (let i = 0; i < reverseCars.length; i++) {
    // Reverse-lane traffic moves independently of the light.
    reverseCars[i] -= REVERSE_CAR_SPEED;

    if (reverseCars[i] < -180) {
      reverseCars[i] = width + 180 + i * 260;
    }

    drawCar(reverseCars[i], height * 0.91, reverseCarColors[i], -1);
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

function drawCar(x, y, bodyColor, direction = 1) {
  push();
  translate(x, y);
  scale(direction, 1);

  noStroke();
  fill(bodyColor);
  rect(0, 0, 150, 45, 8);
  rect(35, -35, 80, 40, 8);

  fill(120, 210, 225);
  quad(45, -28, 75, -28, 75, -5, 42, -5);
  quad(82, -28, 108, -28, 110, -5, 82, -5);

  fill(25);
  circle(35, 45, 35);
  circle(115, 45, 35);

  fill(170);
  circle(35, 45, 14);
  circle(115, 45, 14);

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