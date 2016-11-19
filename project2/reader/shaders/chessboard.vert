attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float selectedU;
uniform float selectedV;

uniform float divU;
uniform float divV;

varying vec2 vTextureCoord;
varying vec2 position;
varying vec2 selectedPosition;

void main() {

	float selectedPositionScale = 0.0;

	vTextureCoord = aTextureCoord;

	vec2 divLen = vec2(1.0/divU, 1.0/divV);
	position = vec2(vTextureCoord.x / divLen.x, vTextureCoord.y / divLen.y);

	vec2 posFloor = floor(position);

	selectedPosition = vec2(selectedU, selectedV);

	bvec2 isSelectedPosition = equal(posFloor, selectedPosition);

	if(isSelectedPosition.x == false)
		if(isSelectedPosition.y == false)
			isSelectedPosition = equal(vec2(posFloor.x - 1.0, posFloor.y - 1.0), selectedPosition);

		else
			isSelectedPosition = equal(vec2(posFloor.x - 1.0, posFloor.y), selectedPosition);

	else if(isSelectedPosition.y == false)
		isSelectedPosition = equal(vec2(posFloor.x, posFloor.y - 1.0), selectedPosition);

	if(isSelectedPosition[0] == true && isSelectedPosition[1] == true)
		selectedPositionScale = 5.0;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + aVertexNormal * selectedPositionScale * 0.1, 1.0);
}
