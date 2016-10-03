class Transformation {
    var TYPE = {
        TRANSLATE,
        ROTATE,
        SCALE
    };

    constructor() {
        this.transformations = [];
    }

    rotate(angle, x, y, z) {
        this.transformations.push([ROTATE, angle, x, y, z]);
    }

    translate(x, y, z) {
        this.transformations.push([TRANSLATE, x, y, z]);
    }

    scale(x, y, z) {
        this.transformations.push([SCALE, x, y, z]);
    }
}
