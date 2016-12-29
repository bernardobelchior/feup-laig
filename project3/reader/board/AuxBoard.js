/**
 * Stores a player's unused colonies or trade stations
 * @param scene CGFScene
 * @param numPieces Maximum number of pieces the player can have
 * @param components Scene components
 * @param type Piece type
 * @constructor
 */
function AuxBoard(scene, numPieces, components, type) {
    let buildingType;
    switch (type) {
        case PIECE_TYPE.TRADE_STATION:
            buildingType = 'trade_station';
            break;
        case PIECE_TYPE.COLONY:
            buildingType = 'colony';
            break;
        default:
            buildingType = 'null';
            break;
    }

    this.scene = scene;
    this.baseComponent = components[buildingType].component;
    this.numPieces = numPieces;
    this.pieces = [];
    this.component = new Component(scene, "auxBoardWrapper");
    this.component.inheritMaterial = true;
    this.component.texture = 'inherit';
    this.initializePieces();
    this.scene.rootNode.addChild(this.component);
}

AuxBoard.prototype = Object.create(Object.prototype);
AuxBoard.prototype.constructor = AuxBoard;

/**
 * Get a piece, if there are any remaining
 * @returns a piece to be placed on the board
 */
AuxBoard.prototype.getPiece = function () {
    if (this.pieces.length > 0) {
        let piece = this.pieces.pop();
        this.component.children.pop();
        return piece;
    }

    return null;
};

/**
 * Get the number of pieces still on the auxiliary board
 * @returns number of pieces on the auxiliary board
 */
AuxBoard.prototype.getRemainingNo = function () {
    return this.pieces.length;
};

/**
 * Fills the auxiliary board with the pieces that can still be used by the player
 */
AuxBoard.prototype.initializePieces = function () {
    for (let i = 0; i < this.numPieces; i++)
        this.putPiece();
};

/**
 * Puts piece in auxiliary board.
 */
AuxBoard.prototype.putPiece = function () {
    if (this.pieces.length >= this.numPieces)
        return;

    let pieceNo = this.pieces.length;
    let newPiece = new Piece(this.scene, this.baseComponent, null);
    let newPieceWrapper = new Component(this.scene, "pieceWrapper");
    newPieceWrapper.inheritMaterial = true;
    newPieceWrapper.inheritTexture = true;
    newPieceWrapper.texture = 'inherit';
    newPieceWrapper.addChild(newPiece.component);
    newPieceWrapper.translate((Math.floor(pieceNo / 4) % 4) * 1.1, 0.0, (pieceNo % 4) * -1.1);
    this.component.addChild(newPieceWrapper);
    this.pieces.push(newPiece);
};

/**
 * Sets the aux board picking id.
 * @param pickingID Picking ID.
 */
AuxBoard.prototype.setPickingID = function (pickingID) {
    this.component.setPickingID(pickingID);
};

