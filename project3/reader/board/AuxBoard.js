function AuxBoard(scene, numPieces, components, type){
    this.scene = scene;
    this.numPieces = numPieces;
    this.pieces = [];
    this.initializePieces();
    this.component = new Component(scene, "auxBoardWrapper");
    this.initializePieces(components, type);
}

AuxBoard.prototype = Object.create(Object.prototype);
AuxBoard.prototype.constructor = AuxBoard;

AuxBoard.prototype.getPiece = function(){
    if(this.numPieces > 0){
        this.numPieces--;
        return this.pieces.pop();
    }

    return null;
};

AuxBoard.prototype.getRemainingNo = function(){
    return this.numPieces;
};

AuxBoard.prototype.initializePieces = function(components, type){
    for(let i = 0; i < this.numPieces; i++){
        let newPiece = new Piece(this.scene, components[type].component, null);
        this.component.addChild(newPiece.component);
        this.pieces.push(newPiece);
    }
};

