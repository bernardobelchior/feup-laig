function Piece(scene, component, material){
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

Piece.prototype.getHex = function () {
    return this.hexagon;
};

Piece.prototype.setHex = function (hexagon) {
    this.hexagon = hexagon;
};

Piece.prototype.setAnimation = function (animation) {
    this.component.addAnimation(animation);
    this.animation = animation;
};

Piece.prototype.onAnimationDone = function () {
    this.hexagon.removeShip();
    this.component.removeAnimation();
    this.animation = null;
    this.setHex(this.nextHex);
    this.nextHex.placeShip(this);
};

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