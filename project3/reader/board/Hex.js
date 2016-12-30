function Hex(scene, component, visibilityIndex, y) {
    this.scene = scene;
    this.component = new Component(this.scene, 'wrapper');
    this.x = 1.9 * visibilityIndex + 1 * y % 2;
    this.z = 1.68 * y;

    this.component.materials.push(this.scene.graph.materials['default_tile']);
    this.component.materials.push(this.scene.graph.materials['highlighted_tile']);
    this.component.texture = 'inherit';
    this.component.addChild(component);

    this.piecesWrapper = new Component(this.scene, "piecesWrapper");
    this.piecesWrapper.inheritMaterial = true;
    this.piecesWrapper.texture = "inherit";
    this.piecesWrapper.translate(0.0, 0.5, 0.0);
    this.component.addChild(this.piecesWrapper);

    this.ship = null;
    this.building = null;

    this.scene.rootNode.addChild(this.component);
    this.component.updateTextures(this.scene.graph.textures);
    this.transform();
}

Hex.prototype = Object.create(Object.prototype);
Hex.prototype.constructor = Hex;

Hex.prototype.transform = function () {
    this.component.translate(this.x, 0, this.z);
};

Hex.prototype.setPickingID = function (pickingID) {
    this.component.setPickingID(pickingID);
};

Hex.prototype.placeShip = function (piece) {
    if (this.ship !== null)
        return;

    this.ship = piece;
    this.piecesWrapper.addChild(this.ship.component);
    this.piecesWrapper.updateTextures(this.scene.graph.textures);
};

Hex.prototype.removeShip = function () {
    if (this.ship === null)
        return;

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
    this.piecesWrapper.updateTextures(this.scene.graph.textures);
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

Hex.prototype.highlight = function () {
    this.component.currentMaterial = 1;
};

Hex.prototype.resetHighlighting = function () {
    this.component.currentMaterial = 0;
};
