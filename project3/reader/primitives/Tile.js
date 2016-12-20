/**
 * @param scene
 * @constructor
 */
function Tile(scene){
    CGFobject.call(this, scene);

    this.Hex = new Circle(scene, 6, 1.0);
    this.Prism = new Prism(scene, 0.1, 6, 1);
    this.initBuffers();

};

Tile.prototype = Object.create(CGFobject.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.initBuffers = function(){
};

Tile.prototype.display = function(){

    this.scene.pushMatrix();
        this.scene.translate(0, 0.1, 0);
        this.scene.rotate(Math.PI/180.0 * -90.0, 1, 0, 0);
        this.Hex.display();
    this.scene.popMatrix();

    this.Prism.display();
};

/**
 * Amplifies the texture according to the s and t variables.
 * The sphere does not need amplifying as it is a quadric surface.
 * Even though it does not do anything, it needs to be present due to
 * inheritance.
 */
Tile.prototype.amplifyTexture = function(amplifierS, amplifierT) {}
