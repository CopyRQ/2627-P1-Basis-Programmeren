let scherm = "start";
let gekozenThema = 0;
let vraagNummer = 0;
let punten = 0;
let tijd = 15;
let tijdOver = tijd;
let antwoordGekozen = false;
let antwoordGoed = false;
let gekozenAntwoord = -1;
let speelVragen = [];
let quizzen = [];
let vraagAnimatie = 0;
let pointerX = 0;
let pointerY = 0;
let tekenSchaal = 1;
let verticaleMarge = 0;
let horizontaleMarge = 0;

function preload() {
  // laad de onderwerpen en vragen uit het json-bestand
  loadJSON("questions.json", function (data) {
    quizzen = Object.values(data);
  });
}

function setup() {
  // houd de gevraagde canvasgrootte aan
  createCanvas(1920, 1080);
  updateDesignScale();
  textAlign(CENTER, CENTER);
  textFont("Arial");
}

function draw() {
  // schaal het ontwerp naar het grote canvas
  updateDesignScale();
  pointerX = (mouseX - horizontaleMarge) / tekenSchaal + 500;
  pointerY = (mouseY - verticaleMarge) / tekenSchaal + 350;
  let thema = scherm === "start" ? null : quizzen[gekozenThema];
  tekenAchtergrond(thema);
  push();
  translate(horizontaleMarge, verticaleMarge);
  scale(tekenSchaal);
  translate(-500, -350);
  if (thema && thema.naam === "Terraria") {
    tekenTerrariaAchtergrond();
  }

  if (scherm === "start") {
    tekenStart();
  } else if (scherm === "quiz") {
    tekenQuiz();
  } else {
    tekenEind();
  }
  pop();
}

function tekenAchtergrond(thema) {
  // gebruik donkere kleuren voor de achtergrond
  let terraria = thema && thema.naam === "Terraria";
  background(scherm === "start" ? "#171b20" : terraria ? "#17221c" : "#171e27");
}

function updateDesignScale() {
  // schaal het ontwerp en zet het midden op het midden van het canvas
  tekenSchaal = min(width / 1000, height / 700);
  horizontaleMarge = width / 2;
  verticaleMarge = height / 2;
}

function tekenTerrariaAchtergrond() {
  // teken een eenvoudige grondlijn bij de terraria-quiz
  noStroke();
  fill("#24352a");
  rect(0, 642, 1000, 58);
  fill("#526b49");
  rect(0, 642, 1000, 8);
}

function tekenStart() {
  // laat de speler een quizonderwerp kiezen
  noStroke();
  fill("#e2e5e0");
  textSize(38);
  text("My game quiz", 500, 132);
  fill("#a3aaa3");
  textSize(18);
  text("Choose a topic", 500, 185);

  for (let i = 0; i < quizzen.length; i++) {
    let card = topicCard(i);
    let hovering = inside(pointerX, pointerY, card);
    let lift = hovering ? -3 : 0;
    let terraria = quizzen[i].naam === "Terraria";

    noStroke();
    fill(terraria ? "#26352c" : "#252f3a");
    rect(card.x, card.y + lift, card.w, card.h, 8);
    fill(hovering ? quizzen[i].accent : terraria ? "#526b49" : "#4a657c");
    rect(card.x, card.y + lift, card.w, 6, 8, 8, 0, 0);

    if (terraria) {
      drawPixelTree(card.x + card.w / 2, card.y + 64 + lift);
    } else {
      drawGamepad(card.x + card.w / 2, card.y + 64 + lift, quizzen[i].accent);
    }

    noStroke();
    fill("#e2e5e0");
    textSize(20);
    text(quizzen[i].naam, card.x + card.w / 2, card.y + 137 + lift);
    fill("#a3aaa3");
    textSize(14);
    text(
      "10 questions · 15 seconds each",
      card.x + card.w / 2,
      card.y + 175 + lift,
    );
  }

  fill("#a3aaa3");
  textSize(14);
  text("Click a topic to start", 500, 595);
}

function topicCard(index) {
  return { x: 130 + index * 390, y: 270, w: 350, h: 230 };
}

