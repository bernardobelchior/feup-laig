function Hex(scene){
   this.scene = scene;
   this.rootNode = scene.cloneRoot();
}

Hex.prototype = Object.create(Object.prototype);
Hex.prototype.constructor = Hex;

Hex.prototype.setComponent = function(component){
   this.rootNode.addChild(component);
   this.rootNode.updateTextures(this.scene.graph.textures);
};
Hex.prototype.display = function(){
   this.rootNode.display();
};