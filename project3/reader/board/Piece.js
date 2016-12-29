function Piece(scene, component, hexagon){
    Object.call(this);
    this.scene = scene;
    this.component = new Component(scene, "pieceWrapper");
    this.component.inheritMaterial = true;
    this.component.texture = "inherit";
    this.component.addChild(component);
    this.hexagon = hexagon;
    this.animation = null;
}

Piece.prototype = Object.create(Object.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.getHex = function(){
    return this.hexagon;
};

Piece.prototype.setHex = function (hexagon) {
    this.hexagon = hexagon;
};

Piece.prototype.setAnimation = function(animation){
    this.component.addAnimation(animation);
    this.animation = animation;
};

Piece.prototype.removeAnimation = function(){
    
};

PIECE_TYPE = {
    TRADE_STATION: 0,
    COLONY : 1
};