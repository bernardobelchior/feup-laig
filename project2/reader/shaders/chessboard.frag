#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D sampler;
varying vec2 vTextureCoord;

void main(){
	vec4 color = texture2D(sampler, vTextureCoord);
    gl_FragColor = color;

}
