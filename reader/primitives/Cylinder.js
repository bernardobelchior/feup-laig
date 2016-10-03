/**
 * Cylinder
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Cylinder(scene, base, top, height, slices, stacks) {
    CGFobject.call(this, scene);
    this.scene = scene;
    this.slices = slices;
    this.stacks = stacks;
    this.height = height;

    //TODO: Height is not scaled properly.

    this.baselessCylinder = new BaselessCylinder(scene, height, slices, stacks);
    this.top = new Circle(scene, slices);
    this.bottom = new Circle(scene, slices);
};

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.display = function() {
    this.baselessCylinder.display();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, this.height);
    this.top.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(Math.PI, 0, 1, 0);
    this.scene.scale(-1, -1, 1);
    this.bottom.display();
    this.scene.popMatrix();
}
