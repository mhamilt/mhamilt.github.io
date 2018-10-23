//==============================================================================
// Example of using shaders in p5.js
//==============================================================================
var docwidth = $(window).width();
var program;
//==============================================================================

function preload()
{
  program = loadShader('../data/vert.glsl', '../data/frag.glsl'); // watch your paths
}

//==============================================================================

function setup()
{
  pixelDensity(1);
  var canvas = createCanvas(docwidth/3, 500,WEBGL);
  canvas.parent('sketch-holder');
  gl=this.canvas.getContext('webgl');
  rectMode(CENTER);
  noStroke();
  fill(1);
}

//==============================================================================

function draw()
{
  shader(program);
  background(0);
  program.setUniform('resolution',[width,height]);
  program.setUniform('time',sin(millis()/1000.) * 200);
  rect(0,0,width,height);
}

//==============================================================================
