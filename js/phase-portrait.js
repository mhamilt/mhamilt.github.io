let notes = [65, 62, 60];
let currentNote = 0;
let intervals = [500, 500, 1000, 750]

let oscBank = Array(20);
let gainBank = Array(oscBank.length);
let numberOfOscilatorsToShow = 2;
let isPlaying = false;
let f0 = 420.69;
let dispersion = 1.0;
let fft;
const maxDispersion = 1.000146;

let maxX = 0;

function setup() {
  cnv = createCanvas(400, 400);

  cnv.mousePressed(playOscillatorBank);

  for (let i = 0; i < oscBank.length; i++) {
    const oscfreq = f0 * (i + 1) * Math.pow(dispersion, i);
    oscBank[i] = new p5.Oscillator(oscfreq, "sine");
    oscBank[i].amp(f0 / oscfreq);
    gainBank[i] = f0 / oscfreq;
    console.log(`${i}: ${oscfreq}`);
  }

  fft = new p5.FFT();
}

function draw() {
  background(220);

  dispersion = constrain(
    map(mouseX, 0, width, 1.0, maxDispersion),
    1.0,
    maxDispersion
  );
  text(`F0: ${f0}`, 20, 40);
  text("dispersion: " + dispersion, 20, 60);

  for (let i = 0; i < oscBank.length; i++) {
    const oscfreq = f0 * (i + 1) * Math.pow(dispersion, i);
    oscBank[i].freq(oscfreq, 0.1);
    // text(`osc${i}: ${oscfreq}`, 20, 80 + (14*i));
  }

  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(20);

  const numSamples = Math.floor(
    constrain(
      map(mouseY, 0, width, 0, waveform.length / 2),
      0,
      waveform.length / 2
    )
  );
  
  const numSamples_f = 
    constrain(
      map(mouseY, 0, width, 0, waveform.length / 2),
      0,
      waveform.length / 2);
  
  
  let xScale = numSamples / (waveform.length * 0.5);
    
  text(`Sample Delay: ${numSamples}`, 20, 80);
  const phasePortraitLength = waveform.length - numSamples;

  for (let i = 0; i < phasePortraitLength; i++) {
    
    // try adding in some interpolation
    let x = map(
      (1.3 * width * (waveform[i + numSamples] + 1)) * (1.0-xScale*0.5),
      0,
      phasePortraitLength,
      0,
      width
    );
    
    
    let y = map(waveform[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();

  text(`Num Oscs: ${numberOfOscilatorsToShow}`, 20, 100);
}

function playOscillatorBank() {
  if (!isPlaying) {
    for (const osc of oscBank) {
      osc.start();
    }
  } else {
    for (const osc of oscBank) {
      osc.stop();
    }
  }
  isPlaying = !isPlaying;
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    numberOfOscilatorsToShow++;
    if (numberOfOscilatorsToShow > oscBank.length) {
      numberOfOscilatorsToShow = oscBank.length;
    }
  } else if (keyCode === LEFT_ARROW) {
    numberOfOscilatorsToShow--;
    if (numberOfOscilatorsToShow < 0) {
      numberOfOscilatorsToShow = 0;
    }
  }
  for (let i = 0; i < oscBank.length; i++) {
    oscBank[i].amp((i < numberOfOscilatorsToShow ? gainBank[i] : 0.0), 0.1);
  }

  console.log(`numberOfOscilatorsToShow ${numberOfOscilatorsToShow}`);
}


function midi2Hz(midiNoteNumber)
{
  return Math.pow(2, (midiNoteNumber - 69) / 12.0) * 440.0;
}

function changeNote()
{
  f0 = midi2Hz(notes[currentNote++])
  if (currentNote > notes.length) currentNote = 0;
  setTimeout(changeNote, intervals[(Math.floor(intervals.length*Math.random()) + 1)] * 0.25);
  
}


