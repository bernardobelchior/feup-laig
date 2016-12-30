/**
 * Board class
 * @param scene Scene
 * @param boardElements String with board elements
 * @param components Components
 * @constructor
 */
function Board(scene, boardElements, components) {
    this.scene = scene;
    this.board = [];
    this.boardElements = boardElements;
    this.rows = boardElements.length;
    this.columns = boardElements[0].length;

    this.PICKING_OFFSET = 5;

    for (let y = 0; y < this.rows; y++) {
        this.board.push([]);

        // Indicates the visual horizontal index of the tile.
        // Null hexes do not increment this.
        let visibilityIndex = 0;

        for (let x = 0; x < this.columns; x++) {
            let hex = boardElements[y][x];

            let tile = new Hex(scene, components[hex].component, visibilityIndex, y);
            tile.name = hex;

            if (hex !== 'null') {
                visibilityIndex++;
                if (hex !== 'space')
                    tile.setPickingID(y * this.columns + x + this.PICKING_OFFSET); // +1 because picking ID must begin at 1

            }

            this.board[y].push(tile);
        }
    }
}

Board.prototype = Object.create(Object.prototype);
Board.prototype.constructor = Board;

/**
 * Board picking handler
 * @param pickingID Picking ID.
 */
Board.prototype.picked = function (pickingID) {
    let x = (pickingID - this.PICKING_OFFSET) % this.columns;
    let y = ((pickingID - this.PICKING_OFFSET) / this.columns) | 0;

    console.log('Selected position (' + x + ', ' + y + ').');
    console.log('Selected: ' + this.board[y][x].name);
};

/**
 * Gets hex from x,y
 * @param x X
 * @param y Y
 * @returns Hex
 */
Board.prototype.getHex = function (x, y) {
    if (x >= this.columns || y >= this.rows) {
        console.log("Invalid Position: " + x + ", " + y);
        return;
    }

    return this.board[y][x];
};

/**
 * Gets the string board.
 * @returns String board.
 */
Board.prototype.getStringBoard = function () {
    return this.boardElements;
};

/**
 * Highlights the hex in the given position
 * @param position Array of x,y
 */
Board.prototype.highlight = function (position) {
    this.board[position[1]][position[0]].highlight();
};

/**
 * Resets highlighting in all hexes.
 */
Board.prototype.resetHighlighting = function () {
    for (let row of this.board) {
        for (let hex of row) {
            hex.resetHighlighting();
        }
    }
};

/**
 * Visually deletes hex information.
 */
Board.prototype.resetHexes = function () {
    for (let row of this.board)
        for (let hex of row) {
            hex.removeShip();
            hex.removeBuilding();
        }
};