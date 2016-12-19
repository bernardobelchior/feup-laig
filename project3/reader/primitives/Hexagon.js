function Hexagon(scene){
    CGFobject.call(this, scene);
    this.initBuffers();
};

Hexagon.prototype = Object.create(CGFobject.prototype);
Hexagon.prototype.constructor = Hexagon;

Hexagon.prototype.initBuffers = function(){
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    // this.texCoords = [];

    var angleIncrement = Math.PI * 2 / 6;
    var nverts = 0;

    for(var i = 0; i < 6; i++){
        x = Math.cos(i * angleIncrement);
        y = 0;
        z = Math.sin(i * angleIncrement);
        this.vertices.push(x,y,z);
        nverts++;
        this.normals.push(0,1,0);

        if(nverts >= 3){
            this.indices.push(nverts - 1, nverts - 2, 0);
        }
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();

}
