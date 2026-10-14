let confetti = [];
let confettiStartTime = null;

function startConfetti() {
  // begin met een lege verzameling confetti
  confetti = [];
  confettiStartTime = millis();
}

function stopConfetti() {
  // ruim de confetti op als het effect klaar is
  confetti = [];
  confettiStartTime = null;
}

function updateConfetti() {
  if (confettiStartTime === null && confetti.length === 0) {
    return;
  }

  if (confettiStartTime !== null && millis() - confettiStartTime < 10000) {
    for (let i = 0; i < 6; i++) {
      confetti.push({
        x: random(1000),
        y: random(-50, -10),
        size: random(8, 16),
        speedY: random(2, 6),
        speedX: random(-2, 2),
        rotation: random(TWO_PI),
        rotationSpeed: random(-0.1, 0.1),
        color: random([
          '#ff0000',
          '#00ff00',
          '#0000ff',
          '#ffff00',
          '#ff00ff',
          '#00ffff',
          '#ffffff',
        ]),
      });
    }
  } else {
    // stop met nieuwe confetti, maar laat de bestaande stukjes uitregenen
    confettiStartTime = null;
  }

  // beweeg en teken alle confettistukjes
  for (let i = confetti.length - 1; i >= 0; i--) {
    let piece = confetti[i];

    piece.x += piece.speedX;
    piece.y += piece.speedY;
    piece.rotation += piece.rotationSpeed;

    push();
    translate(piece.x, piece.y);
    rotate(piece.rotation);

    fill(piece.color);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, piece.size, piece.size * 0.6);

    pop();

    // verwijder confetti die onder het canvas valt
    if (piece.y > 750) {
      confetti.splice(i, 1);
    }
  }
}