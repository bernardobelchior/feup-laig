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
        this.tip = this.createTip();
        this.wing = this.createWing();
        this.bottom = new Circle(this.scene, 32, 1);
    }

    /**
     * Creates the spaceship tip using a quadratic function.
     * @param slices Horizontal slices
     * @param stacks Vertical stacks
     * @param height Final height of the object
     * @returns {Patch} Patch that represents the spaceship tip.
     */
    createTip() {
        let controlPoints = [
            [
                [-0.019, -0.400, 0.216, 1],
                [-0.039, -0.405, 0.150, 1],
                [-0.048, -0.401, 0.166, 1],
                [-0.030, -0.408, 0.177, 1],
                [-0.053, -0.399, 0.166, 1],
                [-0.044, -0.402, 0.179, 1]
            ], [
                [0.000, -1.000, 0.400, 1],
                [-1.000, -1.000, 0.400, 1],
                [-1.000, 1.000, 0.400, 1],
                [1.000, 1.000, 0.400, 1],
                [1.000, -1.000, 0.400, 1],
                [0.000, -1.000, 0.400, 1]
            ], [
                [0.000, -1.000, 0.800, 1],
                [-1.000, -1.000, 0.800, 1],
                [-1.000, 1.000, 0.800, 1],
                [1.000, 1.000, 0.800, 1],
                [1.000, -1.000, 0.800, 1],
                [0.000, -1.000, 0.800, 1]
            ], [
                [0.000, -1.000, 1.200, 1],
                [-1.000, -1.000, 1.200, 1],
                [-1.000, 1.000, 1.200, 1],
                [1.000, 1.000, 1.200, 1],
                [1.000, -1.000, 1.200, 1],
                [0.000, -1.000, 1.200, 1]
            ], [
                [0.000, -1.000, 1.600, 1],
                [-1.000, -1.000, 1.600, 1],
                [-1.000, 1.000, 1.600, 1],
                [1.000, 1.000, 1.600, 1],
                [1.000, -1.000, 1.600, 1],
                [0.000, -1.000, 1.600, 1]
            ], [
                [0.000, -1.000, 2.000, 1],
                [-1.000, -1.000, 2.000, 1],
                [-1.000, 1.000, 2.000, 1],
                [1.000, 1.000, 2.000, 1],
                [1.000, -1.000, 2.000, 1],
                [0.000, -1.000, 2.000, 1]
            ]
        ];

        return new Patch(this.scene, controlPoints.length - 1, controlPoints[0].length - 1, 16, 32, controlPoints);
    }

    createWing() {
        let controlPoints = [
            [
                [0, 0, 0, 1],
                [0, 0, -1.9, 1],
                [0, 0, -2, 1],
                [0, 0, -1.9, 1],
                [0, 0, 0, 1]
            ],
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
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.translate(0, -this.bodyHeight / 2, 0);


        //Display body
        this.scene.pushMatrix();
        this.scene.scale(0.75, 1, 0.75);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.body.display();
        this.scene.popMatrix();

        //Display tip
        this.scene.pushMatrix();
        this.scene.translate(0, this.bodyHeight + 2, .45);
        this.scene.scale(1.3, 1.2, 1.17);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.tip.display();
        this.scene.popMatrix();

        //Display right wing
        this.scene.pushMatrix();
        this.scene.translate(-0.25, 0, -0.6);
        this.wing.display();
        this.scene.popMatrix();

        //Display left wing
        this.scene.pushMatrix();
        this.scene.translate(-0.25, 0, 0.6);
        this.scene.scale(-1, 1, -1);
        this.wing.display();
        this.scene.popMatrix();

        //Spaceship bottom
        this.scene.pushMatrix();
        this.scene.scale(0.75, 1, 0.75);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.bottom.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

    /**
     * This function is needed in order to avoid TypeError due to amplifying a texture
     * that must not be amplified.
     */
    amplifyTexture() {

    }
}
