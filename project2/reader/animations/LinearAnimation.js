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

    update(deltaTime) {
        if (this.done)
            return;

        this.position = addPoints(this.position, multVector(this.currentDirection, this.speed * deltaTime / 1000));
        this.timeElapsed += deltaTime / 1000;

        if (this.timeElapsed >= this.timeExpected) {
            this.updateState();
        }
    }

    display() {
        this.scene.translate(this.position[0], this.position[1], this.position[2]);
        this.scene.rotate(this.angle, 0, 1, 0);
    }

    resetAnimation() {
        this.angle = 0;
        this.currentPoint = this.listRoot;
        this.timeElapsed = 0;
        this.timeExpected = 1 / (this.speed / distance(this.currentPoint.value, this.currentPoint.next.value));
        this.position = this.listRoot.value;
        this.currentDirection = subtractPoints(this.currentPoint.value, this.currentPoint.next.value);
        this.done = false;
    }

    updateState() {
        if (this.currentPoint.next.next === this.listRoot) {
            this.done = true;
            return;
        }

        this.timeElapsed = 0;
        this.timeExpected = 1 / (this.speed / distance(this.currentPoint.value, this.currentPoint.next.value));

        this.currentPoint = this.currentPoint.next;
        this.position = this.currentPoint.value;
        let newDirection = subtractPoints(this.currentPoint.value, this.currentPoint.next.value);
        this.angle += angleBetweenVectors(this.currentDirection, newDirection) % (2 * Math.PI);
        this.currentDirection = newDirection;
    }

    isDone() {
        return this.done;
    }

    clone() {
        return new LinearAnimation(this.scene, this.id, this.time, this.listRoot);
    }
}
