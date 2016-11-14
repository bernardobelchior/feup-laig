/**
 * Plane.js
 * @constructor
 */

 function Plane(scene, lengthX, lengthY, partsX, partsY){
     CGFobject.call(this, scene);

     this.lengthX = lengthX;
     this.lengthY = lengthY;

     this.partsX = partsX;
     this.partsY = partsY;

     this.initBuffers();
 }

 Plane.prototype = Object.create(CGFnurbsObject.prototype);
 Plane.prototype.constructor = Plane;

 Plane.prototype.initBuffers = function(){

     this.vertices = [];
     this.indices = [];

     let patchLengthX = this.lengthX / this.partsX;
     let patchLengthY = this.lengthY / this.partsY;

     let x = 0;
     let y = 0;
     let z = 0;

     let numVertices = 0;

     for(var i = 0; i < this.partsX; i++){
         for(var j = 0; j < this.partsY; j++){
             this.vertices.push(x,y,z);
             numVertices++;

             if(i > 0 && j > 0){
                 this.indices.push(nverts - this.partsX, nverts - this.partsX - 1, nverts - 1);
                 this.indices.push(nverts - 1, nverts - this.partsX - 1, nverts - 2);
             }


             y += patchLengthY;
         }
         x += patchLengthX;
     }
 }
