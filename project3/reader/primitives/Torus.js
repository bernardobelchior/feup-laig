/**
 * Torus
 * @constructor
 */
function Torus(scene, inner, outer, slices, loops) {
    CGFobject.call(this, scene);

    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
};


Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;

Torus.prototype.initBuffers = function() {

    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.originalTexCoords = [];
    var c = (this.outer + this.inner) / 2;

    var ang1 = 2 * Math.PI / this.slices;
    var ang2 = 2 * Math.PI / this.loops;
    var nverts = 0;
    var patchLengthY = 1 / this.slices;
    var patchLengthX = 1 / this.loops;
    var k = 0;

    for (var m = 0; m <= this.slices; m++) {
        for (var n = 0; n <= this.loops; n++) {

            let x = (this.outer + this.inner * Math.cos(n * ang2)) * Math.cos(m * ang1);
            let y = (this.outer + this.inner * Math.cos(n * ang2)) * Math.sin(m * ang1);
            let z = this.inner * Math.sin(n * ang1)

            let nx = (this.inner * Math.cos(n * ang2)) * Math.cos(m * ang1);
            let ny = (this.inner * Math.cos(n * ang2)) * Math.sin(m * ang1);
            let nz = this.inner * Math.sin(n * ang1)

            this.vertices.push(x, y, z);
            this.normals.push(nx, ny, nz);

            let xCoord = Math.acos(x / this.inner) / (2 * Math.PI);
            let yCoord = 2 * Math.PI * Math.acos(z / (this.inner + this.outer * Math.cos(2 * Math.PI * xCoord)));

            yCoord = m / this.slices;
            xCoord = (n % (this.loops + 1)) / this.slices;

            this.originalTexCoords.push(xCoord, yCoord);

            nverts++;

            if (m > 0 && n > 0) {
                this.indices.push(nverts - this.loops - 2, nverts - 2, nverts - 1);
                this.indices.push(nverts - 2, nverts - this.loops - 2, nverts - this.loops - 3);
            }
        }
    }

    this.texCoords = this.originalTexCoords.slice();
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();

}


/**
* Amplifies the texture according to the s and t variables.
* The cylinder body does not need amplifying as it is a quadric surface.
* Even though it does not do anything, it needs to be present due to
* inheritance.
*/
Torus.prototype.amplifyTexture = function(amplifierS, amplifierT) {
    for (let i = 0; i < this.originalTexCoords.length; i += 2) {
        this.texCoords[i] = this.originalTexCoords[i] / amplifierS;
        this.texCoords[i + 1] = this.originalTexCoords[i + 1] / amplifierT;
    }

    this.updateTexCoordsGLBuffers();
}
