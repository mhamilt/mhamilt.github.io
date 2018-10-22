// P5.js Shader
//inspired by Pierre MARZIN. Check his stuff out here https://www.openprocessing.org/user/19666

var docwidth = $(window).width();
var program;

function preload()
{
    program = loadShader('../data/vert.glsl', '../data/frag.glsl');
    // program = createShader(vert, frag);
}

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

function draw()
{
    shader(program);
    background(0);
    program.setUniform('resolution',[width,height]);
    program.setUniform('time',sin(millis()/1000.) * 200);
    rect(0,0,width,height);
    // ellipse(0,0,width,height);
}