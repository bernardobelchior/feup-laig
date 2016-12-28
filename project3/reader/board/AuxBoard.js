/**
 * Stores a player's unused colonies or trade stations
 * @param scene CGFScene
 * @param numPieces Maximum number of pieces the player can have
 * @param components Scene components
 * @param type String, "colony" or "trade_station", depending on the desired type
 * @constructor
 */
function AuxBoard(scene, numPieces, components, type){
    this.scene = scene;
    this.numPieces = numPieces;
    this.pieces = [];
    this.component = new Component(scene, "auxBoardWrapper");
    this.component.inheritMaterial = true;
    this.component.texture = 'inherit';
    this.initializePieces(components, type);
    this.scene.rootNode.addChild(this.component);
}

AuxBoard.prototype = Object.create(Object.prototype);
AuxBoard.prototype.constructor = AuxBoard;

/**
 * Get a piece, if there are any remaining
 * @returns a piece to be placed on the board
 */
AuxBoard.prototype.getPiece = function(){
    if(this.numPieces > 0){
        this.numPieces--;
        return this.pieces.pop();
    }

    return null;
};

/**
 * Get the number of pieces still on the auxiliary board
 * @returns number of pieces on the auxiliary board
 */
AuxBoard.prototype.getRemainingNo = function(){
    return this.numPieces;
};

/**
 * Fills the auxiliary board with the pieces that can still be used by the player
 * @param components scene components
 * @param type "colony" or "trade_station"
 */
AuxBoard.prototype.initializePieces = function(components, type){
    for(let i = 0; i < this.numPieces; i++){
        let newPiece = new Piece(this.scene, components[type].component, null);
        this.component.addChild(newPiece.component);
        this.pieces.push(newPiece);
    }
};

/**
 * @param pickingID
 */
AuxBoard.prototype.setPickingID = function(pickingID){
    this.component.setPickingID(pickingID);
}

