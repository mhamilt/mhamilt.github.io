//==============================================================================
// Single Circle Fragment Shader
//==============================================================================
#ifdef GL_ES
precision mediump float; // set precision level if available
#endif
//==============================================================================
// Global Constants
const float twoPi = 6.283185307179586;
vec3 colour = vec3(0.4, 0.4, 1.);
const float colourScaling = 0.01;
float brightness = 0;
//==============================================================================
// input variables
uniform float time;
uniform vec2 mouse;     // not using the mouse position in this instance
uniform vec2 resolution;
uniform float circles[5];
//==============================================================================
// functions
vec3 getPixelColour(vec2 pos)
{
  float circleRadius = ((sin(time) + 1.) * .5) * .1875;
  for(int j = 0; j < circles.length(); j++)
  {
    for(int i = 0; i < circles.length(); i++)
    {
      float dis = clamp(abs(distance(pos, vec2(circles[i], circles[j])) - circleRadius), 0.0002, 2.); // distance from centre
      brightness += colourScaling * (circleRadius + 1.0) / dis;
    }
  }
  return colour *  brightness;
}
//==============================================================================
void main( void )
{
  vec2 pos = ((gl_FragCoord.xy / resolution.xy) * 2.0) - 1.0; // scale screen co-ordinates to -1 < (x, y) < 1
  pos.x *= resolution.x / resolution.y;
  gl_FragColor = vec4(getPixelColour(pos) , 1.0);
}
