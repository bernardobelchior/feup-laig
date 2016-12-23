function Board(scene, boardElements, components) {
    this.scene = scene;
    this.board = [];

    for (let y = 0; y < boardElements.length; y++) {
        this.board.push([]);

        // Indicates the visual horizontal index of the tile.
        // Null hexes do not increment this.
        let visibilityIndex = 0;

        for (let x = 0; x < boardElements[y].length; x++) {
            let hex = boardElements[y][x];

            let tile = new Hex(scene, components[hex].component, visibilityIndex, y);

            if(hex !== 'null')
                visibilityIndex++;

            this.board[y].push(tile);
        }
    }
}

Board.prototype = Object.create(Object.prototype);
Board.prototype.constructor = Board;

Board.prototype.display = function () {
    this.scene.pushMatrix();

    for (let i = 0; i < this.board.length; i++) {
        let row = this.board[i];
        if (i == this.board.length - 1)
            this.scene.translate(5 * 0.89, 0, 1.54);
        else if (i % 2 == 0)
            this.scene.translate(-0.91, 0, 1.54);
        else
            this.scene.translate(0.91, 0, 1.54);
        this.scene.pushMatrix();
        for (let hex of row) {
            this.scene.translate(1.77, 0, 0);
            hex.display(this.scene.rootNode);
        }
        this.scene.popMatrix();
    }

    this.scene.popMatrix();
};
