class Game {
    /**
     * Constructor for the Game class.
     * @param scene Scene.
     */
    constructor() {
        this.running = false;
    }

    /**
     * Sets new game scene and resets game state. Should be called after initialization of all variables.
     * @param scene
     */
    newGame(scene, gameMode) {
        this.scene = scene;
        this.gameMode = gameMode;
        this.gameState = GAMESTATE.NORMAL;
        this.currentPlayer = 0;
        this.lastMoves = [];
    }

    /**
     * Sets the game state and runs the game.
     */
    startGame() {
        // Deep clone structures the change during the game.
        // May be used later in replay
        this.initialShips = JSON.parse(JSON.stringify(this.ships));
        this.initialTradeStations = JSON.parse(JSON.stringify(this.tradeStations));
        this.initialColonies = JSON.parse(JSON.stringify(this.colonies));


        this.running = true;
        this.lastMoveTime = Date.now();
    }

    /**
     * Creates board.
     * @param boardElements Matrix of strings with the element's name.
     * @param components Components dictionary with the respective component.
     */
    createBoard(boardElements, components) {
        this.board = new Board(this.scene, boardElements, components);
    }

    createAuxBoards(components) {
        this.colonyBoards = [
            new AuxBoard(this.scene, 16, components, PIECE_TYPE.COLONY),
            new AuxBoard(this.scene, 16, components, PIECE_TYPE.COLONY)
        ];

        this.tradeStationBoards = [
            new AuxBoard(this.scene, 4, components, PIECE_TYPE.TRADE_STATION),
            new AuxBoard(this.scene, 4, components, PIECE_TYPE.TRADE_STATION)
        ];

        this.colonyBoards[0].setPickingID(AUXBOARD_ID.P1_COLONIES);
        this.colonyBoards[1].setPickingID(AUXBOARD_ID.P2_COLONIES);

        this.tradeStationBoards[0].setPickingID(AUXBOARD_ID.P1_STATIONS);
        this.tradeStationBoards[1].setPickingID(AUXBOARD_ID.P2_STATIONS);

        this.tradeStationBoards[0].component.translate((this.board.columns / 2 + 1), 0.0, 0.0);
        this.colonyBoards[1].component.translate((this.board.columns / 2 ) * 1.9, 0.0, (this.board.rows + 2) * 1.68);
        this.tradeStationBoards[1].component.translate((this.board.columns / 2 + 2), 0.0, (this.board.rows + 2) * 1.68);
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
    setRemainingColonies(numColonies) {
        this.remainingColonies = [numColonies, numColonies];
    }

    /**
     * Sets the number of Trade Stations the players can still place on the board
     * @param numTradeStations maximum number of trade stations the players can have on the board
     */
    setRemainingTradeStations(numTradeStations) {
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
     * Returns the time since last move, in seconds.
     * @returns {number}
     */
    getTimeSinceLastPlay() {
        return 120 - (Date.now() - this.lastMoveTime) / 1000 | 0;
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
            case GAMESTATE.PLACE_SHIP:
                return 'select a tile to move the ship to.';
            case GAMESTATE.PLACE_BUILDING:
                return 'select which piece to place.';
        }
    }

    displayValidMoves(data) {
        let validDirections = JSON.parse(data.target.response);
        let initialPosition = this.ships[this.selected.playerNo][this.selected.shipNo];

        for (let direction of validDirections) {
            let position = initialPosition.slice();
            while ((position = moveInDirection(this.board.rows, this.board.columns, direction, position[0], position[1])))
                this.board.highlight(position);
        }
    }

    /**
     * Function called each time an hex is picked and handles the game.
     * @param pickingID
     */
    picked(pickingID) {
        let x = (pickingID - this.board.PICKING_OFFSET) % this.board.columns;
        let y = ((pickingID - this.board.PICKING_OFFSET) / this.board.columns) | 0;
        let selectedHex = this.board.getHex(x, y);

        switch (this.gameState) {
            case GAMESTATE.NORMAL:
                this.animationInitialX = x;
                this.animationInitialY = y;
                let playerShips = this.ships[this.currentPlayer];
                for (let ship = 0; ship < playerShips.length; ship++) {
                    if (playerShips[ship][0] === x && playerShips[ship][1] === y) {
                        this.selected = {
                            playerNo: this.currentPlayer,
                            shipNo: ship,
                            shipPiece: selectedHex.getShip()
                        };

                        this.gameState = GAMESTATE.PLACE_SHIP;
                        getValidMoves(this.board.getStringBoard(), this.ships, this.tradeStations, this.colonies, this.wormholes, [x, y], this.displayValidMoves.bind(this));
                    }
                }
                break;
            case GAMESTATE.PLACE_SHIP:
                let position = this.ships[this.currentPlayer][this.selected.shipNo];
                let play = new Play();
                play.setShipMovement(this.currentPlayer, this.selected.shipNo, [position[0], position[1]]);
                this.lastMoves.push(play);
                this.selected.shipPiece.getHex().removeShip();
                this.selected.shipPiece.setHex(selectedHex);
                selectedHex.placeShip(this.selected.shipPiece);

                moveShip(this.ships, this.selected.playerNo, this.selected.shipNo, [x, y], this.onShipsChanged.bind(this));
                this.gameState = GAMESTATE.PLACE_BUILDING;
                break;
            case GAMESTATE.PLACE_BUILDING:
                let shipPosition = this.ships[this.selected.playerNo][this.selected.shipNo];

                if (this.currentPlayer === 0) {
                    if (pickingID !== AUXBOARD_ID.P1_COLONIES && pickingID !== AUXBOARD_ID.P1_STATIONS)
                        break;

                    if (pickingID === AUXBOARD_ID.P1_COLONIES) {
                        let colony = this.colonyBoards[this.currentPlayer].getPiece();
                        this.selected.shipPiece.getHex().placeBuilding(colony);
                        placeColony(this.colonies, this.selected.playerNo, this.selected.shipNo, [shipPosition[0], shipPosition[1]], this.onColoniesChanged.bind(this))
                    }
                    else {
                        let tradeStation = this.tradeStationBoards[this.currentPlayer].getPiece();
                        this.selected.shipPiece.getHex().placeBuilding(tradeStation);
                        placeTradeStation(this.tradeStations, this.selected.playerNo, this.selected.shipNo, [shipPosition[0], shipPosition[1]], this.onTradeStationsChanged.bind(this))
                    }
                }
                else {
                    if (pickingID !== AUXBOARD_ID.P2_COLONIES && pickingID !== AUXBOARD_ID.P2_STATIONS)
                        break;

                    if (pickingID === AUXBOARD_ID.P2_COLONIES) {
                        let colony = this.colonyBoards[this.currentPlayer].getPiece();
                        this.selected.shipPiece.getHex().placeBuilding(colony);
                        placeColony(this.colonies, this.selected.playerNo, this.selected.shipNo, [shipPosition[0], shipPosition[1]], this.onColoniesChanged.bind(this))
                    }
                    else {
                        let tradeStation = this.tradeStationBoards[this.currentPlayer].getPiece();
                        this.selected.shipPiece.getHex().placeBuilding(tradeStation);
                        placeTradeStation(this.tradeStations, this.selected.playerNo, this.selected.shipNo, [shipPosition[0], shipPosition[1]], this.onTradeStationsChanged.bind(this))
                    }

                }
                this.gameState = GAMESTATE.NORMAL;
                break;
        }
    }

    /**
     * Changes the game back to normal game state.
     */
    cancelMode() {
        if (this.gameState !== GAMESTATE.PLACE_BUILDING) {
            this.gameState = GAMESTATE.NORMAL;
            this.board.resetHighlighting();
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

            switch (lastMove.pieceType) {
                case PIECE_TYPE.TRADE_STATION:
                    this.tradeStationBoards[lastMove.playerNo].putPiece();
                    this.tradeStations[lastMove.playerNo].pop();
                    break;
                case PIECE_TYPE.COLONY:
                    this.colonyBoards[lastMove.playerNo].putPiece();
                    this.colonies[lastMove.playerNo].pop();
                    break;
                default:
                    break;
            }

            previousHex.placeShip(currentHex.getShip());
            currentHex.removeShip();
            currentHex.removeBuilding();
        }

        this.previousPlayer();
    }

    /**
     * Callback when ships have been moved.
     * @param data Response
     */
    onShipsChanged(data) {
        this.setShips(JSON.parse(data.target.response));
        this.gameState = GAMESTATE.PLACE_BUILDING;
        this.board.resetHighlighting();
    }


    /**
     * Callback when trade stations have been placed.
     * @param data Response
     */
    onTradeStationsChanged(data) {
        this.setTradeStations(JSON.parse(data.target.response));
        this.gameState = GAMESTATE.NORMAL;
        this.selected = null;
        this.nextPlayer();

        let buildingPosition = this.tradeStations[this.currentPlayer][this.tradeStations.length - 1];
        this.lastMoves[this.lastMoves.length - 1].setBuildingPlacement(PIECE_TYPE.TRADE_STATION, this.tradeStations.length - 1, buildingPosition);

        if (this.onScoreCanChange)
            this.onScoreCanChange();
    }

    /**
     * Callback when colonies have been changed.
     * @param data Response
     */
    onColoniesChanged(data) {
        this.setColonies(JSON.parse(data.target.response));
        this.gameState = GAMESTATE.NORMAL;
        this.selected = null;
        this.nextPlayer();

        let buildingPosition = this.colonies[this.currentPlayer][this.colonies.length - 1];
        this.lastMoves[this.lastMoves.length - 1].setBuildingPlacement(PIECE_TYPE.COLONY, this.colonies.length - 1, buildingPosition);

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
            this.board.resetHighlighting();
            this.nextPlayer();
        }
    }
}

GAMESTATE = {
    NORMAL: 0,
    PLACE_SHIP: 1,
    PLACE_BUILDING: 2
};

AUXBOARD_ID = {
    P1_COLONIES: 1,
    P1_STATIONS: 2,
    P2_COLONIES: 3,
    P2_STATIONS: 4
};
