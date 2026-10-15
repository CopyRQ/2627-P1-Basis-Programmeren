let needs = {
  hunger: 0,
  energy: 100,
  happy: 100,
  health: 100,
};
let isSleeping = false;
let lastUpdatedAt = Date.now();
let nextNeedAt = {};
let sprites = {};
let animations = {};
let pet = {
  x: 330,
  y: 310,
  targetX: null,
  targetY: null,
  direction: "down",
  sleepRequested: false,
  nextRoamAt: 0,
  nextLaughAt: 0,
  laughUntil: 0,
  laughStartedAt: 0,
  lastMovedAt: Date.now(),
  lastSavedAt: Date.now(),
};
let actionButtons = [];
const actionButtonX = 18;
const actionButtonY = 150;
const actionButtonWidth = 126;
const actionButtonHeight = 48;
const actionButtonGap = 70;
const MAX_OFFLINE_MS = 24 * 60 * 60 * 1000;
const SLEEP_ENERGY_GAIN = 5;
const SLEEP_ENERGY_DELAY = { min: 1000, max: 1200 };
const SLEEP_HEALTH_DELAY = { min: 6000, max: 8000 };
const PET_WALK_SPEED = 55;
const SPRITE_ASSETS = {
  room: "Locations/Castle Town/Interiors/Ch2/Ralsei_s Castle/Ch2/bg_dw_susie_room_1_0.png",
  susie: "Characters/Playable Characters/Susie/Ch1/Dark World/Overworld/spr_susiedt_dark_0.png",
  hurtSusie: "Characters/Playable Characters/Susie/Ch1/Dark World/Battle/spr_susieb_hurt_0.png",
  bedSleepingSusie:
    "Characters/Playable Characters/Susie/Ch5/Dark World/Cutscenes/Castle Town (Credits)/spr_susie_sleep_0.png",
  hunger: "UI/HUD/Ch3/spr_shop_item_icon_0.png",
  energy: "UI/Battle/Icons/Ch1/spr_sparestar_0.png",
  happiness: "UI/Battle/Icons/Ch1/spr_headsusie_0.png",
  health: "UI/Battle/Soul/Ch1/spr_heart_0.png",
  cleaning: "Misc/Effects/Ch5/spr_splash_0.png",
  statsLabel: "UI/HUD/Ch1/spr_dmenu_captions_4.png",
  feedLabel: "Action Labels/feed.svg",
  playLabel: "Action Labels/play.svg",
  cleanLabel: "Action Labels/clean.svg",
  sleepLabel: "Action Labels/sleep.svg",
  sleepingLabel: "Action Labels/sleeping.svg",
};
const ANIMATION_CONFIG = {
  walk: {
    folder: "Characters/Playable Characters/Susie/Ch1/Dark World/Walk",
    prefixes: {
      down: "spr_susied_dark",
      left: "spr_susiel_dark",
      right: "spr_susier_dark",
      up: "spr_susieu_dark",
    },
    frameCount: 4,
    frameDuration: 160,
  },
  laugh: {
    folder:
      "Characters/Playable Characters/Susie/Ch1/Dark World/Overworld/Laugh",
    prefixes: {
      left: "spr_susiel_dark_laugh",
      right: "spr_susier_dark_laugh",
    },
    frameCount: 2,
    frameDuration: 220,
    duration: 1400,
    initialDelay: { min: 5000, max: 12000 },
    interval: { min: 8000, max: 16000 },
  },
};
const PET_SPRITE_RULES = {
  hurtHealthAtOrBelow: 25,
  happyAtOrAbove: 75,
};
const STAT_SPRITE_ROWS = [
  { need: "hunger", sprite: "hunger" },
  { need: "energy", sprite: "energy" },
  { need: "happy", sprite: "happiness" },
  { need: "health", sprite: "health" },
];
const NEED_TIMERS = {
  hunger: { min: 8000, max: 12000, change: 1, message: "I'm starving" },
  energy: { min: 18000, max: 22000, change: -1, message: "I'm tired" },
  happy: { min: 25000, max: 35000, change: -1, message: "I'm sad" },
  health: { min: 50000, max: 70000, change: -1, message: "I'm sick" },
};

