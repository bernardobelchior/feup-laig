#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D sampler;

uniform vec4 color1;
uniform vec4 color2;

uniform float color1r;
uniform float color1g;
uniform float color1b;
uniform float color1a;

uniform float color2r;
uniform float color2g;
uniform float color2b;
uniform float color2a;


uniform float colorsr;
uniform float colorsg;
uniform float colorsb;
uniform float colorsa;

void main(){
	vec4 color1 = vec4(color1r, color1g, color1b, color1a);
	vec4 color2 = vec4(color2r, color2g, color2b, color2a);
	vec4 colors = vec4(colorsr, colorsg, colorsb, colorsa);

	vec4 color = texture2D(sampler, vTextureCoord);

	gl_FragColor = color * color1;
}
