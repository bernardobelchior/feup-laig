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
    var c = (this.outer + this.inner)/2;

    var ang1 = 2 * Math.PI / this.slices;
    var ang2 = 2 * Math.PI / this.loops;
    var nverts = 0;

    for(var m = 0; m <= this.slices; m++){
        for(var n = 0; n <= this.loops; n++){
            this.vertices.push( (c + this.radius * Math.cos(n * ang2)) * Math.cos(m * ang1) ,
                           (c + this.radius * Math.cos(n * ang2)) * Math.sin(m * ang1) ,
                           this.radius * Math.sin(n * ang1) 
                           );
            
            this.normals.push( (this.radius * Math.cos(n * ang2)) * Math.cos(m * ang1),
                           (this.radius * Math.cos(n * ang2)) * Math.sin(m * ang1) ,
                           this.radius * Math.sin(n * ang1) 
                           );
                  
            nverts++;

            if(m > 0 && n > 0){
                this.indices.push(nverts-this.loops-2, nverts-2, nverts-1);
                this.indices.push(nverts-2, nverts-this.loops-2, nverts-this.loops-3);
            }
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();

}