function SSEColony(scene){
    CGFobject.call(this, scene);

    this.base = new Cylinder(scene, 1.0, 1.0, 0.2, 20, 1);
    this.building1 = new UnitCube(scene);
    this.building2 = new UnitCube(scene);
}

SSEColony.prototype = Object.create(CGFobject.prototype);
SSEColony.prototype.constructor = SSEColony;

SSEColony.prototype.display = function(){
    this.base.display();

    this.scene.pushMatrix();
        this.scene.translate(-0.25, 0.0, 0.5);
        this.scene.scale(0.5, 0.5, 1.0);
        this.building1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.25, 0.0, 0.5);
        this.scene.scale(0.3, 0.4, 0.7);
        this.building2.display();
    this.scene.popMatrix();
};