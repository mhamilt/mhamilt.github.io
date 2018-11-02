---
layout: page
title: Time
permalink: /time/
---
<style>canvas { position:fixed; top:0; left:0; z-index:1; } #contenu { position:relative; z-index:2; }</style>
<script language="javascript" type="text/javascript" src="/js/p5.min.js"></script>
<script language="javascript" type="text/javascript" src="/js/BBCClock.js"></script>
<script>
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
</script>
<!-- <script language="javascript" type="text/javascript" src="/js/sketch.js"></script> -->
<div class="sketch" id="sketch5" > </div>
