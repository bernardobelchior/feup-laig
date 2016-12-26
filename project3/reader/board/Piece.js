function Piece(scene){
    Object.call(this);
    this.component = null;
    this.hexagon = null;
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
