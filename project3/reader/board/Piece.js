function Piece(scene, component, hexagon){
    Object.call(this);
    this.scene = scene;
    this.component = component;
    this.hexagon = hexagon;
}

Piece.prototype = Object.create(Object.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.getHex = function(){
    return this.hexagon;
};

Piece.prototype.setHex = function (hexagon) {
    this.hexagon = hexagon;
};

PIECE_TYPE = {
    TRADE_STATION: 0,
    COLONY : 1
};