/**
 * Stores a player's unused colonies or trade stations
 * @param scene CGFScene
 * @param numPieces Maximum number of pieces the player can have
 * @param components Scene components
 * @param type Piece type
 * @param position Board position
 * @param material Material to use in the board's pieces.
 * @constructor
 */
function AuxBoard(scene, numPieces, components, type, position, material) {
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
    this.position = position;
    this.pieces = [];
    this.component = new Component(scene, "auxBoardWrapper");
    this.component.inheritMaterial = true;
    this.component.texture = 'inherit';
    this.initializePieces(material);
    this.component.translate(this.position[0], this.position[1], this.position[2]);
    this.scene.rootNode.addChild(this.component);
}

AuxBoard.prototype = Object.create(Object.prototype);
AuxBoard.prototype.constructor = AuxBoard;

/**
 * Get a piece, if there are any remaining
 * @returns a piece to be placed on the board
 */
AuxBoard.prototype.getPiece = function (selectedHex) {
    if (this.pieces.length > 0) {
        let piece = this.pieces.pop();
        piece.move(selectedHex);
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
AuxBoard.prototype.initializePieces = function (material) {
    for (let i = this.pieces.length; i < this.numPieces; i++)
        this.putPiece(material);
};

/**
 * Puts piece in auxiliary board.
 */
AuxBoard.prototype.putPiece = function (material) {
    if (this.pieces.length >= this.numPieces)
        return;

    let pieceNo = this.pieces.length;
    let nextX = (Math.floor(pieceNo / 4) % 4) * 1.1;
    let nextZ = (pieceNo % 4) * -1.1;
    let newPiece = new Building(this.scene, this.baseComponent, material, this, nextX + this.position[0], nextZ + this.position[2]);
    let newPieceWrapper = new Component(this.scene, "buildingWrapper");
    newPieceWrapper.inheritMaterial = true;
    newPieceWrapper.texture = 'inherit';
    newPieceWrapper.addChild(newPiece.component);
    newPieceWrapper.translate(nextX, 0.0, nextZ);
    this.component.addChild(newPieceWrapper);

    // Update textures.
    this.component.updateTextures(this.scene.graph.textures);
    this.pieces.push(newPiece);
};

/**
 * Sets the aux board picking id.
 * @param pickingID Picking ID.
 */
AuxBoard.prototype.setPickingID = function (pickingID) {
    this.component.setPickingID(pickingID);
};

