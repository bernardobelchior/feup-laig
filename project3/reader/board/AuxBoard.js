/**
 * Stores a player's unused colonies or trade stations
 * @param scene CGFScene
 * @param numPieces Maximum number of pieces the player can have
 * @param components Scene components
 * @param type String, "colony" or "trade_station", depending on the desired type
 * @constructor
 */
function AuxBoard(scene, numPieces, components, type){

    let buildingType;
    if(type === 1){
        buildingType = "colony";
    } else if(type === 2)
        buildingType = "trade_station";
    else buildingType = "error";

    console.log(buildingType);

    this.scene = scene;
    this.numPieces = numPieces;
    this.pieces = [];
    this.component = new Component(scene, "auxBoardWrapper");
    this.component.inheritMaterial = true;
    this.component.texture = 'inherit';
    this.initializePieces(components, buildingType);
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
        let piece =  this.pieces.pop();
        this.component.removeChild(piece.component);
        return piece;
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
    console.log();
    for(let i = 0; i < this.numPieces; i++){
        let newPiece = new Piece(this.scene, components[type].component, null);
        newPiece.component.translate((Math.floor(i/4) % 4) * 1.1, 0.0, (i % 4) * -1.1);
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

