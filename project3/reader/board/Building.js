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
    // this.setHex(selectedHex);
    // let xi = this.x;
    // let xf = selectedHex.x;
    // let zi = this.z;
    // let zf = selectedHex.z;
    //
    // let v = vec3.fromValues(xf - xi, 0.0, zf - zi);
    // vec3.normalize(v,v);
    // let a = vec3.fromValues(0.0, 1.0, 0.0);
    // let b = vec3.create();
    // vec3.cross(b,v,a);
    //
    // let rotationCenter = [(xf - xi)/2, 0.0, (zf - zi)/2];
    // let radius = distance([xi, 0.0, zi], [xf, 0.0, zf])/2;
    //
    // this.setAnimation(new CircularPieceAnimation(this.scene, "buildingAnimation", 2, rotationCenter, radius, Math.PI, 2*Math.PI, this, a, b));

    this.hexagon = selectedHex;
    let xi = this.x;
    let zi = this.z;
    let xf = selectedHex.x;
    let zf = selectedHex.z;

    let animationRoot = new ListNode([0,0,0]);
    let node1 = new ListNode([0, 2.0, 0.0]);
    let node2 = new ListNode([xf - xi, 2.0, zf - zi]);
    let node3 = new ListNode([xf - xi, 1.0, zf - zi]);

    animationRoot.next = node1;
    node1.next = node2;
    node2.next = node3;
    node3.next = animationRoot;

    this.setAnimation(new LinearPieceAnimation(this.scene, "buildingAnimation", 3.0,
        animationRoot, this));

    selectedHex.getShip().liftForBuilding();
};

Building.prototype.onAnimationDone = function(){
    this.component.removeAnimation();
    this.animation = null;
    this.hexagon.placeBuilding(this);
    this.originBoard.component.children.pop();
};

