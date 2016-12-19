function Tile(scene){
    CGFobject.call(this, scene);
    this.Hex = new Hexagon(this.scene);
    this.Prism = new Prism(this.scene, 1, 6, 1);
    this.initBuffers();
};

Tile.protoype = Object.create(CGFobject.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.initBuffers = function(){
};

Tile.prototype.display = function(){
    this.scene.pushMatrix();
        this.scene.translate(0, 0.1, 0);
        this.Hex.display();
    this.scene.popMatrix();

    this.Prism.display();
};
