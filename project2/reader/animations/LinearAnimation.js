class LinearAnimation extends Animation {
    constructor(scene, id, time, controlPoints) {
        super(scene, id, time);
        this.controlPoints = controlPoints;

        if (controlPoints.length < 0)
            throw new Error('Control points array has invalid length.');

        this.totalDistance = 0;
        let lastPoint = [0, 0, 0];
        for (let point of controlPoints) {
            this.totalDistance += distance(lastPoint, point);
            lastPoint = point;
        }

        this.speed = this.totalDistance/this.time;
    }

    move(deltaTime) {

    }
}
