class Play {
    constructor() {
        this.ranOutOfTime = true;
    }

    setShipMovement(playerNo, shipNo, oldShipPosition) {
        this.playerNo = playerNo;
        this.shipNo = shipNo;
        this.oldShipPosition = oldShipPosition;


        //TODO remove when buildings are placed.
        this.ranOutOfTime = false;
    }

    setBuildingPlacement(pieceType, pieceNo, oldPiecePosition) {
        this.pieceType = pieceType;
        this.pieceNo = pieceNo;
        this.oldPiecePosition = oldPiecePosition;
        this.ranOutOfTime = false;
    }

    wasPlayed() {
        return !this.ranOutOfTime;
    }
}
