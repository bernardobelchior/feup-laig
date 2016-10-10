function Component(scene, id) {
    this.scene = scene;
    this.id = id;
    this.materials = [];
    this.children = [];
    this.currentMaterial = 0;
    this.transformation = new Transformation(scene);
}

Component.prototype.rotate = function(angle, x, y, z) {
    this.transformation.rotate(angle, x, y, z);
}

Component.prototype.translate = function(x, y, z) {
    this.transformation.translate(x, y, z);
}

Component.prototype.scale = function(x, y, z) {
    this.transformation.scale(x, y, z);
}

Component.prototype.transform = function(transformation) {
    this.transformation.multiply(transformation);
}

Component.prototype.addMaterial = function(material) {
    this.materials.push(material);
}

Component.prototype.addTexture = function(texture) {
    this.texture = texture;
}

Component.prototype.getId = function() {
    return this.id;
}

Component.prototype.addChild = function(component) {
    this.children.push(component);
}

Component.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.multMatrix(this.transformation.getMatrix());

    for (let child of this.children) {
        child.display();
    }

    this.scene.popMatrix();
}
