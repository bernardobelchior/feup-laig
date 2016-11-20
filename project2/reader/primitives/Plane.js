/**
 * Plane.js
 * @constructor
 */

function Plane(scene, lengthX, lengthY, partsX, partsY) {
    this.initSurface(lengthX, lengthY);
    CGFnurbsObject.call(this, scene, this.func, partsX, partsY);
    this.originalTexCoords = this.texCoords.slice();

    this.partsX = partsX;
    this.partsY = partsY;

};

Plane.prototype = Object.create(CGFnurbsObject.prototype);
Plane.prototype.constructor = Plane;

/**
 * Initializes the plane surface.
 * @param lengthX Length in the X axis.
 * @param lengthY Length in the Y axis.
 */
Plane.prototype.initSurface = function (lengthX, lengthY) {

    let degree1 = 1;
    let degree2 = 1;
    let knots1 = [0, 0, 1, 1];
    let knots2 = [0, 0, 1, 1];
    let controlPoints = [
        [
            [0.0, 0.0, 0.0, 1],
            [0.0, lengthY, 0.0, 1]
        ],
        [
            [lengthX, 0.0, 0.0, 1],
            [lengthX, lengthY, 0.0, 1]
        ]
    ];


    this.surface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlPoints);

    this.func = function (u, v) {
        return this.surface.getPoint(u, v);
    }
};

/**
 * Amplifies the plane texture.
 * @param amplifierS Amplifier in the s direction.
 * @param amplifierT Amplifier in the t direction.
 */
Plane.prototype.amplifyTexture = function (amplifierS, amplifierT) {
    for (let i = 0; i < this.originalTexCoords.length; i += 2) {
        this.texCoords[i] = this.originalTexCoords[i] / amplifierS;
        this.texCoords[i + 1] = this.originalTexCoords[i + 1] / amplifierT;
    }

    this.updateTexCoordsGLBuffers();
};
