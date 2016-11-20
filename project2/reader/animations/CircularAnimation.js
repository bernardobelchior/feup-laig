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
    constructor(scene, id, time, center, radius, startAng, rotAng) {
        super(scene, id, time);

        this.center = center;
        this.radius = radius;
        this.startAng = startAng;
        this.rotAng = rotAng;
        this.resetAnimation();
    }

    /**
     * Updates the current rotation angle of the object.
     * @param  {Number} deltaTime Time delta since the last update.
     */
     update(deltaTime) {
        let rotationSlice = this.rotAng * (deltaTime / 1000 / this.time); // Rotation to be done in this iteration
        this.currentRotAng += rotationSlice;

        if (this.currentRotAng >= this.rotAng) // If the animation will complete the rotation
            this.done = true;
    }

    /**
     * Applies the transformations according to the current state of the animation.
     */
     display() {
        //Translates the object to the right position.
        this.scene.translate(this.center[0], this.center[1], this.center[2]);
        this.scene.translate(this.radius * Math.sin(this.startAng + this.currentRotAng), 0, this.radius * Math.cos(this.startAng + this.currentRotAng));

        //Rotates the object so it faces the right direction.
        this.scene.rotate(Math.PI/2 + this.startAng + this.currentRotAng, 0, 1, 0);
    }

    /**
     * Resets the animation.
     */
     resetAnimation() {
        this.angleTraveled = 0; // Rotation already completed by the animation
        this.position = [this.radius * Math.sin(this.startAng), 0, this.radius * Math.cos(this.startAng)];
        this.done = false;
        this.currentRotAng = 0;
    }

    /**
     * Creates a new Circular Animation from the current parameters.
     * @return {CircularAnimation} A Circular Animation that is a clone of this one.
     */
     clone() {
        return new CircularAnimation(this.scene, this.id, this.time, this.center, this.radius, this.startAng, this.rotAng);
    }
}
