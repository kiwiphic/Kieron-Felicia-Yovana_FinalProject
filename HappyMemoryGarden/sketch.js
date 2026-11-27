/* Happy Memory Garden
 * Type a sentence: every finished word grows into a plant (a recursive tree)
 * that ends in flowers. The same sentence always grows the same garden.
 */

const MAX_PLANTS = 15; // most plants in the garden
const GROW_FRAMES = 200; // frames a plant takes to grow
const WIND_STRENGTH = 0.1; // how far wind bends a plant
const FLOWER_DEPTH = 2; // how many times a petal splits
const MAX_DEPTH = 7; // most times a stem can split
// plants grow between these two heights (fractions of the canvas height)
const BED_TOP = 0.58;
const BED_BOTTOM = 0.8;

let plants = []; // every plant in the garden
let sky; // the sky picture
let cnv, panel, textBox, statusLine; // the canvas and the text bar elements
let plantedWords = []; // finished words that are already planted

function setup() {
  makeInterface(); // text bar first, so we know how much room is left
  let fit = fitCanvas();
  cnv = createCanvas(fit.w, fit.h); // biggest 16:9 canvas that fits above the bar
  colorMode(HSB, 360, 100, 100, 100); // colours as hue, saturation, brightness, alpha
  textFont("Georgia");
  strokeCap(ROUND);
  noiseSeed(1); // the wind starts the same way every time

  sky = createGraphics(width, height); // the sky is painted once into a picture
  paintSky(sky);
  layoutCanvas();

  // three starter plants (true = already grown)
  plantWord("happy", textSeed("happy"), true);
  plantWord("times", textSeed("times"), true);
  plantWord("memories", textSeed("memories"), true);
}

function draw() {
  image(sky, 0, 0); // the sky covers the last frame

  // grow every plant a little
  for (let plant of plants) {
    plant.update();
  }

  // draw the plants at the back first
  let sorted = plants.slice().sort((a, b) => a.y - b.y);
  for (let plant of sorted) {
    plant.show();
  }

  // refresh the status text every 20 frames
  if (frameCount % 20 === 0) updateStatus();
}

// height of the text bar
function barHeight() {
  return panel.elt.offsetHeight;
}

// the biggest 16:9 canvas that fits above the text bar
function fitCanvas() {
  let room = windowHeight - barHeight();
  let w = min(windowWidth, (room * 16) / 9);
  return { w: floor(w), h: floor((w * 9) / 16) };
}

// when the window changes size: refit the canvas, repaint the sky, move the plants
function windowResized() {
  let fit = fitCanvas();
  resizeCanvas(fit.w, fit.h);
  sky.resizeCanvas(width, height);
  paintSky(sky);
  for (let plant of plants) {
    plant.place();
  }
  layoutCanvas();
}

// centre the canvas in the space above the text bar
function layoutCanvas() {
  cnv.style("top", (windowHeight - barHeight()) / 2 + "px");
}

// builds the text bar: text box, buttons and status line
function makeInterface() {
  panel = createDiv().id("panel");

  textBox = createElement("textarea").parent(panel);
  textBox.attribute("rows", "2");
  textBox.attribute("spellcheck", "false");
  textBox.attribute("placeholder", "Type your favourite memory.");
  textBox.input(onType); // runs every time the text changes

  let row = createDiv().addClass("row").parent(panel);
  createButton("Replay").addClass("ghost").parent(row).mousePressed(replay);
  createButton("Clear").addClass("ghost").parent(row).mousePressed(clearGarden);

  statusLine = createDiv("").addClass("status").parent(panel);
  updateStatus();
}

