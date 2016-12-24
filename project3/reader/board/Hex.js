function Hex(scene, component, visibilityIndex, y) {
    this.scene = scene;
    this.component = new Component(this.scene, 'wrapper');

    this.component.inheritMaterial = true;
    this.component.texture = 'inherit';
    this.component.addChild(component);

    this.scene.rootNode.addChild(this.component);
    this.transform(visibilityIndex, y);
    //this.component.updateTextures(this.scene.graph.textures);
}

Hex.prototype = Object.create(Object.prototype);
Hex.prototype.constructor = Hex;

Hex.prototype.transform = function (visibilityIndex, y) {
    this.component.translate(1.9*visibilityIndex, 0, 1.68*y);
    this.component.translate(1 * y%2, 0, 0);
};

Hex.prototype.setPickingID = function (pickingID) {
    console.log('Setting picking ID ' + pickingID);
    this.component.setPickingID(pickingID);
};
