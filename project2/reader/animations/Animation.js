class Animation {
    private scene;
    private id;
    private time;

    constructor(scene, id, time) {
        this.scene = scene;
        this.id = id;
        this.time = time;
    }

    move(deltaTime);
}
