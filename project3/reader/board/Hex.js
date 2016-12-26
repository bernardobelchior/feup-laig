function Hex(scene, component, visibilityIndex, y) {
    this.scene = scene;
    this.component = new Component(this.scene, 'wrapper');

    this.component.inheritMaterial = true;
    this.component.texture = 'inherit';
    this.component.addChild(component);

    this.ship = null;
    this.building = null;

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
    this.component.setPickingID(pickingID);
};

Hex.prototype.placeShip = function(piece){
    if(this.ship !== null){
        console.log("Hex already has a piece!");
        return;
    }

    this.ship = piece;
    this.component.addChild(piece);
};

Hex.prototype.removeShip = function(){
    if(this.ship === null) {
        console.log("Hex has no piece!");
        return;
    }

    this.component.removeChild(this.ship);
    this.ship = null;
};

Hex.prototype.getShip = function(){
    if(this.ship === null) {
        console.log("Hex has no piece!");
    }

    return this.ship;
}

Hex.prototype.placeBuilding = function(piece){
    if(this.building !== null){
        console.log("Hex already has a building!");
        return;
    }

    this.building = piece;
    this.component.addChild(piece);
};

Hex.prototype.removeBuilding = function(){
    if(this.building === null) {
        console.log("Hex has no building!");
        return;
    }

    this.component.removeChild(this.building);
    this.building = null;
};

Hex.prototype.getBuilding = function(){
    if(this.building === null) {
        console.log("Hex has no building!");
    }

    return this.building;
}
