/*
 * A sketch pad to tinker with the p5.js library
 */

//==============================================================================
// Globals
var docwidth = 2*$(window).width()/3;
//==============================================================================
// Draw a square
var s = function (p)
{ // p could be any variable name
    var x = 100;
    var y = 100;
    p.setup = function ()
    {
        p.createCanvas(4*docwidth/5, 200);
    };

    p.draw = function ()
    {
        p.background(0);
        p.fill(255, 0, 0);
        p.rect(x, y, 50, 50);
    };
};
var myp5 = new p5(s, 'sketch1');


//==============================================================================
// Faking an infinite wrap

var t = function (p)
{
    var x = 100.0;
    var y = 100;
    var speed = 2.5;
    var radius = 50
    var circ;
    
    class myCircle
    {
        constructor()
        {

        }

        display()
        {
            p.ellipse((x - p.width), y, radius * 2, radius * 2);
        }

    }

    function myEllipse()
    {
        p.ellipse((x - p.width), y, radius * 2, radius * 2);
    }


    p.setup = function ()
    {
        circ = new myCircle();
        p.createCanvas(4*docwidth/5, 200);
    };

    p.draw = function ()
    {
        p.background(100);
        p.fill(1);
        x += speed;
        if (x > (p.width - radius))
        {
            circ.display();
            // console.log((x % p.width));
            if (x > p.width + radius)
            {
                x = radius;
            }

        }

        p.ellipse(x, y, radius * 2, radius * 2);

    };
};
var myp5 = new p5(t, 'sketch2');

//==============================================================================

/*
 *   GLSL WebGL Shader in Processing
 */

var a = function (p)
{
    var x = 0;
    var y = 0;
    var program;

    p.preload = function ()
    {
        program = p.loadShader('../../data/vert.glsl', '../../data/sine_wave.glsl'); // watch your paths
    };

    p.setup = function ()
    {
        var canvas = p.createCanvas(4*docwidth/5, 4*docwidth/5, p.WEBGL);
        p.pixelDensity(1);
        // canvas.parent('sketch3');
        p.gl = p.canvas.getContext('webgl');
        p.rectMode(p.CENTER);
        p.noStroke();
        p.fill(1);
    };

    p.draw = function ()
    {
        p.shader(program);
        p.background(0);
        program.setUniform('resolution', [p.width, p.height]);
        // program.setUniform('time', p.sin(p.millis() / 1000.) * 200);
        program.setUniform('time', (p.millis() / 1000.));
        p.rect(x, y, p.width, p.height);
    };
};

var myp5 = new p5(a, 'sketch3');


//==============================================================================
// BBC Clock Sketch
var u = function (p)
{
   var bbcClock;
    p.setup = function ()
    {
        p.createCanvas(4*docwidth/5, 4*docwidth/5);
        bbcClock = new BBCClock(p, p.width, p.height);
    };

    p.draw = function ()
    {
        bbcClock.display(p);
    };
};
var myp5 = new p5(u, 'sketch4');


var u2 = function (p)
{
  var bbcClock;
    p.setup = function ()
    {
        p.createCanvas(p.windowWidth, p.windowHeight);
        bbcClock = new BBCClock(p, p.width, p.height);
    };

    p.draw = function ()
    {
        bbcClock.display(p);
    };
    p.windowResized = function()
    {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        bbcClock = new BBCClock(p, p.width, p.height);
    }
};
var myp5 = new p5(u2, 'sketch5');
