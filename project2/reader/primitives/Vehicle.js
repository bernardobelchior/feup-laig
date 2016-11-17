/**
 * Created by bernardo on 17-11-2016.
 */


class Vehicle {
    /**
     * Creates the vehicle, that is represented as a spaceship.
     * The vehicle is align with the Y axis.
     * @param scene Scene to draw the Vehicle on.
     */
    constructor(scene) {
        this.scene = scene;


        this.bodyHeight = 4;

        //Initialize vehicle parts
        this.body = new BaselessCylinder(scene, 1, 1, this.bodyHeight, 32, this.bodyHeight);
        this.tip = this.createTip(32, 16, 1.5);
        this.wing = this.createWing();
    }

    /**
     * Creates the spaceship tip using a quadratic function.
     * @param slices Horizontal slices
     * @param stacks Vertical stacks
     * @param height Final height of the object
     * @returns {Patch} Patch that represents the spaceship tip.
     */
    createTip(slices, stacks, height) {
        let controlPoints = [];

        let angle = (2 * Math.PI) / slices;
        let yInc = height / stacks;

        //Creates the tip using a quadratic function.
        for (let u = 0; u <= stacks; u++) {
            controlPoints.push([]);

            for (let v = slices; v >= 0; v--) {
                console.log(angle * v / Math.PI * 180);
                let point = [
                    Math.cos(angle * v) * Math.sqrt(u / stacks),
                    height - yInc * u,
                    Math.sin(angle * v) * Math.sqrt(u / stacks),
                    1
                ];
                console.log('Sin: ' + Math.sin(angle * v) + '\tCos: ' + Math.cos(angle * v));
                controlPoints[u].push(point);
            }
            console.log('Next');
        }

        console.log(controlPoints);
        return new Patch(this.scene, stacks, slices, stacks, slices, controlPoints);
    }

    createWing() {
        let controlPoints = [
            [
                [-0.2, 0, 0, 1],
                [-0.2, 0, -1.9, 1],
                [0, 0, -2, 1],
                [0.2, 0, -1.9, 1],
                [0.2, 0, 0, 1]
            ], [
                [-0.2, 1, 0, 1],
                [-0.2, 1, -1.8, 1],
                [0, 1, -1.7, 1],
                [0.2, 1, -1.8, 1],
                [0.2, 1, 0, 1]
            ], [
                [-0.2, 1.5, 0, 1],
                [-0.2, 1.5, -1.15, 1],
                [0, 1.5, -1.25, 1],
                [0.2, 1.5, -1.15, 1],
                [0.2, 1.5, 0, 1]
            ], [
                [-0.2, 1.75, 0, 1],
                [-0.2, 1.75, -0.7, 1],
                [0, 1.75, -0.8, 1],
                [0.2, 1.75, -0.7, 1],
                [0.2, 1.75, 0, 1]
            ], [
                [-0.2, 2, 0, 1],
                [-0.2, 2, -0.45, 1],
                [0, 2, -0.55, 1],
                [0.2, 2, -0.45, 1],
                [0.2, 2, 0, 1]
            ], [
                [-0.2, 4, 0, 1],
                [-0.2, 4, 0, 1],
                [0, 4, 0.1, 1],
                [0.2, 4, 0, 1],
                [0.2, 4, 0, 1]
            ]
        ];

        return new Patch(this.scene, controlPoints.length - 1, controlPoints[0].length - 1, 20, 20, controlPoints);
    }

    /**
     * Displays the vehicle.
     */
    display() {
        //Display body
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.body.display();
        this.scene.popMatrix();

        //Display tip
        this.scene.pushMatrix();
        this.scene.translate(0, this.bodyHeight, 0);
        this.tip.display();
        this.scene.popMatrix();

        //Display right wing
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.8);
        this.wing.display();
        this.scene.popMatrix();

        //Display left wing
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.8);
        this.scene.scale(-1, 1, -1);
        this.wing.display();
        this.scene.popMatrix();
    }
}
