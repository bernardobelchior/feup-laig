class Game {
    /**
     * Constructor for the Game class.
     * @param scene Scene.
     */
    constructor() {
        this.running = false;
    }

    /**
     * Sets new game scene and resets game state.
     * @param scene
     */
    newGame(scene) {
        this.scene = scene;
        this.gameState = GAMESTATE.NORMAL;
        this.running = true;
        this.currentPlayer = 0;
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
     * Places the ships on the board for the first time setup
     * @param ships
     */
    initializeShips(ships, components) {

        for (let player of ships) {
            for (let ship of player) {
                let x = ship[0];
                let y = ship[1];

                let selectedHex = this.board.getHex(x, y);
                let playerShipComponent = components['ship'].component;

                let playerShip = new Piece(this.scene, playerShipComponent, selectedHex);
                selectedHex.placeShip(playerShip);
            }
        }
        this.setShips(ships);

    }

    /**
     * Sets ships.
     * @param ships Ships.
     */
    setShips(ships) {
        this.ships = ships;
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
     * Sets the number of colonies the players can still place on the board
     * @param numColonies maximum number of colonies the players can have on the board
     */
    setRemainingColonies(numColonies){
        this.remainingColonies = [numColonies, numColonies];
    }

    /**
     * Sets the number of Trade Stations the plaers can still place on the board
     * @param numTradeStations maximum number of trade stations the players can have on the board
     */
    setRemainingTradeStations(numTradeStations){
        this.remainingTradeStations = [numTradeStations, numTradeStations];
    }

    /**
     * Returns if the game is running.
     * @returns {boolean} Whether the game is running or not.
     */
    isRunning() {
        return this.running;
    }

    /**
     * Gets the current player.
     * @returns {number} Returns the current player, index based on 0.
     */
    getCurrentPlayer() {
        return this.currentPlayer;
    }

    /**
     * Returns the player score
     * @param index Player index, 0-based.
     * @returns {number} Score
     */
    getPlayerScore(index) {
        //TODO: calculate score

        return this.currentPlayer;
    }

    /**
     *  Returns instruction based on the current game state.
     * @returns {string} Instruction
     */
    getGameStateInstruction() {
        switch (this.gameState) {
            case GAMESTATE.NORMAL:
                return 'select a ship to move.';
            case GAMESTATE.PLACE_SHIP:
                return 'select a tile to move the ship to.';
            case GAMESTATE.PLACE_BUILDING:
                return 'select which piece to place.';
        }
    }

    /**
     * Function called each time an hex is picked and handles the game.
     * @param pickingID
     */
    picked(pickingID) {
        let x = (pickingID - 1) % this.board.columns;
        let y = ((pickingID - 1) / this.board.columns) | 0;
        console.log('Selected position (' + x + ', ' + y + ').');
        let selectedHex = this.board.getHex(x, y);

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

                            this.gameState = GAMESTATE.PLACE_SHIP;
                        }
                    }
                }
                break;
            case GAMESTATE.PLACE_SHIP:
                this.selected.shipPiece.getHex().removeShip();
                this.selected.shipPiece.setHex(selectedHex);
                selectedHex.placeShip(this.selected.shipPiece);
                moveShip(this.ships, this.selected.playerNo, this.selected.shipNo, [x, y], this.onShipsChanged.bind(this));
                this.gameState = GAMESTATE.PLACE_BUILDING;
                break;

            case GAMESTATE.PLACE_BUILDING:
               break;
        }
    }

    /**
     * Changes the game back to normal game state.
     */
    cancelMode() {
        if (this.gameState !== GAMESTATE.PLACE_BUILDING) {
            this.gameState = GAMESTATE.NORMAL;
            this.selected = null;
        }
    }

    /**
     * Function called to undo last play.
     */
    undo() {
        //TODO
    }

    /**
     * Callback when ships have been moved.
     * @param context This game
     * @param data Response
     */
    onShipsChanged(data) {
        this.setShips(JSON.parse(data.target.response));
        //this.gameState = GAMESTATE.PLACE_BUILDING;
        this.gameState = GAMESTATE.NORMAL;
        this.currentPlayer = (this.currentPlayer + 1) % 2;
    }


    /**
     * Callback when trade stations have been placed.
     * @param context This game
     * @param data Response
     */
    onTradeStationsChanged(data) {
        this.setTradeStations(JSON.parse(data.target.response));
        this.gameState = GAMESTATE.NORMAL;
        this.selected = null;
    }

    /**
     * Callback when colonies have been changed.
     * @param context This game
     * @param data Response
     */
    onColoniesChanged(data) {
        this.setColonies(JSON.parse(data.target.response));
        this.gameState = GAMESTATE.NORMAL;
        this.selected = null;
    }
}

GAMESTATE = {
    NORMAL: 0,
    PLACE_SHIP: 1,
    PLACE_BUILDING: 2
};
