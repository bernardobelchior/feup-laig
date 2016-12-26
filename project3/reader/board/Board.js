function Board(scene, boardElements, components) {
    this.scene = scene;
    this.board = [];
    this.rows = boardElements.length;
    this.columns = boardElements[0].length;

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
                if(hex !== 'space')
                    tile.setPickingID(y * this.columns + x + 1); // +1 because picking ID must begin at 1
            }

            this.board[y].push(tile);
        }
    }
}

Board.prototype = Object.create(Object.prototype);
Board.prototype.constructor = Board;
