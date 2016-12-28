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
    newGame(scene, gameMode) {
        this.scene = scene;
        this.gameMode = gameMode;
        this.gameState = GAMESTATE.NORMAL;
        this.running = true;
        this.currentPlayer = 0;
        this.lastMoveTime = Date.now();
        this.lastMoves = [];
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
     * Returns the time since last move, in seconds.
     * @returns {number}
     */
    getTimeSinceLastPlay() {
        return 10 - (Date.now() - this.lastMoveTime) / 1000 | 0;
    }

    /**
     * Sets up callback to call when the score may have changed.
     * @param {function} callback Function to call when the score may have changed.
     */
    addOnScoreCanChange(callback) {
        this.onScoreCanChange = callback;
    }

    /**
     * Sets up callback to call when the current player has changed.
     * @param callback Function to call when the player changes.
     */
    addOnPlayerChanged(callback) {
        this.onPlayerChanged = callback;
    }

    /**
     *  Returns instruction based on the current game state.
     * @returns {string} Instruction
     */
    getGameStateInstruction() {
        switch (this.gameState) {
            case GAMESTATE.NORMAL:
                return 'select a ship to move.';
            case GAMESTATE.SELECTION:
                return 'select a tile to move the ship to.';
            case GAMESTATE.PLACE_PIECE:
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
        let selectedHex = this.board.getHex(x, y);

        switch (this.gameState) {
            case GAMESTATE.NORMAL:
                let playerShips = this.ships[this.currentPlayer];
                for (let ship = 0; ship < playerShips.length; ship++) {
                    if (playerShips[ship][0] === x && playerShips[ship][1] === y) {
                        this.selected = {
                            playerNo: this.currentPlayer,
                            shipNo: ship,
                            shipPiece: selectedHex.getShip()
                        };

                        this.gameState = GAMESTATE.SELECTION;
                    }
                }
                break;
            case GAMESTATE.SELECTION:
                let position = this.ships[this.currentPlayer][this.selected.shipNo];
                let play = new Play();
                play.setPlay(this.currentPlayer, this.selected.shipNo, [position[0], position[1]]);
                this.lastMoves.push(play);

                this.selected.shipPiece.getHex().removeShip();
                this.selected.shipPiece.setHex(selectedHex);
                selectedHex.placeShip(this.selected.shipPiece);

                moveShip(this.ships, this.selected.playerNo, this.selected.shipNo, [x, y], this.onShipsChanged.bind(this));
                break;
        }
    }

    /**
     * Changes the game back to normal game state.
     */
    cancelMode() {
        if (this.gameState !== GAMESTATE.PLACE_PIECE) {
            this.gameState = GAMESTATE.NORMAL;
            this.selected = null;
        }
    }

    /**
     * Function called to undo last play.
     */
    undo() {
        if (!this.running || !this.lastMoves.length)
            return;

        let lastMove = this.lastMoves.pop();

        if (lastMove.wasPlayed()) {
            let currentShipPosition = this.ships[lastMove.playerNo][lastMove.shipNo];
            let currentHex = this.board.getHex(currentShipPosition[0], currentShipPosition[1]);

            this.ships[lastMove.playerNo][lastMove.shipNo][0] = lastMove.oldShipPosition[0];
            this.ships[lastMove.playerNo][lastMove.shipNo][1] = lastMove.oldShipPosition[1];

            let previousHex = this.board.getHex(lastMove.oldShipPosition[0], lastMove.oldShipPosition[1]);

            previousHex.placeShip(currentHex.getShip());
            currentHex.removeShip();
        }

        this.previousPlayer();
    }

    /**
     * Callback when ships have been moved.
     * @param context This game
     * @param data Response
     */
    onShipsChanged(data) {
        this.setShips(JSON.parse(data.target.response));
        //this.gameState = GAMESTATE.PLACE_PIECE;
        this.gameState = GAMESTATE.NORMAL;
        this.nextPlayer();

        //TODO: remove when user can place buildings
        if (this.onScoreCanChange)
            this.onScoreCanChange();
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
        this.nextPlayer();

        if (this.onScoreCanChange)
            this.onScoreCanChange();
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
        this.nextPlayer();

        if (this.onScoreCanChange)
            this.onScoreCanChange();
    }

    /**
     * Selects previous player and calls the respective event handler.
     */
    previousPlayer() {
        this.currentPlayer = (this.currentPlayer - 1) % 2;
        this.lastMoveTime = Date.now();

        if (this.onPlayerChanged)
            this.onPlayerChanged();
    }

    /**
     * Selects next player and calls the respective event handler.
     */
    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        this.lastMoveTime = Date.now();

        if (this.onPlayerChanged)
            this.onPlayerChanged();
    }

    /**
     * Updates the game state.
     * @param deltaTime Delta time since last update.
     */
    update(deltaTime) {
        if (this.getTimeSinceLastPlay() <= 0) {
            this.lastMoves.push(new Play());
            this.nextPlayer();
        }
    }
}

GAMESTATE = {
    NORMAL: 0,
    SELECTION: 1,
    PLACE_PIECE: 2
};
