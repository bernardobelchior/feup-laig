function SSETradeStation(scene){
    CGFobject.call(this,scene);

    this.cube = new UnitCube(scene);
    this.triangularPrism  = new Prism(scene, 1, 3, 1);
    this.cylinder = new Cylinder(scene, 1.0, 1.0, 0.5, 20, 1);
    this.triangle = new Triangle(scene, [Math.cos(2*Math.PI/3), 0.0, Math.sin(2*Math.PI/3)],
        [Math.cos(4*Math.PI/3),0.0, Math.sin(4*Math.PI/3)], [Math.cos(2*Math.PI),0.0,Math.sin(2*Math.PI)]
        ,0,1,0,1);
}

SSETradeStation.prototype = Object.create(CGFobject.prototype);
SSETradeStation.prototype.constructor = SSETradeStation;

SSETradeStation.prototype.display = function(){

    // Lower Base
    this.scene.pushMatrix();
        this.displayBase();
    this.scene.popMatrix();

    // Middle Base
    this.scene.pushMatrix();
        this.scene.translate(0.0,0.08,0.0);
        this.scene.scale(0.8, 1.0, 0.8);
        this.displayBase();
    this.scene.popMatrix();

    // Upper Base
    this.scene.pushMatrix();
        this.scene.translate(0.0,0.13,0.0);
        this.scene.scale(0.5, 1.0, 0.5);
        this.displayBase();
    this.scene.popMatrix();

    // Building
    this.scene.pushMatrix();
        this.scene.translate(-0.1, 0.2, 0.1);
        this.scene.scale(0.1, 1.0, 0.1);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.cylinder.display();
    this.scene.popMatrix();

};

SSETradeStation.prototype.displayBase = function(){
    // Side 1
    this.scene.pushMatrix();
        this.scene.translate(-0.5,0.0,0.3);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(1.0, 1.0, 0.7);
        this.scene.pushMatrix();
            this.scene.translate(0.83,-0.1,0.0);
            this.scene.scale(0.666, 0.2, 0.58);
            this.scene.pushMatrix();
                this.triangularPrism.display();
                this.triangle.display();
                this.scene.pushMatrix();
                    this.scene.translate(0.0, 1.0, 0.0);
                    this.scene.rotate(Math.PI/180 * 180, 1, 0, 0);
                    this.triangle.display();
                this.scene.popMatrix();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.scale(1.0, 0.2, 1.0);
            this.cube.display();
        this.scene.popMatrix();

    this.scene.popMatrix();

    // Side 2
    this.scene.pushMatrix();
        this.scene.scale(1.0, 1.0, 0.7);
        this.scene.pushMatrix();
            this.scene.translate(0.83,-0.1,0.0);
            this.scene.scale(0.666, 0.2, 0.58);
            this.scene.pushMatrix();
                this.triangularPrism.display();
                this.triangle.display();
                this.scene.pushMatrix();
                    this.scene.translate(0.0, 1.0, 0.0);
                    this.scene.rotate(Math.PI/180 * 180, 1, 0, 0);
                    this.triangle.display();
                this.scene.popMatrix();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.scale(1.0, 0.2, 1.0);
            this.cube.display();
        this.scene.popMatrix();
    this.scene.popMatrix();

    //Connector
    this.scene.pushMatrix();
        this.scene.translate(0.0, 0.0, 0.3);
        this.scene.rotate(Math.PI/4, 0, 1, 0);
        this.scene.scale(0.5,0.2,0.5);
        this.cube.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(-0.5, 0.0, 0.0);
        this.scene.rotate(Math.PI/4, 0, 1, 0);
        this.scene.scale(0.5,0.2,0.5);
        this.cube.display();
    this.scene.popMatrix();
};