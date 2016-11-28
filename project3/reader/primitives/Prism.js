/**
 * Prism
 * @constructor
 */
function Prism(scene, height, slices, stacks) {
    CGFobject.call(this, scene);

    this.slices = slices;
    this.stacks = stacks;
    this.height = height;

    this.initBuffers();
};

Prism.prototype = Object.create(CGFobject.prototype);
Prism.prototype.constructor = Prism;

Prism.prototype.initBuffers = function() {
    this.vertices = [];
    // this.normals = [];
    this.indices = [];
    // this.originalTexCoords = [];

    var patchLengthx = 1 / this.slices;
    var patchLengthy = 1 / this.stacks;
    var xCoord = 0;
    var yCoord = 0;
    var ang = (2 * Math.PI) / this.slices;
    var nverts = 0;

    for(let i = 0; i < this.stacks; i++){
        for(let j = 0; j < this.slices; j++){
            x = Math.cos(ang * j);
            y = j * 2;//this.height;
            z = Math.sin(ang * j);

            this.vertices.push(x,y,z);
            nverts++;

            if(i > 0 && j > 0){
                this.indices.push(nverts - 2, nverts - this.slices - 2, nverts- this.slices - 1);
                this.indices.push(nverts - this.slices - 1, nverts - 1, nverts - 2);
            }

        }
    }

    console.log(this.indices);
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

/**
 * Amplifies the texture according to the s and t variables.
 * The cylinder body does not need amplifying as it is a quadric surface.
 * Even though it does not do anything, it needs to be present due to
 * inheritance.
 */
// Prism.prototype.amplifyTexture = function(amplifierS, amplifierT) {
//   for (let i = 0; i < this.originalTexCoords.length; i += 2) {
//       this.texCoords[i] = this.originalTexCoords[i] / amplifierS;
//       this.texCoords[i + 1] = this.originalTexCoords[i + 1] / amplifierT;
//   }
//
//   this.updateTexCoordsGLBuffers();
// }
