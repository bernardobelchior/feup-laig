class LinearAnimation extends Animation {
  private controlPoints;
  private totalAnimationDistance;

  constructor(time, controlPoints) {
    super(time);
    this.controlPoints = controlPoints;

    if(controlPoints.length < 0)
      throw new Error('Control points array has invalid length.');

    totalAnimationDistance = 0;
    let lastPoint = [0, 0,0];
    for(let point of controlPoints) {
      totalAnimationDistance += distance(lastPoint, point);
      lastPoint = point;
    }

    console.log(totalAnimationDistance);
  }

  move(deltaTime) {
    
  }
}
