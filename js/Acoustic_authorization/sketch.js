//import {testFunc} from "test.js";

let ps = [];
let mcs = [];
let numMasses = 3;
let numSprings = 4;

let m, im, K, c, k;
let y0, y1, y2;
let B0, Bp1, Bm1;
let C0;
let force = 1.0;

let d = 60;
let r = d / 2;
let phaseDelta = 0.125;
let phase = 0.0;
let camV;
let camMag = 40;
let camRad = camMag / 2;

function setup() {
// testFunc();
  createCanvas(400, 400);
  setCoefficients();

  
  camV = createVector(width / 3, height / 2);
  ps = [
    createVector(width / 6, (5 * height) / 6),
    createVector(width / 6, (1 * height) / 2),
    createVector(width / 6, (1 * height) / 5),
    createVector((5 * width) / 6, (1 * height) / 5),
    createVector((5 * width) / 6, (1 * height) / 2),
    createVector((5 * width) / 6, (5 * height) / 6),
  ];

  mcs = [ps[1], createVector(width / 2, (1 * height) / 5), ps[4]];
}

function draw() {
  background(50);
  fill(255);
updateScheme();
  drawSpring(ps[0].x, ps[0].y, ps[1].x, ps[1].y + y0[0], 10, 20);
  drawSpring(ps[1].x, ps[1].y + y0[0], ps[2].x, ps[2].y + y0[1], 10, 20);
  drawSpring(ps[3].x, ps[3].y + y0[1], ps[4].x, ps[4].y + y0[2], 10, 20);
  drawSpring(ps[4].x, ps[4].y + y0[2], ps[5].x, ps[5].y, 10, 20);

  circle(mcs[0].x, mcs[0].y + y0[0], 20);
  circle(mcs[1].x, mcs[1].y + y0[1], 20);
  circle(mcs[2].x, mcs[0].y + y0[2], 20);

  line(ps[2].x, ps[2].y + y0[1], ps[3].x, ps[3].y + y0[1]);

  rectMode(CENTER);
  rect(ps[0].x, ps[0].y, 50, 3);
  rect(ps[5].x, ps[5].y, 50, 3);
  drawCam()
}

function drawCam() {
  stroke(255);
  fill(45, 197, 244);
  push();
  translate(camV.x, camV.y);
  circle(0, 0, camMag);
  push();
  rotate(phase);
  line(0, 0, camRad, 0);
  pop();

  stroke(100);
  let forceType = 'half';
  
  switch (forceType) {
    case 'half':
      if (phase < (3 * TWO_PI) / 4 && phase > PI / 2) {
        stroke(255);
        force = 0.25 * cos(phase - PI / 2);
      }
      break;   
      
    case 'full':      
        stroke(255);
        force = 0.1 * cos(phase - PI / 2);      
      break;
  }
  

  line(
    -abs(cos(phase) * camRad),
    sin(phase) * camRad,
    -100,
    sin(phase) * camRad
  );
  pop();
  phase += phaseDelta;
  if (phase > TWO_PI) {
    phase -= TWO_PI;
  }
}

function drawSpring(sx, sy, ex, ey, numSpringSections, centerOffset = 50) {
  stroke(255);
  let start = createVector(sx, sy);
  let end = createVector(ex, ey);
  let springLength = dist(sx, sy, ex, ey);
  let angle = end.sub(start).heading();

  push();
  translate(sx, sy);
  rotate(angle);

  let jointDiam = 5;
  let center = 0;
  let alternate = true;
  let sectionLength = springLength / numSpringSections;
  let cp = 0;
  let px = cp;
  let py = center;

  cp += sectionLength / 2;

  let nx = cp;
  let ny = center + (alternate ? -1 : 1) * centerOffset;
  alternate = !alternate;
  line(px, py, nx, ny);
  circle(px, py, jointDiam);

  for (let i = 1; i < numSpringSections; i++) {
    circle(px, py, jointDiam);
    px = nx;
    py = ny;

    cp += sectionLength;

    nx = cp;
    ny = center + (alternate ? -1 : 1) * centerOffset;
    alternate = !alternate;

    line(px, py, nx, ny);
  }
  circle(px, py, jointDiam);
  px = nx;
  py = ny;

  cp += sectionLength / 2;

  ny = center;
  nx = cp;
  line(px, py, nx, ny);

  circle(px, py, jointDiam);
  circle(nx, ny, jointDiam);

  pop();
}

function setCoefficients() {
  numSprings = numMasses + 1;
  y0 = Array(numMasses);
  y1 = Array(numMasses);
  y2 = Array(numMasses);

  y0.fill(0.0);
  y1.fill(0.0);
  y2.fill(0.0);

  y1[0] = 0.0;

  k = 1.0 / getTargetFrameRate();

  m = Array(numMasses);
  m.fill(5.6);

  m = m.map((el) => {
    return Math.random() * 13 + 2;
  });

  im = m.map((el) => {
    return 1.0 / el;
  });

  K = Array(numSprings);
  K.fill(200.5);
  
  K = K.map((el) => {
    return Math.random() * 20 + 190;
  });

  c = Array(numMasses);
  c.fill(1);

  B0 = Array(numMasses);
  Bp1 = Array(numMasses);
  Bm1 = Array(numMasses);
  C0 = Array(numMasses);

  for (let i = 0; i < numMasses; i++) {
    B0[i] = 2 - 4 * k * im[i] * c[i] - 2 * k * k * im[i] * (K[i] + K[i + 1]);
    Bm1[i] = -(2 * k * k * im[i] * -K[i]);
    Bp1[i] = -(2 * k * k * im[i] * -K[i + 1]);

    C0[i] = 4 * k * im[i] * c[i] - 1;
  }
}

function updateScheme() {
  let i = 0;

  y0[i] = B0[i] * y1[i] + Bp1[0] * y1[i + 1] + C0[i] * y2[i] + force;

  for (let i = 1; i < numMasses - 1; i++) {
    y0[i] =
      B0[i] * y1[i] + Bp1[i] * y1[i + 1] + Bm1[i] * y1[i - 1] + C0[i] * y2[i];
  }
  i = numMasses - 1;
  y0[i] = B0[i] * y1[i] + Bm1[i] * y1[i - 1] + C0[i] * y2[i];

  let temp = y2;
  y2 = y1;
  y1 = y0;
  y0 = temp;

  force = 0.0;
}
