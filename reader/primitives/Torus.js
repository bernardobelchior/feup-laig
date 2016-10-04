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
    this.radius = (outer - inner) / 2;

    this.initBuffers();
};


Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;

Torus.prototype.initBuffers = function(){
    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];
    var c = (this.outer + this.inner)/2;

    var ang1 = 2 * Math.PI / this.slices;
    var ang2 = 2 * Math.PI / this.loops;
    var nverts = 0;
    var patchLengthY = 1/this.slices;
    var patchLengthX = 1/this.loops;
    var yCoord = 0;
    var xCoord = 0;

    for(var m = 0; m <= this.slices; m++){
        for(var n = 0; n <= this.loops; n++){
            
            let x = (c + this.radius * Math.cos(n * ang2)) * Math.cos(m * ang1);
            let y = (c + this.radius * Math.cos(n * ang2)) * Math.sin(m * ang1);
            let z = this.radius * Math.sin(n * ang1)

            let nx = (this.radius * Math.cos(n * ang2)) * Math.cos(m * ang1);
            let ny = (this.radius * Math.cos(n * ang2)) * Math.sin(m * ang1);
            let nz = this.radius * Math.sin(n * ang1)

            this.vertices.push(x,y,z);
            this.normals.push(nx,ny,nz);

            this.texCoords.push(xCoord, yCoord); //TODO, wrong
                  
            nverts++;
            xCoord += patchLengthX;  //TODO, wrong

            if(m > 0 && n > 0){
                this.indices.push(nverts-this.loops-2, nverts-2, nverts-1);
                this.indices.push(nverts-2, nverts-this.loops-2, nverts-this.loops-3);
            }
        }
        
        xCoord=0;//TODO, wrong
        yCoord += patchLengthY;// same
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();

}