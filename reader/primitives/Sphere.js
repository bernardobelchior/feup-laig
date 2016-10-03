/**
 * Sphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function Sphere(scene, radius, slices, stacks) {
	CGFobject.call(this,scene);
	this.scene = scene;
	this.slices = slices;
	this.stacks = stacks;

	this.semisphere = new Semisphere(scene, radius, slices, stacks);
};

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor=Sphere;

Sphere.prototype.display = function() {
	this.semisphere.display();

	this.scene.pushMatrix();
		this.scene.rotate(Math.PI, 1, 0, 0);
    this.semisphere.display();
	this.scene.popMatrix();
}