function preload() {
  sprites = Object.fromEntries(
    Object.entries(SPRITE_ASSETS).map(([name, path]) => [name, loadImage(path)])
  );
  animations = Object.fromEntries(
    Object.entries(ANIMATION_CONFIG).map(([name, config]) => [
      name,
      Object.fromEntries(
        Object.entries(config.prefixes).map(([direction, prefix]) => [
          direction,
          loadAnimationFrames(config.folder, prefix, config.frameCount),
        ])
      ),
    ])
  );
}

function setup() {
  createCanvas(640, 480);
  frameRate(60);
  noSmooth();
  loadGameState();
  updateGame(Date.now());

  actionButtons = [
    { icon: sprites.hunger, label: sprites.feedLabel, action: feed },
    { icon: sprites.happiness, label: sprites.playLabel, action: play },
    { icon: sprites.health, label: sprites.cleanLabel, action: clean },
    { icon: sprites.energy, label: sprites.sleepLabel, action: sleep },
  ];
  pet.lastMovedAt = Date.now();
  pet.lastSavedAt = Date.now();
  const { min, max } = ANIMATION_CONFIG.laugh.initialDelay;
  pet.nextLaughAt = Date.now() + randomBetween(min, max);
  pet.laughUntil = 0;
  saveGameState();
}

function loadAnimationFrames(folder, prefix, frameCount) {
  return Array.from({ length: frameCount }, (_, frame) =>
    loadImage(`${folder}/${prefix}_${frame}.png`)
  );
}

function changeNeed(need, amount) {
  needs[need] = Math.max(0, Math.min(100, needs[need] + amount));
  if (need === "energy" && isSleeping && needs.energy === 100) {
    finishSleep(Date.now());
  }
  console.log(`${need}: ${needs[need]}`);
  saveGameState();
}

function feed() {
  if (needs.hunger === 0) {
    changeNeed("health", -10);
    console.log("Overfeeding lowers her health");
    return;
  }
  changeNeed("hunger", -20);
}

function play() {
  changeNeed("happy", 20);
  changeNeed("energy", -10);
  changeNeed("hunger", 20);
}

function clean() {
  changeNeed("health", 20);
}

function sleep() {
  if (isSleeping) {
    finishSleep(Date.now());
    return;
  }
  if (needs.energy === 100) {
    console.log("Susie has enough energy and cannot sleep yet.");
    return;
  }

  pet.sleepRequested = true;
  setPetTarget(238, 270, true);
  saveGameState(Date.now());
}

function draw() {
  const now = Date.now();
  updateGame(now);
  updatePet(now);
  image(sprites.room, 0, 0, width, height);
  drawPet();
  drawStats();
  drawActions();
}

