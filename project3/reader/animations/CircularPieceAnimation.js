class CircularPieceAnimation extends CircularAnimation{
    /**
     * Circular Piece animation constructor.
     * @param scene Scene to apply the animation to
     * @param id            Id of the animation
     * @param time          Duration of the animation
     * @param center        Center of the circle followed by the animation (x,y,z)
     * @param radius Animation radius
     * @param startAng      Angle at which the animation starts
     * @param rotAng        Final angle of the animation (relative to the starting angle)
     * @constructor
     */
    constructor(scene, id, time, center, radius, startAng, rotAng, piece) {
        super(scene, id, time, center, radius, startAng, rotAng);
        this.piece = piece;
    }

    /**
     * Updates the current rotation angle of the object.
     * @param  {Number} deltaTime Time delta since the last update.
     */
    update(deltaTime, seqNum) {
        /* If the animation seqNum is different from the update seqNum, it means the animation
         * has already been updated this update path. */
        if (this.seqNum !== seqNum || this.done)
            return;

        /* Number used to know if a animation is updated twice in the same update path
         * If it is, it means there is a component with more than one parent and must only
         * be updated once. */
        this.seqNum = (this.seqNum + 1) % 2;


        this.timeElapsed += deltaTime / 1000;
        let rotationSlice = deltaTime / 1000 * this.speed;
        this.currentRotAng += rotationSlice;

        if (this.timeElapsed >= this.time) {  // If the animation has completed the rotation
            this.done = true;
            this.piece.onAnimationDone();
        }
    }

    /**
     * Applies the transformations according to the current state of the animation.
     */
    display() {
        //Translates the object to the right position.
        this.scene.translate(this.center[0], this.center[1], this.center[2]);
        this.scene.translate(this.radius * Math.sin(this.startAng + this.currentRotAng), 0, this.radius * Math.cos(this.startAng + this.currentRotAng));
    }

    /**
     * Creates a new Circular Piece Animation from the current parameters.
     * @return {CircularAnimation} A Circular Animation that is a clone of this one.
     */
    clone() {
        return new CircularPieceAnimation(this.scene, this.id, this.time, this.center, this.radius, this.startAng, this.rotAng, this.piece);
    }
}