function setup() {
  createCanvas(800, 400);
}

function draw() {
  background(220);

  // huizen tekenen
  tekenHuis(80, 80, 120, {
    roof: '#461f1f',
    wall: '#772e2e',
    window: color(192, 186, 186, 180),
    door: '#945e21'
  });

  tekenHuis(260, 50, 200, {
    roof: '#1e293b',
    wall: '#3b82f6',
    window: color(224, 242, 254, 200),
    door: '#0f172a'
  });

  tekenHuis(540, 110, 150, {
    roof: '#14532d',
    wall: '#15803d',
    window: color(254, 240, 138, 200),
    door: '#78350f'
  });

  // vormen en tekst tekenen
  tekenCirkel(550, 40, 25);
  tekenRechthoek(700, 20, 60, 30);
  tekenLijn(520, 90, 760, 90);
  tekenTekst("Parameters demo", 520, 100, 16, "#333");

  // rekenen met return
  let som = optellen(12, 8);
  let deling = delen(50, 2);
  let product = vermenigvuldigen(4, 6);
  let versch = aftrekken(20, 7);

  // uitslag op het scherm tonen
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text("Return waarden:", 520, 280);
  text(`Optellen (12 + 8) = ${som}`, 520, 300);
  text(`Delen (50 / 2) = ${deling}`, 520, 320);
  text(`Vermenigvuldigen (4 * 6) = ${product}`, 520, 340);
  text(`Aftrekken (20 - 7) = ${versch}`, 520, 360);
}

// functie om een huis te tekenen
function tekenHuis(x, y, groote, kleuren) {
  push();
  translate(x, y);

  // standaard kleuren
  let roofCol = kleuren?.roof || '#461f1f';
  let wallCol = kleuren?.wall || '#772e2e';
  let windowCol = kleuren?.window || color(192, 186, 186, 150);
  let doorCol = kleuren?.door || '#945e21';

  // dak
  fill(roofCol);
  noStroke();
  triangle(
    groote * 0.5, 0,
    groote, groote * 0.4,
    0, groote * 0.4
  );

  // muur
  fill(wallCol);
  rect(0, groote * 0.4, groote, groote * 0.6);

  // ramen
  fill(windowCol);
  let windowSize = groote * 0.18;
  
  square(groote * 0.12, groote * 0.5, windowSize);
  square(groote * 0.7, groote * 0.5, windowSize);
  square(groote * 0.41, groote * 0.18, windowSize);

  // deur
  fill(doorCol);
  rect(
    groote * 0.4, groote * 0.65,
    groote * 0.2, groote * 0.35
  );

  pop();
}

// functie om een cirkel te tekenen
function tekenCirkel(x, y, straal) {
  fill('#0284c7');
  stroke(0);
  strokeWeight(2);
  circle(x, y, straal * 2);
}

// functie om een rechthoek te tekenen
function tekenRechthoek(x, y, breedte, hoogte) {
  fill('#f59e0b');
  stroke(0);
  strokeWeight(2);
  rect(x, y, breedte, hoogte);
}

// functie om een lijn te tekenen
function tekenLijn(x1, y1, x2, y2) {
  stroke('#e11d48');
  strokeWeight(3);
  line(x1, y1, x2, y2);
}

// functie om tekst te tekenen
function tekenTekst(inhoud, x, y, grootte, kleur) {
  noStroke();
  fill(kleur);
  textSize(grootte);
  textAlign(LEFT, TOP);
  text(inhoud, x, y);
}

// twee getallen optellen
function optellen(a, b) {
  return a + b;
}

// twee getallen delen
function delen(a, b) {
  if (b === 0) return 0;
  return a / b;
}

// twee getallen vermenigvuldigen
function vermenigvuldigen(a, b) {
  return a * b;
}

// twee getallen aftrekken
function aftrekken(a, b) {
  return a - b;
}