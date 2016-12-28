function SSEColony(scene){
    CGFobject.call(this,scene);
    this.cube = new UnitCube(scene);
    this.base = new Cylinder(scene, 1.0, 1.0, 0.2, 20, 1);
}

SSEColony.prototype = Object.create(CGFobject.prototype);
SSEColony.prototype.constructor = SSEColony;

SSEColony.prototype.display = function () {
    this.base.display();

    //1st main building
    this.scene.pushMatrix();
        this.scene.translate(0.3, 0.1, 0.5);
        this.scene.scale(0.5, 0.5, 1.0);
        this.cube.display();
    this.scene.popMatrix();

    //2nd main building
    this.scene.pushMatrix();
        this.scene.translate(-0.4, 0.0, 0.5);
        this.scene.scale(0.3, 0.5, 1.0);
        this.cube.display();
    this.scene.popMatrix();
};
