class LinearAnimation extends Animation {
    constructor(scene, id, time, listRoot) {
        super(scene, id, time);

        this.listRoot = listRoot;

        if (!this.listRoot || !this.listRoot.next)
            throw new Error('Control points have invalid length.');

        let point = this.listRoot;
        this.totalDistance = 0;
        while (point.next !== this.listRoot) {
            this.totalDistance += distance(point.value, point.next.value);
            point = point.next;
        }

        this.speed = this.totalDistance / this.time;
        this.resetAnimation();
    }

    /**
     * Updates the object position.
     * @param  {Number} deltaTime Time delta since the last update.
     */
    update(deltaTime) {
        if (this.done)
            return;

        this.position = addPoints(this.position, multVector(this.currentDirection, this.speed * deltaTime / 1000));
        this.timeElapsed += deltaTime / 1000;

        if (this.timeElapsed >= this.timeExpected) {
            this.updateState();
        }
    }

    /**
     * Applies the transformations according to the current state of the animation.
     */
    display() {
        this.scene.translate(this.position[0], this.position[1], this.position[2]);
        this.scene.rotate(this.angleXZ, 0, 1, 0);
        this.scene.rotate(this.angleYZ, 1, 0, 0);
    }

    /**
     * Resets the animation.
     */
    resetAnimation() {
        this.angleXZ = 0;
        this.angleYZ = 0;
        this.currentPoint = this.listRoot;
        this.position = this.listRoot.value;
        this.done = false;
        this.updateAnimation();
        this.t0 = performance.now();
    }

    /**
     * Updates the animation when a new control point has been reached.
     */
    updateState() {
        if (this.currentPoint.next.next === this.listRoot) {
            this.done = true;
            this.t1 = performance.now();
            console.log('Linear animation duration: ' + (this.t1 - this.t0));
            return;
        }

        this.currentPoint = this.currentPoint.next;
        this.updateAnimation();
    }

    /**
     * Updates animation's angles, direction and time expected.
     */
    updateAnimation() {
        this.timeElapsed = 0;
        this.timeExpected = 1 / (this.speed / distance(this.currentPoint.value, this.currentPoint.next.value));
        this.currentDirection = normalizeVector(subtractPoints(this.currentPoint.value, this.currentPoint.next.value));

        /* Updates rotation angle in order to align the object with the direction of animation */
        this.angleXZ = Math.atan2(this.currentDirection[0], this.currentDirection[2]);
        this.angleYZ = -Math.atan2(this.currentDirection[1], this.currentDirection[2]);

        console.log(this);
    }

    /**
     * Creates a new Linear Animation from the current parameters.
     * @return {LinearAnimation} A Linear Animation that is a clone of this one.
     */
    clone() {
        return new LinearAnimation(this.scene, this.id, this.time, this.listRoot);
    }
}
