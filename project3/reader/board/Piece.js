/**
 * Piece constructor
 * @param scene Scene
 * @param component Component
 * @param material Material
 * @constructor
 */
function Piece(scene, component, material) {
    this.scene = scene;
    this.component = new Component(scene, "pieceWrapper");
    this.component.inheritMaterial = false;
    this.component.addMaterial(material);
    this.component.currentMaterial = this.component.materials.length - 1;
    this.component.texture = "inherit";
    this.component.addChild(component);
    this.animation = null;
}

Piece.prototype = Object.create(Object.prototype);
Piece.prototype.constructor = Piece;

/**
 * Gets the hex
 * @returns Hex
 */
Piece.prototype.getHex = function () {
    return this.hexagon;
};

/**
 * Sets the hex
 * @param hexagon Hex
 */
Piece.prototype.setHex = function (hexagon) {
    this.hexagon = hexagon;
};

/**
 * Sets the piece animation
 * @param animation Animation
 */
Piece.prototype.setAnimation = function (animation) {
    this.component.addAnimation(animation);
    this.animation = animation;
};

/**
 * Function to call when the animation is done.
 */
Piece.prototype.onAnimationDone = function () {
    this.hexagon.removeShip();
    this.component.removeAnimation();
    this.animation = null;
    this.setHex(this.nextHex);
    this.nextHex.placeShip(this);
};

/**
 * Moves the piece to the given hex
 * @param selectedHex Hex to move the piece to.
 */
Piece.prototype.move = function (selectedHex) {
    this.nextHex = selectedHex;
    let xi = this.hexagon.x;
    let zi = this.hexagon.z;
    let xf = selectedHex.x;
    let zf = selectedHex.z;

    let animationRoot = new ListNode([0, 0, 0]);
    let nextNode = new ListNode([xf - xi, 0.0, zf - zi]);
    animationRoot.next = nextNode;
    nextNode.next = animationRoot;

    this.setAnimation(new LinearPieceAnimation(this.scene, "shipAnimation", 1.0,
        animationRoot, this));
};

PIECE_TYPE = {
    TRADE_STATION: 0,
    COLONY: 1
};