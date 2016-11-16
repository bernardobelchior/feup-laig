uniform vec3 aVertexPosition;
uniform vec3 aVertexNormal;
uniform vec2 aTextureCoord;
uniform vec3 selectedCoord;

varying vec4 coords;
varying vec4 normal;

void main(){
    gl_Position = vec4(aVertexPosition);
}
