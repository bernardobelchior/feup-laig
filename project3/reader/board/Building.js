function Building(scene, component, auxBoard, x, z){
    Piece.call(this, scene, component);
    this.originBoard = auxBoard;
    this.hexagon = null;
    this.x = x;
    this.z = z;
}

Building.prototype = Object.create(Piece.prototype);
Building.prototype.constructor = Building;

Building.prototype.move = function(selectedHex){
    console.log(this.x);
    console.log(this.z);
    this.setHex(selectedHex);
    let xi = this.x;
    let xf = selectedHex.x;
    let zi = this.z;
    let zf = selectedHex.z;

    let rotationCenter = [Math.abs(xf - xi)/2, 0.0, Math.abs(zf - zi)/2];

    this.setAnimation(new CircularPieceAnimation(this.scene, "buildingAnimation", 2, rotationCenter,))
    this.setAnimation(new LinearPieceAnimation(this.scene, "shipAnimation", 3.0,
        animationRoot, this));
};

Building.prototype.onAnimationDone = function(){
    this.component.removeAnimation();
    this.animation = null;
    this.hexagon.placeBuilding(this);
    this.originBoard.component.children.pop();
};

