function Piece(scene, component, hexagon){
    Object.call(this);
    this.scene = scene;
    this.component = component;
    this.hexagon = hexagon;
}

Piece.prototype = Object.create(Object.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.setHex = function(boardHex){
    this.hexagon = boardHex;
    boardHex.placePiece(this);
}

Piece.prototype.move = function (newHex) {
   this.hexagon.removePiece(this);
   this.setHex(newHex);
}
