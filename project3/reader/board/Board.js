function Board(scene, boardElements, components){
    this.scene = scene;
    this.board = [];

    let i = 0;
    for (let row of boardElements){
        this.board[i] = [];
        for(let hex of row){
            if(!!components[hex]){
                let newHex = new Hex(scene);
                newHex.setComponent(components[hex].component);
                this.board[i].push(newHex);
                console.log(this.board[i]);
                // console.log(this.board);
                // return;
            }
        }
        i++;
    }
    console.log(this.board);
}

Board.prototype = Object.create(Object.prototype);
Board.prototype.constructor = Board;

Board.prototype.display = function(){
    this.scene.pushMatrix();
    for (let i = 0; i < this.board.length; i++){
        let row = this.board[i];
        if(i == this.board.length - 1)
            this.scene.translate(5 * 0.89,0,1.54);
        else if(i % 2 == 0)
            this.scene.translate(-0.91,0,1.54);
        else
            this.scene.translate(0.91,0,1.54);
        this.scene.pushMatrix();
        for(let hex of row){
            this.scene.translate(1.77,0,0);
            hex.display();
            // console.log(hex);
        }
        this.scene.popMatrix();
    }
    this.scene.popMatrix();
};
