class Play {
    constructor() {
        this.ranOutOfTime = true;
    }

    setPlay(playerNo, shipNo, oldShipPosition) {
        this.playerNo = playerNo;
        this.shipNo = shipNo;
        this.oldShipPosition = oldShipPosition;
        this.ranOutOfTime = false;
    }

    wasPlayed() {
        return !this.ranOutOfTime;
    }
}
