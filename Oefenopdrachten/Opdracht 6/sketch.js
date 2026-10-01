function setup() {
  createCanvas(380, 350);
  noLoop(); // Zorgt ervoor dat draw() maar 1 keer draait en niet blijft herhalen
}

function draw() {
  background(220);

  let colors = ["red", "green", "blue", "purple", "yellow"];

  let getallen4 = [400, 240, 10, 490, 30, 60, 244, 500, 301, 300];

  let regelTeller = 0;

  let arrayA = [3, 55, 93, 20, 102, 6];
  let arrayB = [14, 22, 80, 5];
  let totaalSom = 0;

  let woord = "Overheidsfinancieringstekort.";
  let eAantal = 0;

  let alpha = ["red", "green", "blue", "purple", "yellow"];

  let randomKleuren = [];

  let willekeurigeGetallen = [];
  let totaal = 0;

  fill(0);
  text("1", 20, 15);

  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    text(colors[i], 20, 27 + i * 12);
  }

  fill(0);
  text("2", 20, 100);

  let eersteKleur = colors.shift();
  colors.push(eersteKleur);

  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    text(colors[i], 20, 112 + i * 12);
  }

  fill(0);
  text("3", 20, 190);

  colors.splice(1, 2);

  for (let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    text(colors[i], 20, 202 + i * 12);
  }

  fill(0);
  text("4", 20, 250);

  for (let i = 0; i < getallen4.length; i++) {
    if (getallen4[i] < 300) {
      text(getallen4[i], 20, 262 + regelTeller * 12);
      regelTeller++;
    }
  }

  fill(0);
  text("5", 120, 15);

  for (let i = 0; i < arrayA.length; i++) {
    totaalSom += arrayA[i];
  }

  for (let i = 0; i < arrayB.length; i++) {
    totaalSom += arrayB[i];
  }

  text("Totaal: " + totaalSom, 120, 27);

  fill(0);
  text("6", 120, 100);

  for (let i = 0; i < woord.length; i++) {
    if (woord[i] === "e") {
      eAantal++;
    }
  }

  text("Aantal 'e': " + eAantal, 120, 112);

  fill(0);
  text("7", 120, 190);

  alpha.sort();

  for (let i = 0; i < alpha.length; i++) {
    fill(alpha[i]);
    text(alpha[i], 120, 202 + i * 12);
  }

  fill(0);
  text("8", 120, 280);

  for (let i = 0; i < 5; i++) {
    randomKleuren.push(color(random(255), random(255), random(255)));
  }

  for (let i = 0; i < randomKleuren.length; i++) {
    fill(randomKleuren[i]);
    noStroke();
    rect(120 + i * 15, 292, 12, 12);
  }

  fill(0);
  text("9", 240, 15);

  for (let i = 0; i < 12; i++) {
    let g = round(random(0, 100));
    willekeurigeGetallen.push(g);
    totaal += g;

    text(g, 240, 27 + i * 12);
  }

  let gemiddelde = round(totaal / willekeurigeGetallen.length);

  text("Totaal: " + totaal, 240, 27 + 12 * 12);
  text("Gemiddelde: " + gemiddelde, 240, 27 + 13 * 12);
}
