/**
 * Semisphere
 * @constructor
 */
function Semisphere(scene, radius, slices, stacks) {
    CGFobject.call(this, scene);

    this.slices = slices;
    this.stacks = stacks;
    this.radius = radius;

    this.initBuffers();
};

Semisphere.prototype = Object.create(CGFobject.prototype);
Semisphere.prototype.constructor = Semisphere;

Semisphere.prototype.initBuffers = function() {
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    var ang = (2 * Math.PI) / this.slices;
    var angHor = (Math.PI / 2) / this.stacks;
    var radiusTexture = 0;
    var incRadiusTexture = 0.5 / this.stacks;

    for (let i = 0; i <= this.stacks; i++) {
        for (let j = 0; j < this.slices; j++) {
            let x = Math.cos(ang * j) * Math.cos(angHor * i) * this.radius;
            let y = Math.sin(ang * j) * Math.cos(angHor * i) * this.radius;
            let z = Math.sin(angHor * i) * this.radius;
            this.vertices.push(x, y, z);
            this.normals.push(x, y, z);
            this.texCoords.push(x * 0.5 + 0.5, y * 0.5 + 0.5);
        }
        radiusTexture += incRadiusTexture;

    }

    for (i = 0; i < this.stacks; i++) {
        for (j = 0; j < this.slices - 1; j++) {
            this.indices.push(i * this.slices + j, i * this.slices + j + 1, (i + 1) * this.slices + j);
            this.indices.push(i * this.slices + j + 1, (i + 1) * this.slices + j + 1, (i + 1) * this.slices + j);
        }

        this.indices.push(i * this.slices + this.slices - 1, i * this.slices, (i + 1) * this.slices + this.slices - 1);
        this.indices.push(i * this.slices, i * this.slices + this.slices, (i + 1) * this.slices + this.slices - 1);
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
