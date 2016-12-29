class Play {
    /**
     * Play constructor.
     */
    constructor() {
        this.ranOutOfTime = true;
    }

    /**
     * Sets play ship movement.
     * @param playerNo Player no.
     * @param shipNo Ship no.
     * @param oldShipPosition Old ship position
     */
    setShipMovement(playerNo, shipNo, oldShipPosition) {
        this.playerNo = playerNo;
        this.shipNo = shipNo;
        this.oldShipPosition = oldShipPosition;
    }

    /**
     * Sets building placement.
     * @param pieceType Piece type
     * @param pieceNo Piece no.
     */
    setBuildingPlacement(pieceType, pieceNo) {
        this.pieceType = pieceType;
        this.pieceNo = pieceNo;
        this.ranOutOfTime = false;
    }

    /**
     * Return whether or not the play was executed or the time ran out.
     * @returns {boolean} true or false.
     */
    wasPlayed() {
        return !this.ranOutOfTime;
    }
}
