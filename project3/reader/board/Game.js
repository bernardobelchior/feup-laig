class Game {
    constructor(scene) {
        this.scene = scene;
    }

    createBoard(boardElements, components) {
        this.board = new Board(this.scene, boardElements, components);
    }

    setShips(ships) {
        this.ships = ships;
    }

    setTradeStations(tradeStations) {
        this.tradeStations = tradeStations;
    }

    setColonies(colonies) {
        this.colonies = colonies;
    }

    setHomeSystems(homeSystems) {
        this.homeSystems = homeSystems;
    }

    setWormholes(wormholes) {
        this.wormholes = wormholes;
    }

    picked(pickingID) {
        let x = (pickingID-1) % this.board.columns;
        let y = ((pickingID-1) / this.board.columns) | 0;

        console.log('Selected position (' + x + ', ' + y + ').');
    }
}
