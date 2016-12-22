function UnitCube(scene){
    CGFobject.call(this, scene);
    this.faces = [];
    for (let i = 0; i < 6; i++){
        this.faces[i] = (new Rectangle(scene, [0.5, 0.5], [-0.5, -0.5], 0, 1, 0, 1));
    }
}

UnitCube.prototype = Object.create(CGFobject.prototype);
UnitCube.prototype.constructor = UnitCube;

/**
 *  ____
 * /   / |
 * ----  |
 *|    | |
 *|____|/
 */

UnitCube.prototype.display = function(){
    //front
    this.scene.pushMatrix();
        this.scene.translate(0.0, 0.0, 0.5);
        this.faces[0].display();
    this.scene.popMatrix();

    //back
    this.scene.pushMatrix();
        this.scene.translate(0.0, 0.0, -0.5);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.faces[1].display();
    this.scene.popMatrix();

    //top
    this.scene.pushMatrix();
        this.scene.translate(0.0, 0.5, 0.0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.faces[2].display();
    this.scene.popMatrix();

    // left
    this.scene.pushMatrix();
        this.scene.translate(0.5, 0.0, 0.0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.faces[3].display();
    this.scene.popMatrix();

    //right
    this.scene.pushMatrix();
        this.scene.translate(-0.5, 0.0, 0.0);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.faces[4].display();
    this.scene.popMatrix();

    //bottom
    this.scene.pushMatrix();
        this.scene.translate(0.0, -0.5, 0.0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.faces[5].display();
    this.scene.popMatrix();
}

