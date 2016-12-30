function Ship(scene, component, hexagon){
    Piece.call(this, scene, component);
    this.hexagon = hexagon;
    this.x = this.hexagon.x;
    this.z = this.hexagon.z;
}

Ship.prototype = Object.create(Piece.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.move = function (selectedHex) {
    this.nextHex = selectedHex;
    let xi = this.x;
    let zi = this.z;
    let xf = selectedHex.x;
    let zf = selectedHex.z;

    let animationRoot = new ListNode([0,0,0]);
    let nextNode = new ListNode([xf - xi, 0.0, zf - zi]);
    animationRoot.next = nextNode;
    nextNode.next = animationRoot;

    this.setAnimation(new LinearPieceAnimation(this.scene, "shipAnimation", 1.0,
        animationRoot, this));
};

Ship.prototype.onAnimationDone = function () {
    this.hexagon.removeShip();
    this.component.removeAnimation();
    this.animation = null;
    this.setHex(this.nextHex);
    this.nextHex.placeShip(this);
};




