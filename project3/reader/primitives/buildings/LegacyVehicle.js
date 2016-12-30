function LegacyVehicle(scene) {
    CGFobject.call(this,scene);

    this.body = new Cylinder(scene, 1, 1, 0.5, 20, 2);
    this.leg = new UnitCube(scene);
}

LegacyVehicle.prototype = Object.create(CGFobject.prototype);
LegacyVehicle.prototype.constructor = LegacyVehicle;

LegacyVehicle.prototype.display = function () {
    this.scene.pushMatrix();
    this.scene.scale(3.0, 3.0, 3.0);
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.scene.rotate(-Math.PI/2, 0, 0, 1);
    this.scene.pushMatrix();
        this.scene.scale(1.0, 0.5, 0.5);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.body.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(-0.5, 0.2, -0.6);
        this.scene.scale(1.0, 0.2, 0.5);
        this.leg.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(-0.5, 0.2, 0.6);
        this.scene.scale(1.0, 0.2, 0.5);
        this.leg.display();
    this.scene.popMatrix();
    this.scene.popMatrix();

};