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

    update(deltaTime) {
        let rotationSlice = this.rotAng * (deltaTime/1000/this.time); // Rotation to be done in this iteration
        this.currentRotAng += rotationSlice;

        if (this.currentRotAng >= this.rotAng) // If the animation will make the rotation
            this.done = true;
    }

    display() {
        this.scene.rotate(this.startAng + this.currentRotAng, 0, 1, 0);
        //Put the object in the right position
        this.scene.translate(this.center[0], this.center[1], this.center[2]);
        this.scene.translate(this.radius * Math.sin(this.startAng + this.currentRotAng), 0, this.radius * Math.cos(this.startAng + this.currentRotAng));
    }

    angleComponent(angle) {
        this.scene.pushMatrix();
        this.scene.rotate(angle, 0, 1, 0);
        this.scene.translate(-this.radius * Math.sin(this.startAng), 0, -this.radius * Math.cos(this.startAng));
        this.scene.popMatrix();
    }

    isDone() {
        return this.done;
    }

    resetAnimation() {
        this.angleTraveled = 0; // Rotation already completed by the animation
        this.position = [this.radius * Math.sin(this.startAng), 0, this.radius * Math.cos(this.startAng)];
        this.done = false;
        this.currentRotAng = 0;
    }

    clone() {
        return new CircularAnimation(this.scene, this.id, this.time, this.center, this.radius, this.startAng, this.rotAng);
    }
}