function updateGame(now) {
  if (now < lastUpdatedAt) {
    lastUpdatedAt = now;
    for (const need of Object.keys(NEED_TIMERS)) {
      nextNeedAt[need] = now + randomNeedDelay(need);
    }
    saveGameState(now);
    return;
  }

  const endAt = Math.min(now, lastUpdatedAt + MAX_OFFLINE_MS);
  let stateChanged = false;

  while (true) {
    let dueNeed = null;
    let dueAt = Infinity;
    for (const need of Object.keys(NEED_TIMERS)) {
      if (nextNeedAt[need] <= endAt && nextNeedAt[need] < dueAt) {
        dueNeed = need;
        dueAt = nextNeedAt[need];
      }
    }

    if (dueNeed === null) {
      break;
    }

    const timer = NEED_TIMERS[dueNeed];
    const change = getNeedChange(dueNeed);
    const previousValue = needs[dueNeed];
    needs[dueNeed] = Math.max(0, Math.min(100, previousValue + change));

    if (needs[dueNeed] !== previousValue) {
      stateChanged = true;
      console.log(`${dueNeed}: ${needs[dueNeed]}`);

      if (
        change === timer.change &&
        needs[dueNeed] === (timer.change > 0 ? 100 : 0)
      ) {
        console.log(timer.message);
      }
    }
    stateChanged = true;

    if (dueNeed === "energy" && isSleeping && needs.energy === 100) {
      finishSleep(dueAt);
      stateChanged = true;
    }

    const nextAt = dueAt + randomNeedDelay(dueNeed);
    const isFixedAtLimit =
      (dueNeed === "hunger" && needs.hunger === 100) ||
      (dueNeed === "happy" && needs.happy === 0) ||
      (dueNeed === "energy" && !isSleeping && needs.energy === 0) ||
      (dueNeed === "health" && (isSleeping ? needs.health === 100 : needs.health === 0));
    nextNeedAt[dueNeed] = isFixedAtLimit
      ? endAt + randomNeedDelay(dueNeed)
      : nextAt;
  }

  const discardedTime = now - endAt;
  if (discardedTime > 0) {
    for (const need of Object.keys(NEED_TIMERS)) {
      nextNeedAt[need] += discardedTime;
    }
    stateChanged = true;
  }

  lastUpdatedAt = now;
  if (stateChanged) {
    saveGameState(now);
  }
}

