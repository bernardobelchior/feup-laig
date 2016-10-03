function Component() {
    this.transformations = [];
    this.materials = [];
    this.textures = [];
    this.children = [];
}

Component.prototype.addTransformation = function(transformation) {
  this.transformations.push(transformation);
  console.log(this.transformations);
}

Component.prototype.concatTransformations = function(transformations) {
  this.transformations.concat(transformations);
}
