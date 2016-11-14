/**
 * Patch
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

function Patch(scene, orderU, orderV, partsU, partsV) {
    CGFnurbsObject.call(this, scene);

    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;

    //this.initBuffers();
};

Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor = Rectangle;

Patch.prototype.setControlPoints = function(controlPoints) {
  this.controlPoints = controlPoints;
};

Patch.prototype.initBuffers = function() {

    this.primitiveType = this.scene.gl.TRIANGLES;
//    this.initGLBuffers();
};

Patch.prototype.amplifyTexture = function(amplifierS, amplifierT) {


  //  this.updateTexCoordsGLBuffers();
};