function drawGamepad(x, y, accent) {
  push();
  translate(x, y);
  noStroke();
  fill(accent);
  rect(-39, -20, 78, 40, 10);
  fill("#26333a");
  rect(-27, -3, 19, 5, 2);
  rect(-20, -10, 5, 19, 2);
  circle(20, -5, 7);
  circle(29, 5, 7);
  fill("#d5e7ff");
  circle(0, 0, 9);
  pop();
}

function drawPixelTree(x, y) {
  noStroke();
  fill("#8e603e");
  rect(x - 5, y - 5, 10, 25);
  fill("#62ba68");
  rect(x - 20, y - 15, 40, 10);
  rect(x - 15, y - 24, 30, 10);
  rect(x - 10, y - 33, 20, 10);
}

function tekenQuiz() {
  // toon de vraag, de antwoorden en de resterende tijd
  let thema = quizzen[gekozenThema];
  let vraag = speelVragen[vraagNummer];
  let voortgang = constrain(vraagAnimatie, 0, 1);
  vraagAnimatie = min(1, vraagAnimatie + deltaTime / 260);

  noStroke();
  fill("#d8dce0");
  textSize(16);
  text(
    thema.naam +
      "  ·  Question " +
      (vraagNummer + 1) +
      " of " +
      speelVragen.length,
    500,
    42,
  );
  text("Score: " + punten, 895, 42);

  let timerX = 100;
  let timerY = 76;
  let timerW = 800;
  let ratio = constrain(tijdOver / tijd, 0, 1);
  noStroke();
  fill(220, 230, 235, 35);
  rect(timerX, timerY, timerW, 9, 5);
  let timerKleur = lerpColor(color("#607b54"), color("#a8524c"), 1 - ratio);
  fill(timerKleur);
  rect(timerX, timerY, timerW * ratio, 9, 5);

  let panelY = 112 + (1 - voortgang) * 18;
  noStroke();
  fill("#232a30");
  rect(84, panelY, 832, 172, 8);
  fill(thema.accent);
  rect(84, panelY, 832, 6, 8, 8, 0, 0);

  fill("#e1e4e5");
  textSize(24);
  text(vraag.vraag, 120, panelY + 29, 760, 112);

  for (let i = 0; i < vraag.antwoorden.length; i++) {
    drawAnswer(vraag.antwoorden[i], i, voortgang, thema);
  }

  if (!antwoordGekozen) {
    tijdOver = max(0, tijdOver - deltaTime / 1000);
    if (tijdOver === 0) {
      antwoordGekozen = true;
      antwoordGoed = false;
      gekozenAntwoord = -1;
    }
  } else {
    fill(antwoordGoed ? "#79ad78" : "#d27b72");
    textSize(16);
    text(antwoordGoed ? "Correct!" : "Wrong!", 500, 588);
    fill("#b3bbc0");
    textSize(14);
    text(
      vraagNummer < speelVragen.length - 1
        ? "Click anywhere to continue"
        : "Click anywhere to see your result",
      500,
      624,
    );
  }
}

function answerCard(index) {
  return {
    x: 100 + (index % 2) * 410,
    y: 324 + floor(index / 2) * 112,
    w: 390,
    h: 94,
  };
}

function drawAnswer(answer, index, voortgang, thema) {
  let card = answerCard(index);
  let hovering = !antwoordGekozen && inside(pointerX, pointerY, card);
  let stagger = 1 - constrain((voortgang - index * 0.08) / 0.68, 0, 1);
  let y = card.y + stagger * 15 - (hovering ? 5 : 0);
  let backgroundColor = "#252d34";
  let outline = "#424c53";

  if (antwoordGekozen) {
    if (answer.goed) {
      backgroundColor = "#2a402f";
      outline = "#6e9a65";
    } else if (index === gekozenAntwoord) {
      backgroundColor = "#482e2d";
      outline = "#b96960";
    }
  } else if (hovering) {
    backgroundColor = "#303a42";
    outline = thema.accent;
  }

  noStroke();
  fill(backgroundColor);
  rect(card.x, y, card.w, card.h, 7);
  fill(outline);
  rect(card.x, y, 5, card.h, 7, 0, 0, 7);

  noStroke();
  fill("#e1e4e5");
  textAlign(LEFT, CENTER);
  textSize(15);
  text(
    String.fromCharCode(65 + index) + ".  " + answer.tekst,
    card.x + 23,
    y + 12,
    card.w - 38,
    card.h - 24,
  );
  textAlign(CENTER, CENTER);
}

