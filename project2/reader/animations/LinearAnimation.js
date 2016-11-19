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
        this.timeElapsed = 0;
        this.timeExpected = 1 / (this.speed / distance(this.currentPoint.value, this.currentPoint.next.value));
        this.position = this.listRoot.value;
        this.currentDirection = subtractPoints(this.currentPoint.value, this.currentPoint.next.value);
        this.updateAngle(this.currentDirection);
        this.done = false;
    }

    /**
     * Updates the animation when a new control point has been reached.
     */
    updateState() {
        if (this.currentPoint.next.next === this.listRoot) {
            this.done = true;
            return;
        }

        this.timeElapsed = 0;
        this.timeExpected = 1 / (this.speed / distance(this.currentPoint.value, this.currentPoint.next.value));

        this.currentPoint = this.currentPoint.next;
        this.position += this.currentPoint.value;
        this.currentDirection = subtractPoints(this.currentPoint.value, this.currentPoint.next.value);
        this.updateAngle(this.currentDirection);
    }

    updateAngle(direction) {
        this.angleXZ += Math.atan2(direction[0], direction[2]);
        this.angleYZ -= Math.atan2(direction[1], direction[2]);
    }

    /**
     * Creates a new Linear Animation from the current parameters.
     * @return {LinearAnimation} A Linear Animation that is a clone of this one.
     */
    clone() {
        return new LinearAnimation(this.scene, this.id, this.time, this.listRoot);
    }
}
