function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * init
 * initializes the scene settings, camera, and light arrays
 */
XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.lights = [];
    this.lightIDs = [];
    this.lightStatus = [];
    this.cameras = [];
    this.rootNode;
    this.seqNum = 0;
    this.setUpdatePeriod(1 / 60 * 1000);
    this.lastUpdateTime = (new Date()).getTime();

    this.setPickEnabled(true);
    this.game = new Game();
};

/**
 * set the default scene appearance
 */
XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.2, 0.2, 1.0);
    this.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.setSpecular(1.0, 1.0, 1.0, 1.0);
    this.setShininess(10.0);
};


// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () {
    this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
    this.gl.clearColor(this.graph.bg[0], this.graph.bg[1], this.graph.bg[2], this.graph.bg[3]);

    //Sets the axis
    this.axis = new CGFaxis(this, this.axisLength);

    //Sets default camera
    this.camera = this.cameras[this.currentCamera];
    this.interface.setActiveCamera(this.camera);
    this.setUpdatePeriod(20);

    //GUI for light control
    for (let i = 0; i < this.lights.length; i++)
        this.lightStatus.push(this.lights[i].enabled);
};

/**
 * Initializes game class.
 * @param context MySceneGraph reference
 * @param data Response
 */
XMLscene.prototype.newGame = function (data) {
    this.rootNode.children = [];

    //Board, Ships, TradeStations, Colonies, HomeSystems, Wormholes
    let response = JSON.parse(data.target.response);
    let board = response[0];
    let ships = response[1];
    let tradeStations = response[2];
    let colonies = response[3];
    let homeSystems = response[4];
    let wormholes = response[5];

    this.game.newGame(this);
    this.game.createBoard(board, this.graph.components);
    this.game.initializeShips(ships, this.graph.components);
    this.game.setTradeStations(tradeStations);
    this.game.setColonies(colonies);
    this.game.setHomeSystems(homeSystems);
    this.game.setWormholes(wormholes);

    this.game.addOnScoreCanChange(this.updateScores.bind(this));
    this.game.addOnPlayerChanged(this.onPlayerChanged.bind(this));

    this.rootNode.updateTextures(this.graph.textures);

    document.getElementById('overlay').style.display = 'block';
    let scores = document.getElementsByClassName('score');

    for (let score of scores)
        score.innerHTML = '0';

    this.graph.loadedOk = true;
};

/**
 * Callback to call when the player has changed.
 */
XMLscene.prototype.onPlayerChanged = function () {
    //TODO: Change camera.
    console.log('Next player!!');
};

/**
 * Change game to normal mode.
 */
XMLscene.prototype.cancelMode = function () {
    this.game.cancelMode();
};

XMLscene.prototype.update = function (currTime) {
    if (!this.graph.loadedOk)
        return;


    this.rootNode.update(currTime - this.lastUpdateTime, this.seqNum);
    this.game.update(currTime - this.lastUpdateTime);
    this.seqNum = (this.seqNum + 1) % 2;
    this.lastUpdateTime = currTime;
};

XMLscene.prototype.display = function () {
    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    if (this.graph.loadedOk) {
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        this.handlePicking();
        this.clearPickRegistration();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.setDefaultAppearance();

        // ---- END Background, camera and axis setup

        //Update lights
        for (let i = 0; i < this.lights.length; i++) {
            if (this.lightStatus[i])
                this.lights[i].enable();
            else
                this.lights[i].disable();

            this.lights[i].update();
        }

        if (this.game.isRunning()) {
            document.getElementById('instruction').innerText =
                'Player ' + (this.game.getCurrentPlayer() + 1) + ', ' + this.game.getGameStateInstruction();
            document.getElementById('time_left').innerText = this.game.getTimeSinceLastPlay();
        }

        this.rootNode.display();

        // Draw axis
        this.axis.display();
    }
};

XMLscene.prototype.updateScores = function () {
    calculatePoints(this.game.board.getStringBoard(), this.game.tradeStations,
        this.game.colonies, this.game.homeSystems, 0, this.updateScoreDisplay.bind(null, 0));

    calculatePoints(this.game.board.getStringBoard(), this.game.tradeStations,
        this.game.colonies, this.game.homeSystems, 0, this.updateScoreDisplay.bind(null, 1));
};

XMLscene.prototype.updateScoreDisplay = function (playerNo, response) {
    document.getElementsByClassName('score')[playerNo].innerHTML = response.target.response;
};

XMLscene.prototype.switchMaterials = function () {
    this.rootNode.switchMaterials();
};

/**
 * Switches camera to the next one on the scene cameras array
 */
XMLscene.prototype.nextCamera = function () {
    if (this.currentCamera === this.cameras.length - 1)
        this.currentCamera = 0;
    else
        this.currentCamera++;

    this.camera = this.cameras[this.currentCamera];
    this.interface.setActiveCamera(this.camera);
};

/**
 * Handles the scene picking.
 */
XMLscene.prototype.handlePicking = function () {
    for (let picking of this.pickResults)
        if (picking[0])
            this.game.picked(picking[1]);

    this.pickResults.splice(0);
};

