//==============================================================================
// Base P5 Fragment Shader
//==============================================================================
#ifdef GL_ES
precision mediump float; // set precision level if available
#endif
//==============================================================================
// Global Constants
const float twoPi = 6.283185307179586;
//==============================================================================
// input variables
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//==============================================================================
// varying: these have all come from the vertex shader
varying vec3 var_vertPos;
varying vec4 var_vertCol;
varying vec3 var_vertNormal;
varying vec2 var_vertTexCoord;
varying vec4 v_color;
//==============================================================================
void main( void )
{
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}
