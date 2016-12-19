/**
 * Prism
 * @constructor
 */
function Prism(scene, height, slices, stacks) {
    CGFobject.call(this,scene);

    this.height = height;
    this.slices = slices;
    this.stacks = stacks;

    this.initBuffers();
};

Prism.prototype = Object.create(CGFobject.prototype);
Prism.prototype.constructor = Prism;

Prism.prototype.initBuffers = function() {

    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];

    var ang=(2*Math.PI)/this.slices;

    let patchLengthx = 1 / this.slices;
    let patchLengthy = 1 / this.stacks;
    let xCoord =0;
    let yCoord =0;
    let stackHeight = this.height / this.stacks;
    let nverts = 0;

    for(let j = 0; j < this.stacks; j++){
        for(let i=0; i<this.slices; i++){
            let x0 = Math.cos(ang * i);
            let y0 = j * stackHeight;
            let z0 = Math.sin(ang * i);

            let x1 = Math.cos(ang * (i + 1));
            let y1 = j * stackHeight;
            let z1 = Math.sin(ang * (i + 1));

            let x2 = Math.cos(ang * i);
            let y2 = (j + 1) * stackHeight;
            let z2 = Math.sin(ang * i);

            let x3 = Math.cos(ang * (i + 1));
            let y3 = (j + 1) * stackHeight;
            let z3 = Math.sin(ang * (i + 1));

            this.vertices.push(x0, y0, z0);
            this.vertices.push(x1, y1, z1);
            this.vertices.push(x2, y2, z2);
            this.vertices.push(x3, y3, z3);

            nverts += 4;

            let nx = Math.cos(((ang * i) + (ang * (i + 1))) * 0.5);
            let ny = 0;
            let nz = Math.sin(((ang * i) + (ang * (i + 1))) * 0.5);

            this.normals.push(nx, ny, nz);
            this.normals.push(nx, ny, nz);
            this.normals.push(nx, ny, nz);
            this.normals.push(nx, ny, nz);

            this.indices.push(nverts - 2, nverts - 3, nverts - 4);
            this.indices.push(nverts - 2, nverts - 1, nverts - 3);

            this.texCoords.push(xCoord, yCoord);
            this.texCoords.push(xCoord+patchLengthx, yCoord);
            this.texCoords.push(xCoord, yCoord+patchLengthy);
            this.texCoords.push(xCoord+patchLengthx, yCoord+patchLengthy);

            xCoord += patchLengthx;
        }

        xCoord =0;
        yCoord += patchLengthy;
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
