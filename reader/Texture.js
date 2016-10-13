function Texture(file, length_s, length_t) {
    this.file = file;
    this.length_s = length_s;
    this.length_t = length_t;
}

Texture.prototype.constructor = Texture;

/**
 * Applies this texture to the given appearance.
 */
Texture.prototype.apply = function(appearance) {
    //  appearance.loadTexture("assets/"+ this.file);
    //appearance.setTextureWrap(this.length_s, this.length_t);

}
