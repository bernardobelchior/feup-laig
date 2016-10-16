/**
 * Circle
 * @constructor
 */
function Circle(scene, slices) {
    CGFobject.call(this, scene);

    this.slices = slices;

    this.initBuffers();
};

Circle.prototype = Object.create(CGFobject.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.initBuffers = function() {
    this.vertices = [];
    this.normals = [];
    this.indices = [];

    var ang = (2 * Math.PI) / this.slices;

    for (j = 0; j < this.slices; j++) {
        this.vertices.push(Math.cos(ang * j), Math.sin(ang * j), 0);
        this.normals.push(0, 0, 1);
    }

    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);

    for (i = 0; i < this.slices - 1; i++) {
        this.indices.push(i, i + 1, this.slices);
    }

    this.indices.push(this.slices - 1, 0, this.slices);

    this.texCoords = [
      -0.5, -0.5,
      -0.5, 0.5,
      0.5, -0.5,
      0.5, 0.5
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
