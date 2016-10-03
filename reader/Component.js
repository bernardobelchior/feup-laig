function Component() {
    this.transformations = [];
    this.materials = [];
    this.textures = [];
    this.children = [];
}

Component.prototype.addTransformation = function(transformation) {
  this.transformations.push(transformation);
}