// split text into clean lowercase words
function wordsIn(text) {
  let words = text.toLowerCase().match(/[a-z']+/g) || [];
  return words.map((w) => w.replace(/'/g, "")).filter((w) => w !== "");
}

// runs when the text changes. A word is finished once a space, comma or
// new line comes after it.
function onType() {
  // cut off the word that is still being typed
  let finishedText = textBox.value().replace(/[A-Za-z']+$/, "");
  let all = wordsIn(finishedText);

  // is the garden still the start of this sentence?
  let sameStart = plantedWords.length <= all.length;
  for (let i = 0; i < plantedWords.length; i++) {
    if (plantedWords[i] !== all[i]) sameStart = false;
  }

  // sentence was edited, or the first word was typed (clears the starter plants): start again
  if (!sameStart || (plantedWords.length === 0 && all.length > 0)) {
    removePlants();
  }

  // plant each new word; its seed comes from the sentence so far
  while (plantedWords.length < all.length) {
    let word = all[plantedWords.length];
    plantedWords.push(word);
    plantWord(word, textSeed(plantedWords.join(" ")), false);
  }
  updateStatus();
}

// shows how many words are planted and how many plants are in the garden
function updateStatus() {
  if (!statusLine) return;
  statusLine.html(plantedWords.length + " planted · " + plants.length + " / " + MAX_PLANTS + " in the garden");
}

// regrow the same plants from the start
function replay() {
  for (let plant of plants) plant.grown = 0;
}

// empty the garden and the text box
function clearGarden() {
  removePlants();
  textBox.value("");
  updateStatus();
}

// forget all plants and planted words
function removePlants() {
  plants = [];
  plantedWords = [];
}


// Turn text into a whole number (a seed). The same text always gives the same
// number, different text gives a different one.
function textSeed(text) {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0; // mix in each letter; >>> 0 keeps it a 32-bit whole number
  }
  return h;
}

// plant one word (instant = true skips the growing)
function plantWord(word, seed, instant) {
  randomSeed(seed); // same seed gives the same random numbers, so the same plant
  let spot = pickSpot();
  let plant = new Plant(word, spot.fx, spot.fy, seed);
  plants.push(plant);
  if (instant) plant.growInstantly();

  // over the limit: remove the oldest plant
  if (plants.length > MAX_PLANTS) {
    plants.shift();
  }
}

// pick a spot as fractions (0 to 1) of the canvas, so the layout fits any screen
function pickSpot() {
  let fx = random(0.06, 0.94);
  let fy = max(random(), random()); // the larger of two pulls plants to the front
  return { fx, fy };
}

// sky: a vertical blue-to-green gradient drawn onto picture g
function paintSky(g) {
  g.colorMode(HSB, 360, 100, 100, 100);
  g.noStroke();
  for (let y = 0; y < g.height; y++) {
    const t = y / g.height;
    g.fill(lerpColor(color(205, 30, 92), color(120, 16, 84), pow(t, 1.3)));
    g.rect(0, y, g.width, 1);
  }
}

// wind strength at x: noise makes it rise and fall slowly
function windAt(x) {
  let n = noise(x * 0.0015 - frameCount * 0.006, frameCount * 0.003);
  return 0.35 + (n - 0.5) * 1.4;
}

// squeeze the colour wheel into cyan, blue, purple, pink, red and orange,
// so flowers are never green or yellow
function petalHue(h) {
  h = ((h % 360) + 360) % 360;
  return map(h, 0, 360, 170, 400) % 360;
}

// A plant is a tree (branch) that ends in flowers (flower)
class Plant {
  constructor(word, fx, fy, seed) {
    this.word = word;
    this.fx = fx; // position as a fraction of the canvas
    this.fy = fy;
    this.seed = seed;

    // numbers taken from the word
    let vowels = 0;
    for (let ch of word) {
      if ("aeiou".includes(ch)) vowels++;
    }
    let consonants = word.length - vowels;
    let total = textSeed(word); // letters add up to a number (used for colour)

    this.petals = 3 + ((vowels * 2 + word.length) % 7); // vowels and length -> petal count
    this.depth = min(MAX_DEPTH, 2 + floor(word.length / 3)); // longer word -> more splits
    this.spread = 0.25 + 0.4 * (consonants / word.length); // more consonants -> wider branch angle
    this.hue1 = (total * 37) % 360; // flower colour
    this.hue2 = (this.hue1 + 100) % 360; // petals fade to this colour
    this.stemHue = 105 + random(-14, 14); // a slightly different green for each plant
    this.lenFactor = random(0.9, 1.2); // random trunk length

    this.grown = 0; // 0 = just planted, 1 = fully grown
    this.wind = 0; // set every frame in show()
    this.place();
  }

  // turn the fractions into a pixel position and size for the current canvas
  place() {
    this.x = this.fx * width;
    this.y = height * (BED_TOP + this.fy * (BED_BOTTOM - BED_TOP));

    // plants at the back are smaller, and everything scales with the canvas height
    this.sc = map(this.fy, 0, 1, 0.65, 1) * (height / 720);
    this.len = 115 * this.sc * this.lenFactor; // trunk length in pixels
  }

  // grow a little every frame
  update() {
    this.grown = min(1, this.grown + 1 / GROW_FRAMES);
  }

  // fully grown straight away (used for the starter plants)
  growInstantly() {
    this.grown = 1;
  }

  // draw the plant and its word
  show() {
    this.wind = windAt(this.x);

    // move to the bottom of the trunk, then branch() draws the whole plant
    push();
    translate(this.x, this.y);
    this.branch(this.len, this.depth, 0);
    pop();

    // the word under the plant
    textAlign(CENTER, TOP);
    textSize(max(15, 13 * this.sc));
    noStroke();
    fill(110, 40, 18, 75);
    text(this.word, this.x, this.y + 6);
  }

  // A branch is a line with two smaller branches on top (it calls itself).
  // len = length, depth = splits left, id = number of this branch
  branch(len, depth, id) {
    randomSeed(this.seed + id * 7919); // each branch has its own seed, so its shape never changes

    // g = how much of this branch has grown (0 to 1): the trunk first, then each level
    const level = this.depth - depth; // 0 at the trunk
    const g = constrain(this.grown * (this.depth + 2) - level, 0, 1);
    if (g === 0) return;

    // pick all the random numbers here, always in the same order
    const early = random() < 0.2; // some branches stop early and flower lower down
    const leftAngle = this.spread + random(-0.15, 0.15);
    const rightAngle = this.spread + random(-0.15, 0.15);
    const leftLen = len * random(0.66, 0.78);
    const rightLen = len * random(0.66, 0.78);
    const hasLeaf = random() < 0.5;
    const leafAngle = random(-1.4, 1.4);

    // stem colour and thickness: dark and thick at the bottom, light and thin at the tips
    const t = 1 - depth / this.depth;
    stroke(this.stemHue, 50, lerp(30, 55, t));
    strokeWeight(map(depth, 0, this.depth, 1.1, 4.2) * this.sc);
    strokeCap(ROUND);
    line(0, 0, 0, -len * g);

    translate(0, -len * g); // move to the tip of the stem

    // still growing: a white dot on the tip
    if (g < 1) {
      noStroke();
      fill(0, 0, 100, 90);
      circle(0, 0, 5 * this.sc);
      return;
    }

    // end of a stem: open a flower
    if (depth === 0 || (early && level > 0)) {
      const open = constrain(this.grown * (this.depth + 2) - (level + 1), 0, 1);
      flower(this, id, open);
      return;
    }

    // some branches have a leaf
    if (hasLeaf) {
      push();
      noStroke();
      fill(this.stemHue, 50, 50);
      rotate(leafAngle + this.wind * 0.25);
      ellipse(0, -7 * this.sc, 6 * this.sc, 15 * this.sc);
      pop();
    }

    // wind: noise bends the tips more than the trunk
    const wind = ((noise(this.x * 0.01 + depth * 0.3, frameCount * 0.008) - 0.5) * 0.5 + this.wind * WIND_STRENGTH) * t;

    // two smaller branches, one to the left and one to the right
    push();
    rotate(leftAngle + wind);
    this.branch(leftLen, depth - 1, id * 2 + 1);
    pop();

    push();
    rotate(-rightAngle + wind);
    this.branch(rightLen, depth - 1, id * 2 + 2);
    pop();
  }
}

// draw a flower at the tip of a branch (the origin is already at the tip).
// open goes from 0 to 1 as the flower opens
function flower(plant, id, open) {
  if (open <= 0) return;

  randomSeed(plant.seed + id * 7919 + 1); // every flower has its own seed
  const shift = random(-30, 30); // small colour change
  const R = (12 + plant.depth * 2 + plant.petals * 0.6) * plant.sc * random(0.8, 1.2) * 1.2; // flower size
  const rot = random(TWO_PI); // starting turn
  const dir = random([-1, 1]); // spin direction
  const f = { plant: plant, shift: shift, x: plant.x + id * 13 }; // values passed to petal()

  const sway = (noise(f.x * 0.01, frameCount * 0.01) - 0.5) * 0.4 + plant.wind * 0.3; // nods with the wind
  const easeOpen = 1 - pow(1 - open, 3); // opens fast, then slows down

  push();
  rotate(rot + sway + dir * frameCount * 0.002);
  scale(max(0.01, easeOpen)); // grows from small to full size

  // one small tree (a petal) for every petal, turned around the centre
  for (let i = 0; i < plant.petals; i++) {
    push();
    rotate((i * TWO_PI) / plant.petals);
    petal(R * 0.45, FLOWER_DEPTH, plant.spread, f);
    pop();
  }

  // the centre, in the opposite colour
  noStroke();
  fill(petalHue(plant.hue1 + 180), 70, 98);
  circle(0, 0, R * 0.35);
  pop();
}

// a petal is a tiny tree: a line with two smaller petals on top (like branch)
function petal(len, depth, angle, f) {
  const t = 1 - depth / FLOWER_DEPTH; // 0 at the centre, 1 at the tips
  const hue = petalHue(lerp(f.plant.hue1, f.plant.hue2, t) + f.shift);
  stroke(hue, 55, 100, 90);
  strokeWeight(map(depth, 0, FLOWER_DEPTH, 1, 2.6) * f.plant.sc);
  line(0, 0, 0, -len);

  translate(0, -len);

  // end of a petal: a soft blossom dot
  if (depth === 0) {
    blossom(hue, f.plant.sc);
    return;
  }

  // wind sways the tips more than the middle
  const wind = (noise(f.x * 0.01 + depth * 0.3, frameCount * 0.008) - 0.5) * 0.5 * t;

  // two smaller petals, one to the left and one to the right
  push();
  rotate(angle + random(-0.1, 0.1) + wind);
  petal(len * random(0.62, 0.78), depth - 1, angle, f);
  pop();

  push();
  rotate(-angle + random(-0.1, 0.1) + wind);
  petal(len * random(0.62, 0.78), depth - 1, angle, f);
  pop();
}

// a soft circle of random size at the tip of each petal
function blossom(hue, sc) {
  noStroke();
  fill(hue, 35, 100, 55);
  circle(0, 0, random(6, 12) * sc);
}
