/**
 * Chessboard
 * @constructor
 * @param scene CGFscene
 * @param du integer - board dimension in squares in the u direction
 * @param dv integer - board dimension in squares in the v direction
 * @param texture string
 * @param su integer - u coordinate of selected position
 * @param sv integer - v coordinate of selected position
 * @param c1 rgba
 * @param c2 rgba
 * @param cs rgba - color of selected position
 */
function Chessboard(scene, du, dv, texture, su, sv, c1, c2, cs){
    CGFobject.call(this,scene);

    this.du = du;
    this.dv = dv;

    this.su = -1;
    this.sv = -1;

    if(su !== null)
        this.su = su;

    if(sv !== null)
        this.sv = sv;

    this.c1 = c1;
    this.c2 = c2;
    this.cs = cs;

    this.texture = new CGFtexture(scene,texture);
    this.texture.bind();

    this.plane = new Plane(scene, 1.0, 1.0, du, dv);
    this.shader = new CGFshader(this.scene.gl, '../shaders/chessboard.vert', '../shaders/chessboard.frag');
}

Chessboard.prototype = Object.create(CGFobject.prototype);
Chessboard.prototype.constructor = Chessboard;

Chessboard.prototype.display = function(){
    this.scene.setActiveShader(this.shader);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);
}
