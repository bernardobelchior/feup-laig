function Hex(scene, component, visibilityIndex, y) {
    this.scene = scene;
    this.component = new Component(this.scene, 'wrapper');

    this.component.inheritMaterial = true;
    this.component.texture = 'inherit';
    this.component.addChild(component);

    this.piece = null;

    this.scene.rootNode.addChild(this.component);
    this.transform(visibilityIndex, y);
    //this.component.updateTextures(this.scene.graph.textures);
}

Hex.prototype = Object.create(Object.prototype);
Hex.prototype.constructor = Hex;

Hex.prototype.transform = function (visibilityIndex, y) {
    this.component.translate(1.9*visibilityIndex, 0, 1.68*y);
    this.component.translate(1 * y%2, 0, 0);
};

Hex.prototype.setPickingID = function (pickingID) {
    console.log('Setting picking ID ' + pickingID);
    this.component.setPickingID(pickingID);
};

Hex.prototype.placePiece = function(piece){
    if(this.piece !== null){
        console.log("Hex already has a piece!");
        return;
    }

    this.piece = piece;
    this.component.addChild(piece);
};

Hex.prototype.removePiece = function(){
    if(this.piece === null) {
        console.log("Hex has no piece!");
        return;
    }

    this.component.removeChild(this.piece);
    this.piece = null;
};

Hex.prototype.getPiece = function(){
    if(this.piece === null) {
        console.log("Hex has no piece!");
        return;
    }

    return this.piece;
}
