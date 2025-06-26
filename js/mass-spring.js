document.addEventListener("touchstart", {});

let numMasses = 7;
let numSprings;
let m = [];
let im = [];
let K = [];
let c = [];
let y0 = [];
let y1 = [];
let y2 = [];
let B0 = [];
let Bp1 = [];
let Bm1 = [];
let k;
let orientation = true;

let C0;
let massSpacing;
let gravity = 0.1;
let deltaAmplitude = 5;
let fillColour;
let massDiam = 4;
let force = 0.0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  setCoefficients();
  setCanvasVariables();  
  
  setInterval(() => {
    numMasses = Math.floor(Math.random() * 8) + 2;
    setCoefficients();
    setCanvasVariables();  
  }, 10000);
  
  
}

function draw() {
  background(50);
  stroke(255);
  fill(255);

  
  if(!orientation)
  {
    translate(width/2, height/2);
    rotate(PI/2)    
    translate(-height/2, -height/2);
  }
  drawMasses();
  drawSprings();

  updateScheme();
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

function drawSprings() {
  stroke(255);
  let springSize = 8;
  drawSpring(0, 
             height / 2, 
             massSpacing + y0[0],    
             height / 2, 
             springSize);
  for (let i = 1; i < numSprings; i++) {
    drawSpring(
      massSpacing * i + y0[i - 1],
      height / 2,
      massSpacing * (i + 1) + y0[i],
      height / 2,
      springSize
    );
  }

  drawSpring(
    massSpacing * (numSprings - 1) + y0[numMasses - 1],
    height / 2,
    (orientation)?width:height,
    height / 2,
    springSize
  );
}
function drawMasses(mid,length) {
  push();
  translate(0, height / 2);
  for (let i = 0; i < numSprings; i++) {
    let offset = massSpacing * (i + 1);
    circle(offset + y0[i], 0, massDiam * m[i]);
  }
  pop();
}

function drawSpring(sx, sy, ex, ey, numSpringSections) {
  
  let start = createVector(sx, sy);
  let end = createVector(ex, ey);
  let springLength = dist(sx, sy, ex, ey);
  let angle = end.sub(start).heading();

  push();
  translate(sx, sy);
  rotate(angle);

  let jointDiam = 5;
  let center = 0;
  let centerOffset = 50;
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

  y1[0] = 10.0;

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

function setCanvasVariables()
{
  orientation = (width > height)? true : false;
    
  massSpacing = ((orientation)?width:height) / numSprings;
  
  
  print(orientation)
}

function mouseClicked() {
  force = deltaAmplitude;
}

function touchStarted() {
  force = deltaAmplitude;
  return false;
}

function touchMoved() {
  return false;
}

function touchEnded() {
  return false;
}
