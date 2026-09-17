let spatie = 0;
let StopLightState = 'rood';
let enterCooldown = 0;
let x = 100;
let y = 380;
let xt = 110;
let yt = 371;

function setup() {
  createCanvas(800, 500);
}

function draw() {
  textSize(12);
  frameRate(60);
  fill(0);
  background(220);

  text('Houd B in om een blokje te laten verschijnen', 20, 20);

  if (keyIsDown(66) === true) {
    square(20, 40, 60);
  }

  text('Druk op spatie om het getal op 0 te zetten', 20, 120);

  if (keyIsDown(32) === true) {
    spatie = -1;
  }

  spatie += 1;
  if (spatie > 500) {
    spatie = 0;
  }

  text(spatie, 20, 140);

  text('Druk op enter om van rood -> groen -> oranje te gaan', 20, 240);

  if (enterCooldown > 0) {
    enterCooldown -= 1;
  }

  if (keyIsDown(13) && enterCooldown === 0) {
    if (StopLightState === 'rood') {
      StopLightState = 'groen';
    } else if (StopLightState === 'groen') {
      StopLightState = 'oranje';
    } else if (StopLightState === 'oranje') {
      StopLightState = 'rood';
    }
    enterCooldown = 10;
  }

  fill(40);
  rect(20, 260, 100, 200);

  fill(80);
  circle(70, 300, 50);
  circle(70, 360, 50);
  circle(70, 420, 50);

  if (StopLightState === 'rood') {
    fill('red');
    circle(70, 300, 50);
  } else if (StopLightState === 'groen') {
    fill('green');
    circle(70, 420, 50);
  } else if (StopLightState === 'oranje') {
    fill('orange');
    circle(70, 360, 50);
  }

  fill(0);
  text('Beweeg de eightball met WASD of de pijltjestoetsen', 360, 20);

  if (keyIsDown(87)) {
    x += -2;
    xt += -2;
  }
  if (keyIsDown(83)) {
    x += 2;
    xt += 2;
  }
  if (keyIsDown(65)) {
    y += -2;
    yt += -2;
  }
  if (keyIsDown(68)) {
    y += 2;
    yt += 2;
  }

  circle(y, x, 60);
  fill(255);
  circle(y, x, 40);
  fill(0);
  textSize(32);
  text('8', yt, xt);
  
}
