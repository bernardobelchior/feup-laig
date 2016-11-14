/**
 * Patch
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

function Patch(scene, orderU, orderV, partsU, partsV, controlPoints) {
    let knotsU = getKnotsVector(orderU);
    let knotsV = getKnotsVector(orderV);

    nurbsSurface = new CGFnurbsSurface(orderU, orderV, knotsU, knotsV, controlPoints);
    getSurfacePoint = function(u, v) {
      return nurbsSurface.getPoint(u, v);
    };

    CGFnurbsObject.call(this, scene, getSurfacePoint, partsU, partsV);

    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
    console.log(this);
  //  this.initBuffers();
};

Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.amplifyTexture = function(amplifierS, amplifierT) {


    //  this.updateTexCoordsGLBuffers();
};
