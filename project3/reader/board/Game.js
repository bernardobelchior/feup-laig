class Game {
    /**
     * Constructor for the Game class.
     * @param scene Scene.
     */
    constructor() {
        this.running = false;
        this.moveTime = 120;
    }

    /**
     * Sets new game scene and resets game state. Should be called after initialization of all variables.
     * @param scene
     * @param gameMode
     */
    newGame(scene, gameMode) {
        this.running = false;
        this.scene = scene;
        this.gameMode = gameMode;
        this.currentPlayer = 0;
        this.botIsPlaying = false;
        this.lastMoves = [];
        this.botDifficulty = [BOT_DIFFICULTY.EASY, BOT_DIFFICULTY.EASY];
    }

    /**
     * Sets the game state and runs the game.
     */
    startGame() {
        this.initialShips = JSON.parse(JSON.stringify(this.ships));

        /* Needed in order to use === afterwards.
         * For some reason, the value from the interface has not the correct type
         * (Even though it is initialized with the GAMEMODE object/enum) */
        if (this.gameMode == GAMEMODE.CPU_VS_CPU) {
            this.gameMode = GAMEMODE.CPU_VS_CPU;
            this.gameState = GAMESTATE.BOT_PLAY;
        } else {
            if (this.gameMode == GAMEMODE.HUMAN_VS_CPU)
                this.gameMode = GAMEMODE.HUMAN_VS_CPU;
            else
                this.gameMode = GAMEMODE.CPU_VS_CPU;
            this.gameState = GAMESTATE.NORMAL;
        }

        this.running = true;
        this.timeSinceLastPlay = 0;
        this.fullGameTime = 0;
    }

    /**
     * Creates board.
     * @param boardElements Matrix of strings with the element's name.
     * @param components Components dictionary with the respective component.
     */
    createBoard(boardElements, components) {
        this.board = new Board(this.scene, boardElements, components);
        this.components = components;
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
                let playerShipComponent = this.components['ship'].component;

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
        return this.moveTime - this.timeSinceLastPlay | 0;
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

    /**
     * Displays valid moves.
     * @param data response.
     */
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
                play.setShipMovement(this.currentPlayer, this.selected.shipNo, [position[0], position[1]], [x, y]);
                this.lastMoves.push(play);

                moveShip(this.ships, this.selected.playerNo, this.selected.shipNo, [x, y], this.onShipsChanged.bind(this));
                this.selected.shipPiece.move(selectedHex);
                break;
            case GAMESTATE.PLACE_BUILDING:
                if (this.selected.shipPiece.animation)
                    return;
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
        if (this.gameState === GAMESTATE.PLACE_SHIP) {
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
        this.selected = null;
        this.nextPlayer();

        this.lastMoves[this.lastMoves.length - 1].setBuildingPlacement(PIECE_TYPE.TRADE_STATION, this.tradeStations.length - 1);

        if (this.onScoreCanChange)
            this.onScoreCanChange();
    }

    /**
     * Callback when colonies have been changed.
     * @param data Response
     */
    onColoniesChanged(data) {
        this.setColonies(JSON.parse(data.target.response));
        this.selected = null;
        this.nextPlayer();

        this.lastMoves[this.lastMoves.length - 1].setBuildingPlacement(PIECE_TYPE.COLONY, this.colonies.length - 1);

        if (this.onScoreCanChange)
            this.onScoreCanChange();
    }

    /**
     * Selects previous player and calls the respective event handler.
     */
    previousPlayer() {
        this.currentPlayer = (this.currentPlayer - 1) % 2;
        this.updateGameState();
        this.fullGameTime -= this.timeSinceLastPlay;
        this.timeSinceLastPlay = 0;

        if (this.replayPending)
            this.startReplay();
        else if (this.onPlayerChanged)
            this.onPlayerChanged();
    }

    /**
     * Updates the game state based on the game mode.
     */
    updateGameState() {
        switch (this.gameMode) {
            case GAMEMODE.HUMAN_VS_HUMAN:
                this.gameState = GAMESTATE.NORMAL;
                break;
            case GAMEMODE.HUMAN_VS_CPU:
                if (this.currentPlayer === 1)
                    this.gameState = GAMESTATE.BOT_PLAY;
                else
                    this.gameState = GAMESTATE.NORMAL;
                break;
            case GAMEMODE.CPU_VS_CPU:
                this.gameState = GAMESTATE.BOT_PLAY;
                break;
        }
    }

    /**
     * Selects next player and calls the respective event handler.
     */
    nextPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % 2;
        this.updateGameState();
        this.fullGameTime += this.timeSinceLastPlay;
        this.timeSinceLastPlay = 0;

        if (this.replayPending)
            this.startReplay();
        else if (this.onPlayerChanged)
            this.onPlayerChanged();
    }

    /**
     * Updates the game state.
     * @param deltaTime Delta time since last update.
     */
    update(deltaTime) {
        if (!this.running)
            return;

        if (this.getTimeSinceLastPlay() < 0) {
            this.lastMoves.push(new Play());
            this.board.resetHighlighting();
            this.nextPlayer();
        }

        if (this.gameState !== GAMESTATE.REPLAY)
            this.timeSinceLastPlay += deltaTime / 1000;

        if (this.gameState === GAMESTATE.BOT_PLAY && !this.botIsPlaying) {
            this.botIsPlaying = true;
            window.setTimeout(this.botPlay.bind(this), 3000);
        }
    }

    /**
     * Function that executes the request to make the bot play.
     */
    botPlay() {
        this.lastMoves.push(new Play());

        if (this.botDifficulty[this.currentPlayer] === BOT_DIFFICULTY.EASY)
            easyCPUMove(this.board.getStringBoard(), this.ships, this.tradeStations, this.colonies, this.wormholes, this.currentPlayer, this.botMoved.bind(this));
        else
            hardCPUMove(this.board.getStringBoard(), this.ships, this.tradeStations, this.colonies, this.wormholes, this.currentPlayer, this.botMoved.bind(this));
    }

    /**
     * Function called when the bot has moved its ships.
     * @param data Ship movement request response.
     */
    botMoved(data) {
        let response = JSON.parse(data.target.response);

        let newShips = response[0];
        let shipMoved = response[1];

        let oldPosition = this.ships[this.currentPlayer][shipMoved];
        let newPosition = newShips[this.currentPlayer][shipMoved];

        let destinationHex = this.board.getHex(newPosition[0], newPosition[1]);
        this.lastMoves[this.lastMoves.length - 1].setShipMovement(this.currentPlayer, shipMoved, oldPosition, newPosition);
        this.board.getHex(oldPosition[0], oldPosition[1]).getShip().move(destinationHex);

        this.ships = newShips;

        if (this.botDifficulty[this.currentPlayer] === BOT_DIFFICULTY.EASY)
            easyCPUPlaceBuilding(this.ships, this.currentPlayer, shipMoved, this.tradeStations, this.colonies, this.botPlacedBuilding.bind(this, newPosition));
        else
            hardCPUPlaceBuilding(this.ships, this.currentPlayer, shipMoved, this.tradeStations, this.colonies, this.botPlacedBuilding.bind(this, newPosition));
    }

    /**
     * Function called when the bot has moved its ship and needs to select an action.
     * @param data Action choice request response.
     */
    botPlacedBuilding(shipPosition, data) {
        let response = JSON.parse(data.target.response);

        let newTradeStations = response[0];
        let newColonies = response[1];

        let lastMove = this.lastMoves[this.lastMoves.length - 1];
        let building;

        if (newTradeStations[this.currentPlayer].length !== this.tradeStations[this.currentPlayer].length) {
            lastMove.setBuildingPlacement(PIECE_TYPE.TRADE_STATION, this.tradeStations[this.currentPlayer].length);
            building = this.tradeStationBoards[this.currentPlayer].getPiece();
        }
        else {
            lastMove.setBuildingPlacement(PIECE_TYPE.COLONY, this.colonies[this.currentPlayer].length);
            building = this.colonyBoards[this.currentPlayer].getPiece();
        }

        if (building)
            this.board.getHex(shipPosition[0], shipPosition[1]).placeBuilding(building);

        this.tradeStations = newTradeStations;
        this.colonies = newColonies;


        window.setTimeout(this.botFinishedPlay.bind(this), 2500);
    }

    /**
     * Function called when the bot has finished its play.
     */
    botFinishedPlay() {
        this.botIsPlaying = false;
        this.nextPlayer();

        if (this.onScoreCanChange)
            this.onScoreCanChange();
    }

    /**
     * Sets the replay pending flag to true.
     */
    askForReplay() {
        this.replayPending = true;
    }

    /**
     * Function called to replay the game.
     */
    startReplay() {
        if (!this.running || !this.lastMoves.length || this.gameState === GAMESTATE.REPLAY)
            return;

        this.replayShips = JSON.parse(JSON.stringify(this.initialShips));
        this.replayTradeStationBoards = [
            new AuxBoard(this.scene, 4, this.components, PIECE_TYPE.TRADE_STATION),
            new AuxBoard(this.scene, 4, this.components, PIECE_TYPE.TRADE_STATION)
        ];

        this.replayColonyBoards = [
            new AuxBoard(this.scene, 16, this.components, PIECE_TYPE.COLONY),
            new AuxBoard(this.scene, 16, this.components, PIECE_TYPE.COLONY)
        ];

        this.board.resetHexes();
        for (let player of this.replayShips) {
            for (let ship of player) {
                let selectedHex = this.board.getHex(ship[0], ship[1]);
                let playerShipComponent = this.components['ship'].component;

                let playerShip = new Piece(this.scene, playerShipComponent, selectedHex);
                selectedHex.placeShip(playerShip);
            }
        }

        this.gameState = GAMESTATE.REPLAY;
        if (this.currentPlayer === 0) {
            this.scene.nextCamera();
            window.setTimeout(this.replayMove.bind(this, 0), 1500);
        } else
            this.replayMove(0);
    }

    /**
     * Replays the move with the given index
     * @param index Play index
     */
    replayMove(index) {
        let move = this.lastMoves[index];

        if (!move) {
            if (this.lastMoves[this.lastMoves.length - 1].playerNo !== this.currentPlayer)
                this.scene.nextCamera();

            this.initializeShips(this.ships, this.components);
            this.replayPending = false;
            this.nextPlayer();
            return;
        }

        this.replayShips[move.playerNo][move.shipNo] = move.newShipPosition;
        let selectedHex = this.board.getHex(move.newShipPosition[0], move.newShipPosition[1]);
        this.board.getHex(move.oldShipPosition[0], move.oldShipPosition[1]).getShip().move(selectedHex);

        window.setTimeout(this.replayBuildingPlacement.bind(this), 1000, index);
    }

    /**
     * Replays the building placement with the given index.
     * @param index Play index
     */
    replayBuildingPlacement(index) {
        let move = this.lastMoves[index];

        let piece;
        if (move.pieceType === PIECE_TYPE.TRADE_STATION)
            piece = this.replayTradeStationBoards[move.playerNo].getPiece();
        else
            piece = this.replayColonyBoards[move.playerNo].getPiece();

        this.board.getHex(move.newShipPosition[0], move.newShipPosition[1]).placeBuilding(piece);

        if (index !== this.lastMoves.length - 1)
            this.scene.nextCamera();

        window.setTimeout(this.replayMove.bind(this), 2000, index + 1);
    }

    getTimeElapsed() {
        return this.fullGameTime + this.timeSinceLastPlay | 0;
    }

    setBotDifficulty(first, second) {
        this.botDifficulty[0] = first;
        this.botDifficulty[1] = second;
    }
}

GAMESTATE = {
    NORMAL: 0,
    PLACE_SHIP: 1,
    PLACE_BUILDING: 2,
    GAME_OVER: 3,
    BOT_PLAY: 4,
    REPLAY: 5
};

GAMEMODE = {
    HUMAN_VS_HUMAN: 0,
    HUMAN_VS_CPU: 1,
    CPU_VS_CPU: 2
};

AUXBOARD_ID = {
    P1_COLONIES: 1,
    P1_STATIONS: 2,
    P2_COLONIES: 3,
    P2_STATIONS: 4
};

BOT_DIFFICULTY = {
    EASY: 0,
    HARD: 1
};
