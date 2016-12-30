/**
 * Hex constructor
 * @param scene Scene
 * @param component Component that represents the hex
 * @param visibilityIndex Visibility index
 * @param y Y index
 * @constructor
 */
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

/**
 * Transforms the hex
 */
Hex.prototype.transform = function () {
    this.component.translate(this.x, 0, this.z);
};

/**
 * Sets the picking ID.
 * @param pickingID Picking ID
 */
Hex.prototype.setPickingID = function (pickingID) {
    this.component.setPickingID(pickingID);
};

/**
 * Places the ship.
 * @param ship Ship
 */
Hex.prototype.placeShip = function (ship) {
    this.ship = ship;
    this.piecesWrapper.addChild(this.ship.component);
    this.piecesWrapper.updateTextures(this.scene.graph.textures);
};

/**
 * Removes ship
 */
Hex.prototype.removeShip = function () {
    if (this.ship === null)
        return;

    this.piecesWrapper.removeChild(this.ship.component);
    this.ship = null;
};

/**
 * Gets ship.
 * @returns Ship
 */
Hex.prototype.getShip = function () {
    return this.ship;
};

/**
 * Sets ship
 * @param ship Ship
 */
Hex.prototype.setShip = function (ship) {
    this.ship = ship;
}

/**
 * Places building
 * @param building Building
 */
Hex.prototype.placeBuilding = function (building) {
    if (this.building !== null)
        return;

    this.building = building;
    this.piecesWrapper.addChild(this.building.component);
    this.piecesWrapper.translate(0.0, 0.5, 0.0);
    this.ship.component.translate(0.0, -0.5, 0.0);
    this.piecesWrapper.updateTextures(this.scene.graph.textures);
};

/**
 * Removes building.
 */
Hex.prototype.removeBuilding = function () {
    if (this.building === null)
        return;

    this.piecesWrapper.removeChild(this.building.component);
    this.building = null;
};

/**
 * Gets building
 * @returns Building
 */
Hex.prototype.getBuilding = function () {
    return this.building;
};

/**
 * Highlights the hex.
 */
Hex.prototype.highlight = function () {
    this.component.currentMaterial = 1;
};

/**
 * Resets the hex highlighting.
 */
Hex.prototype.resetHighlighting = function () {
    this.component.currentMaterial = 0;
};
