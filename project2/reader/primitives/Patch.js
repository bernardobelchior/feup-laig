/**
 * Patch class constructor
 * @param scene Scene
 * @param orderU Order in the u direction
 * @param orderV Order in the v direction
 * @param partsU Parts in the u direction
 * @param partsV Parts in the v direction
 * @param controlPoints All control points for the patch
 * @constructor
 */
function Patch(scene, orderU, orderV, partsU, partsV, controlPoints) {
    let knotsU = getKnotsVector(orderU);
    let knotsV = getKnotsVector(orderV);

    let nurbsSurface = new CGFnurbsSurface(orderU, orderV, knotsU, knotsV, controlPoints);
    let getSurfacePoint = function (u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    CGFnurbsObject.call(this, scene, getSurfacePoint, partsU, partsV);

    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
};

Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor = Patch;

/**
 * This function is needed in order to avoid TypeError due to amplifying a texture
 * that must not be amplified.
 */
Patch.prototype.amplifyTexture = function (amplifierS, amplifierT) {

};