function randomNeedDelay(need) {
  if (isSleeping && need === "energy") {
    return randomBetween(SLEEP_ENERGY_DELAY.min, SLEEP_ENERGY_DELAY.max);
  }
  if (isSleeping && need === "health") {
    return randomBetween(SLEEP_HEALTH_DELAY.min, SLEEP_HEALTH_DELAY.max);
  }
  const timer = NEED_TIMERS[need];
  return randomBetween(timer.min, timer.max);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function getNeedChange(need) {
  if (isSleeping && need === "energy") {
    return SLEEP_ENERGY_GAIN;
  }
  if (isSleeping && need === "health") {
    return 1;
  }
  return NEED_TIMERS[need].change;
}

function startSleep(now) {
  isSleeping = true;
  pet.sleepRequested = false;
  pet.targetX = null;
  pet.targetY = null;
  nextNeedAt.energy = now + randomNeedDelay("energy");
  nextNeedAt.health = now + randomNeedDelay("health");
  saveGameState(now);
}

function finishSleep(now) {
  isSleeping = false;
  pet.sleepRequested = false;
  pet.x = 210;
  pet.y = 270;
  pet.targetX = 265;
  pet.targetY = 270;
  pet.direction = "right";
  pet.nextRoamAt = now + 1000;
  pet.lastMovedAt = now;
  nextNeedAt.energy = now + randomNeedDelay("energy");
  nextNeedAt.health = now + randomNeedDelay("health");
  saveGameState(now);
}

function setPetTarget(x, y, isSleepTarget = false) {
  pet.targetX = x;
  pet.targetY = y;
  pet.sleepRequested = isSleepTarget;
}

function updatePet(now) {
  if (isSleeping) {
    pet.lastMovedAt = now;
    return;
  }

  let elapsed = Math.max(0, Math.min((now - pet.lastMovedAt) / 1000, 0.25));
  pet.lastMovedAt = now;

  const laughConfig = ANIMATION_CONFIG.laugh;
  const canLaugh =
    pet.targetX === null &&
    needs.health > PET_SPRITE_RULES.hurtHealthAtOrBelow &&
    needs.happy >= PET_SPRITE_RULES.happyAtOrAbove;
  if (canLaugh && pet.laughUntil <= now && pet.nextLaughAt <= now) {
    pet.laughStartedAt = now;
    pet.laughUntil = now + laughConfig.duration;
    pet.nextLaughAt =
      now + randomBetween(laughConfig.interval.min, laughConfig.interval.max);
  }

  if (
    pet.targetX === null &&
    now >= pet.nextRoamAt &&
    pet.laughUntil <= now
  ) {
    setPetTarget(randomBetween(270, 405), randomBetween(270, 350));
  }

  if (pet.targetX !== null) {
    const dx = pet.targetX - pet.x;
    const dy = pet.targetY - pet.y;
    const distance = Math.hypot(dx, dy);
    pet.direction =
      Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down";

    if (distance <= PET_WALK_SPEED * elapsed || distance < 1) {
      pet.x = pet.targetX;
      pet.y = pet.targetY;
      pet.targetX = null;
      pet.targetY = null;
      if (pet.sleepRequested) {
        startSleep(now);
      } else {
        pet.nextRoamAt = now + randomBetween(1000, 2600);
      }
    } else if (elapsed > 0) {
      pet.x += (dx / distance) * PET_WALK_SPEED * elapsed;
      pet.y += (dy / distance) * PET_WALK_SPEED * elapsed;
    }
  }

  if (now - pet.lastSavedAt >= 2500) {
    pet.lastSavedAt = now;
    saveGameState(now);
  }
}

function drawPet() {
  if (isSleeping) {
    drawSpriteInBox(sprites.bedSleepingSusie, 164, 146, 60, 100);
    return;
  }

  drawSpriteInBox(getPetSprite(Date.now()), pet.x - 30, pet.y - 94, 60, 94);
}

function getPetSprite(now) {
  if (pet.targetX !== null) {
    return getAnimationFrame("walk", pet.direction, now);
  }
  if (
    pet.laughUntil > now &&
    needs.health > PET_SPRITE_RULES.hurtHealthAtOrBelow &&
    needs.happy >= PET_SPRITE_RULES.happyAtOrAbove
  ) {
    const laughDirection = pet.direction === "left" ? "left" : "right";
    return getAnimationFrame("laugh", laughDirection, now, pet.laughStartedAt);
  }
  if (needs.health <= PET_SPRITE_RULES.hurtHealthAtOrBelow) {
    return sprites.hurtSusie;
  }
  return sprites.susie;
}

function getAnimationFrame(animationName, direction, now, startedAt = 0) {
  const frames = animations[animationName][direction];
  const frameDuration = ANIMATION_CONFIG[animationName].frameDuration;
  const animationTime = startedAt === 0 ? now : now - startedAt;
  const frameIndex = Math.floor(animationTime / frameDuration) % frames.length;
  return frames[frameIndex];
}

function drawStats() {
  const statsBarX = 500;
  const barStartX = statsBarX + 20;
  const barWidth = 4 * 19 + 16;
  drawSpriteInBox(sprites.statsLabel, barStartX + (barWidth - 76) / 2, 10, 76, 18);

  for (let row = 0; row < STAT_SPRITE_ROWS.length; row++) {
    const y = 38 + row * 25;
    const { need, sprite } = STAT_SPRITE_ROWS[row];
    const value = needs[need];
    const filledIcons = Math.ceil(value / 20);
    const startX = barStartX + ((5 - filledIcons) * 19) / 2;

    for (let icon = 0; icon < filledIcons; icon++) {
      const fill = Math.max(0, Math.min(1, (value - icon * 20) / 20));
      if (fill > 0) {
        tint(255, Math.round(fill * 255));
        drawSpriteInBox(sprites[sprite], startX + icon * 19, y, 16, 18);
        noTint();
      }
    }
  }
}

function drawActions() {
  for (let i = 0; i < actionButtons.length; i++) {
    const y = actionButtonY + i * actionButtonGap;
    const button = actionButtons[i];
    const hovered = isOverActionButton(i);
    const label = i === 3 && isSleeping ? sprites.sleepingLabel : button.label;

    if (isSleeping && i !== 3) {
      tint(255, 90);
    } else if (hovered) {
      tint(255, 180);
    }
    drawSpriteInBox(button.icon, actionButtonX + 4, y + 6, 36, 36);
    image(label, actionButtonX + 48, y + 17);
    noTint();
  }
}

function drawSpriteInBox(sprite, x, y, boxWidth, boxHeight) {
  const scale = Math.min(boxWidth / sprite.width, boxHeight / sprite.height);
  const spriteWidth = sprite.width * scale;
  const spriteHeight = sprite.height * scale;

  image(
    sprite,
    x + (boxWidth - spriteWidth) / 2,
    y + (boxHeight - spriteHeight) / 2,
    spriteWidth,
    spriteHeight
  );
}

function mousePressed() {
  const now = Date.now();
  updateGame(now);
  updatePet(now);
  for (let i = 0; i < actionButtons.length; i++) {
    if (isOverActionButton(i)) {
      if (isSleeping && i !== 3) {
        return;
      }
      actionButtons[i].action();
      return;
    }
  }
}

function isOverActionButton(index) {
  const y = actionButtonY + index * actionButtonGap;
  return (
    mouseX >= actionButtonX &&
    mouseX <= actionButtonX + actionButtonWidth &&
    mouseY >= y &&
    mouseY <= y + actionButtonHeight
  );
}

function loadGameState() {
  const now = Date.now();
  const savedGameState = localStorage.getItem("petGameState");

  if (savedGameState !== null) {
    const state = JSON.parse(savedGameState);
    if (
      state === null ||
      typeof state !== "object" ||
      state.needs === null ||
      typeof state.needs !== "object"
    ) {
      throw new Error("Saved pet game state is invalid.");
    }
    if (
      typeof state.isSleeping !== "boolean" ||
      !Number.isFinite(state.lastUpdatedAt)
    ) {
      throw new Error("Saved pet game timing data is invalid.");
    }
    needs = normalizeNeeds(state.needs);
    isSleeping = state.isSleeping;
    lastUpdatedAt = state.lastUpdatedAt;
    nextNeedAt = {};
    for (const need of Object.keys(NEED_TIMERS)) {
      nextNeedAt[need] = Number.isFinite(state.nextNeedAt?.[need])
        ? state.nextNeedAt[need]
        : now + randomNeedDelay(need);
    }
    if (state.pet !== null && typeof state.pet === "object") {
      pet = { ...pet, ...state.pet, lastMovedAt: now, lastSavedAt: now };
      if (pet.sleepRequested) {
        isSleeping = false;
      }
    }
  } else {
    const savedNeeds = localStorage.getItem("petNeeds");
    if (savedNeeds !== null) {
      needs = normalizeNeeds(JSON.parse(savedNeeds));
    }
    isSleeping = false;
    lastUpdatedAt = now;
    nextNeedAt = {};
    for (const need of Object.keys(NEED_TIMERS)) {
      nextNeedAt[need] = now + randomNeedDelay(need);
    }
  }
}

function normalizeNeeds(savedNeeds) {
  if (
    savedNeeds === null ||
    typeof savedNeeds !== "object" ||
    Array.isArray(savedNeeds)
  ) {
    throw new Error("Saved pet needs are invalid.");
  }

  const normalizedNeeds = {};
  for (const need of Object.keys(NEED_TIMERS)) {
    const value = savedNeeds[need] ?? needs[need];
    if (!Number.isFinite(value)) {
      throw new Error(`Saved ${need} value is invalid.`);
    }
    normalizedNeeds[need] = Math.max(0, Math.min(100, value));
  }
  return normalizedNeeds;
}

function saveGameState(now = Date.now()) {
  lastUpdatedAt = now;
  pet.lastSavedAt = now;
  localStorage.setItem(
    "petGameState",
    JSON.stringify({ needs, isSleeping, lastUpdatedAt, nextNeedAt, pet })
  );
}

function windowResized() {
  resizeCanvas(640, 480);
}