function tekenEind() {
  // vat de score samen en laat opnieuw spelen toe
  let thema = quizzen[gekozenThema];
  let ratio = punten / speelVragen.length;

  noStroke();
  fill("#e2e5e0");
  textSize(34);
  text("Quiz finished", 500, 165);
  textSize(22);
  text(
    "You got " + punten + " out of " + speelVragen.length + " questions right.",
    500,
    235,
  );

  fill(220, 230, 235, 35);
  rect(250, 295, 500, 14, 7);
  fill(thema.accent);
  rect(250, 295, 500 * ratio, 14, 7);

  if (punten >= 6) {
    updateConfetti();
  }

  if (punten >= 6 && confettiStartTime !== null) {
    fill("#b3bbc0");
    textSize(15);
    text("Nice work!", 500, 345);
  }

  let button = { x: 340, y: 405, w: 320, h: 62 };
  let hovering = inside(pointerX, pointerY, button);
  fill(hovering ? thema.accent : "#252d34");
  rect(button.x, button.y, button.w, button.h, 7);
  fill(thema.accent);
  rect(button.x, button.y, button.w, 5, 7, 7, 0, 0);
  noStroke();
  fill("#e2e5e0");
  textSize(17);
  text("Choose another topic", 500, button.y + button.h / 2);

  fill("#a3aaa3");
  textSize(14);
  text("Click to play again", 500, 510);
}

function inside(x, y, rectangle) {
  return (
    x >= rectangle.x &&
    x <= rectangle.x + rectangle.w &&
    y >= rectangle.y &&
    y <= rectangle.y + rectangle.h
  );
}

function mousePressed() {
  // vertaal de muispositie naar de ontwerpmaat van de schermen
  updateDesignScale();
  pointerX = (mouseX - horizontaleMarge) / tekenSchaal + 500;
  pointerY = (mouseY - verticaleMarge) / tekenSchaal + 350;

  if (scherm === "start") {
    for (let i = 0; i < quizzen.length; i++) {
      if (inside(pointerX, pointerY, topicCard(i))) {
        gekozenThema = i;
        startQuiz();
        break;
      }
    }
    return;
  }

  if (scherm === "eind") {
    if (inside(pointerX, pointerY, { x: 340, y: 405, w: 320, h: 62 })) {
      stopConfetti();
      scherm = "start";
    }
    return;
  }

  if (antwoordGekozen) {
    volgendeVraag();
    return;
  }

  let vraag = speelVragen[vraagNummer];
  for (let i = 0; i < vraag.antwoorden.length; i++) {
    if (inside(pointerX, pointerY, answerCard(i))) {
      gekozenAntwoord = i;
      antwoordGekozen = true;
      antwoordGoed = vraag.antwoorden[i].goed;
      if (antwoordGoed) {
        punten++;
      }
      break;
    }
  }
}

function startQuiz() {
  // begin met een nieuwe kopie van de gekozen vragenlijst
  stopConfetti();
  punten = 0;
  vraagNummer = 0;
  antwoordGekozen = false;
  antwoordGoed = false;
  gekozenAntwoord = -1;
  tijdOver = tijd;
  vraagAnimatie = 0;

  let bronVragen = Object.values(quizzen[gekozenThema].vragen);
  speelVragen = bronVragen.map(function (vraag) {
    return {
      vraag: vraag.vraag,
      antwoorden: vraag.antwoorden.map(function (antwoord) {
        return { tekst: antwoord.tekst, goed: antwoord.goed };
      }),
    };
  });

  // schud de antwoorden en de volgorde van de vragen
  for (let i = 0; i < speelVragen.length; i++) {
    shuffle(speelVragen[i].antwoorden, true);
  }
  shuffle(speelVragen, true);
  scherm = "quiz";
}

function volgendeVraag() {
  // ga door of toon de eindscore
  if (vraagNummer < speelVragen.length - 1) {
    vraagNummer++;
    antwoordGekozen = false;
    antwoordGoed = false;
    gekozenAntwoord = -1;
    tijdOver = tijd;
    vraagAnimatie = 0;
  } else {
    scherm = "eind";
    if (punten >= 6) {
      startConfetti();
    }
  }
}
