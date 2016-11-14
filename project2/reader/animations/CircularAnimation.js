class CircularAnimation extends Animation {

    /**
     *
     * @param scene
     * @param id            Id of the animation
     * @param time          Duration of the animation
     * @param center        Center of the circle followed by the animation (x,y,z)
     * @param radius
     * @param startAng      Angle at which the animation starts
     * @param rotAng        Final angle of the animation (relative to the starting angle)
     * @constructor
     */
    constructor(scene, id, time,center,radius,startAng,rotAng) {
        super(scene,id,time);

        this.center = center;
        this.radius = radius;
        this.startAng = startAng;
        this.rotAng = rotAng;
        this.angleTraveled = 0;    // Rotation already completed by the animation
    }

    update(deltaTime) {
        if(this.angleTraveled === 0)
            this.setupAnimation();


        let rotationSlice = rotAng / deltaTime;                                 // Rotation to be done in this iteration

        if(rotationSlice + this.angleTraveled > this.rotAng)                    // If the animation will make the rotation
            rotationSlice = rotationSlice + this.angleTraveled - this.rotAng;   // exceed what was wanted, make it only rotate to
                                                                                // completion
        this.angleComponent(rotationSlice + this.angleTraveled);

        this.scene.pushMatrix();
            this.scene.rotate(y,rotationSlice);
        this.scene.popMatrix();

        this.angleTraveled += rotationSlice;
    }



   setupAnimation(){
        this.scene.pushMatrix();
            this.scene.translate(this.radius * Math.sin(this.startAng),0, this.radius * Math.cos(this.startAng));
            this.scene.translate(center[0],center[1],center[2]);
        this.scene.popMatrix();
    }

   angleComponent(angle){
        this.scene.pushMatrix();
            this.scene.rotate(y, angle);
            this.scene.translate(-this.radius * Math.sin(this.startAng),0, -this.radius * Math.cos(this.startAng));
        this.scene.popMatrix();
   }

   isDone(){
       return this.done;
   }

   resetAnimation(){
       this.angleTraveled = 0;
   }
}
