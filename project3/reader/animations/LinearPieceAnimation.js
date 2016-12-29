/**
 * Created by epassos on 12/29/16.
 */
class LinearPieceAnimation extends LinearAnimation{
    constructor(scene, id, time, listRoot, piece){
        super(scene, id, time, listRoot);
        this.piece = piece;
    }

    /**
     * Updates the animation when a new control point has been reached.
     */
    updateState() {
        if (this.currentPoint.next.next === this.listRoot) {
            this.done = true;
            this.piece.onAnimationDone();
            return;
        }

        this.currentPoint = this.currentPoint.next;
        this.updateAnimation();
    }

    /**
     * Creates a new Linear Animation from the current parameters.
     * @return {LinearPieceAnimation} A LinearPieceAnimation that is a clone of this one.
     */
    clone() {
        return new LinearPieceAnimation(this.scene, this.id, this.time, this.listRoot, this.piece);
    }

    /**
     * Applies the transformations according to the current state of the animation.
     */
    display() {
        this.scene.translate(this.position[0], this.position[1], this.position[2]);
    }
}