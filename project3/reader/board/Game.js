class Game {
    /**
     * Constructor for the Game class.
     * @param scene Scene.
     */
    constructor(scene) {
        this.scene = scene;
        this.gameState = GAMESTATE.NORMAL;
    }

    /**
     * Creates board.
     * @param boardElements Matrix of strings with the element's name.
     * @param components Components dictionary with the respective component.
     */
    createBoard(boardElements, components) {
        this.board = new Board(this.scene, boardElements, components);
    }

    /**
     * Sets ships.
     * @param ships Ships.
     */
    setShips(ships) {
        this.ships = ships;
        console.log(this.ships);
    }

    /**
     * Sets trade stations.
     * @param tradeStations Trade stations.
     */
    setTradeStations(tradeStations) {
        this.tradeStations = tradeStations;
    }

    /**
     * Sets colonies.
     * @param colonies Colonies.
     */
    setColonies(colonies) {
        this.colonies = colonies;
    }

    /**
     * Sets home systems.
     * @param homeSystems Home systems.
     */
    setHomeSystems(homeSystems) {
        this.homeSystems = homeSystems;
    }

    /**
     * Sets wormholes.
     * @param wormholes Wormholes.
     */
    setWormholes(wormholes) {
        this.wormholes = wormholes;
    }

    /**
     * Function called each time an hex is picked and handles the game.
     * @param pickingID
     */
    picked(pickingID) {
        let x = (pickingID - 1) % this.board.columns;
        let y = ((pickingID - 1) / this.board.columns) | 0;
        console.log('Selected position (' + x + ', ' + y + ').');
        let selectedHex = this.board.getTile(x,y);

        switch (this.gameState) {
            case GAMESTATE.NORMAL:
                for (let player = 0; player < this.ships.length; player++) {
                    for (let ship = 0; ship < this.ships[player].length; ship++) {
                        if (this.ships[player][ship][0] === x && this.ships[player][ship][1] === y) {
                            console.log('Selected ship no. ' + ship + ' of player ' + player);

                            this.selected = {
                                playerNo: player,
                                shipNo: ship,
                                shipPiece: selectedHex.getShip()
                            };

                            this.gameState = GAMESTATE.SELECTION;
                        }
                    }
                }
                break;
            case GAMESTATE.SELECTION:
                this.moveShip(x, y);
                break;
        }
    }

    moveShip(x, y) {
        let requestString = 'move(' + JSON.stringify(this.ships) + ','
            + this.selected.playerNo + ','
            + this.selected.shipNo + ','
            + JSON.stringify([x, y]) + ')';

        getPrologRequest(requestString, this, this.onShipsChanged);
    }

    onShipsChanged(context, data) {
        context.setShips(JSON.parse(data.target.response));
        context.gameState = GAMESTATE.PLACE_PIECE;
    }

    placeTradeStation() {
        let shipPosition = this.ships[this.selected.playerNo][this.selected.shipNo];

        let requestString = 'place_trade_station(' + this.selected.playerNo + ','
            + JSON.stringify(shipPosition) + ','
            + JSON.stringify(this.tradeStations) + ')';

        getPrologRequest(requestString, this, this.onTradeStationsChanged);
    }

    placeColony() {
        let shipPosition = this.ships[this.selected.playerNo][this.selected.shipNo];

        let requestString = 'place_colony(' + this.selected.playerNo + ','
            + JSON.stringify(shipPosition) + ','
            + JSON.stringify(this.colonies) + ')';

        getPrologRequest(requestString, this, this.onColoniesChanged);
    }

    onTradeStationsChanged(context, data) {
        context.setTradeStations(JSON.parse(data.target.response));
        context.gameState = GAMESTATE.NORMAL;
    }

    onColoniesChanged(context, data) {
        context.setColonies(JSON.parse(data.target.response));
        context.gameState = GAMESTATE.NORMAL;
    }
}

GAMESTATE = {
    NORMAL: 0,
    SELECTION: 1,
    PLACE_PIECE: 2
};
