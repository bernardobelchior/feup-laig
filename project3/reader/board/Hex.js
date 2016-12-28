function Hex(scene, component, visibilityIndex, y) {
    this.scene = scene;
    this.component = new Component(this.scene, 'wrapper');

    this.component.inheritMaterial = true;
    this.component.texture = 'inherit';
    this.component.addChild(component);

    this.piecesWrapper = new Component(this.scene, "piecesWrapper");
    this.piecesWrapper.inheritMaterial = true;
    this.piecesWrapper.texture = "inherit";
    this.component.addChild(this.piecesWrapper);

    this.ship = null;
    this.building = null;

    this.scene.rootNode.addChild(this.component);
    this.transform(visibilityIndex, y);
}

Hex.prototype = Object.create(Object.prototype);
Hex.prototype.constructor = Hex;

Hex.prototype.transform = function (visibilityIndex, y) {
    this.component.translate(1.9 * visibilityIndex, 0, 1.68 * y);
    this.component.translate(1 * y % 2, 0, 0);
};

Hex.prototype.setPickingID = function (pickingID) {
    this.component.setPickingID(pickingID);
};

Hex.prototype.placeShip = function (piece) {
    //console.log(this.ship);
    if (this.ship !== null)
        return;

    this.ship = piece;
    this.piecesWrapper.addChild(piece.component);
};

Hex.prototype.removeShip = function () {
    if (this.ship === null) {
        console.log("Hex has no piece!");
        return;
    }

    this.piecesWrapper.removeChild(this.ship.component);
    this.ship = null;
};

Hex.prototype.getShip = function () {
    return this.ship;
};

Hex.prototype.placeBuilding = function (piece) {
    if (this.building !== null)
        return;

    this.building = piece;
    this.piecesWrapper.addChild(piece.component);
    this.piecesWrapper.translate(0.0,0.5,0.0);
};

Hex.prototype.removeBuilding = function () {
    if (this.building === null)
        return;

    this.piecesWrapper.removeChild(this.building.component);
    this.building = null;
};

Hex.prototype.getBuilding = function () {
    return this.building;
};
