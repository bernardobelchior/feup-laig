function Component(id) {
    this.id = id;
    this.transformations = [];
    this.materials = [];
    this.children = [];
    this.currentMaterial = 0;
}

Component.prototype.addTransformation = function(transformation) {
    this.transformations.push(transformation);
}

Component.prototype.concatTransformations = function(transformations) {
    this.transformations = this.transformations.concat(transformations);
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
