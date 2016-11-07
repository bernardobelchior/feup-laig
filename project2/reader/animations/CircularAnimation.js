class CircularAnimation extends Animation {

    //TODO: Angle the object according to the position


    constructor(scene, id, time,center,radius,startAng,rotAng) {
        super(scene,id,time);

        this.center = center;
        this.radius = radius;
        this.startAng = startAng;
        this.rotAng = rotAng;
        this.angleTraveled = 0;
    }

     move(deltaTime) {
         if(this.angleTraveled === 0)
             setupAnimation();

         let rotationSlice = rotAng / deltaTime;
         if(rotationSlice + angleTraveled > rotAng)                     //If the animation will make the rotation
             rotationSlice = rotationSlice + angleTraveled - rotAng;    // exceed what was wanted, make it only rotate to
                                                                        // completion
         this.scene.pushMatrix();
            this.scene.rotate(y,rotationSlice);
         this.scene.popMatrix();

         this.angleTraveled += rotationSlice;
     }

     setupAnimation(){
         this.scene.pushMatrix();
            this.scene.translate(Math.sin(this.startAng),0,Math.cos(this.startAng));
            this.scene.translate(center[0],center[1],center[2]);
         this.scene.popMatrix();
     }
}
