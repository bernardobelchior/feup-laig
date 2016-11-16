/**
 * Chessboard
 * @constructor
 * @param scene CGFscene
 * @param du integer - board dimension in squares in the u direction
 * @param dv integer - board dimension in squares in the v direction
 * @param texture string
 * @param su integer - u coordinate of selected position (in squares)
 * @param sv integer - v coordinate of selected position (in squares)
 * @param c1 rgba
 * @param c2 rgba
 * @param cs rgba - color of selected position
 */
function Chessboard(scene, du, dv, texture, su, sv, c1, c2, cs){
    CGFobject.call(this,scene);
    this.scene = scene;

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

    this.divLengthU = 1.0/du;
    this.divLengthV = 1.0/dv;


    this.plane = new Plane(scene, 1.0, 1.0, du, dv);
    this.initBuffers();

    this.shader = new CGFshader(this.scene.gl, 'shaders/chessboard.vert', 'shaders/chessboard.frag');
    // this.shader = new CGFshader(this.scene.gl, '../shaderExample/shaders/texture1.vert', '../shaderExample/shaders/sepia.frag');

    this.texture = new CGFtexture(scene,texture);
    this.texture.bind();

    this.shader.setUniformsValues({sampler : 0});
    }

Chessboard.prototype = Object.create(CGFobject.prototype);
Chessboard.prototype.constructor = Chessboard;

Chessboard.prototype.display = function(){
    this.scene.setActiveShader(this.shader);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);
}
