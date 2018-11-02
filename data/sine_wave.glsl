//==============================================================================
// Sine Wave Fragment Shader
//==============================================================================
#ifdef GL_ES
precision mediump float;
#endif
//==============================================================================
const float twoPi = 3.14159 * 2.;
//==============================================================================
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
//==============================================================================
const vec3 color = vec3(.0, .9, .7);
const float intensity = 1.1;
//==============================================================================
float band(vec2 pos, float amplitude, float frequency)
{
	float wave = ((1.0 - (cos(twoPi * pos.x))) * 0.5) *(sin(time*2) * amplitude * cos(twoPi * frequency * pos.x + time) / 2.);
	float colourScaling = 0.001;
	float minValue = 0.002;
	float maxValue = 5.0;
	float wavePosition = clamp(abs(wave - pos.y + .5), 0.01, 2.) ; // cosine - pixel ycoord (0 < wavePosition < 1)
	float light = clamp(amplitude * frequency * colourScaling, minValue, maxValue) / wavePosition; // this worked on zero division. this was a hack
	return light * intensity;
}
//==============================================================================
void main(void)
{
	vec2 pos = (gl_FragCoord.xy / resolution.xy);
	float spectrum;
	spectrum += band(pos, .9, 1.);

	gl_FragColor = vec4(color * spectrum, 1.0);
}
//==============================================================================
