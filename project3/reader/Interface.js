/**
 * Interface
 * @constructor
 */
function Interface(scene) {
    //call CGFinterface constructor
    CGFinterface.call(this);

    this.scene = scene;
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

/**
 * init
 * @param {CGFapplication} application
 */
Interface.prototype.init = function (application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    this.gui = new dat.GUI();

    let menu = {
        undo: this.scene.game.undo.bind(this.scene.game),
        replay: this.scene.game.askForReplay.bind(this.scene.game),
        scene: this.scene
    };

    let config = {
        newGame: this.requestNewConfig,
        gameMode: GAMEMODE.HUMAN_VS_HUMAN,
        botDifficulty: BOT_DIFFICULTY.EASY,
        scene: this.scene
    };

    this.gui.add(menu, 'undo').name('Undo');
    this.gui.add(menu, 'replay').name('Replay');
    let configFolder = this.gui.addFolder('Configuration');
    configFolder.add(config, 'gameMode', {
        'Human vs Human': GAMEMODE.HUMAN_VS_HUMAN,
        'Human vs CPU': GAMEMODE.HUMAN_VS_CPU,
        'CPU vs CPU': GAMEMODE.CPU_VS_CPU,
    }).name('Game Mode');

    configFolder.add(config, 'botDifficulty', {
        'Easy': BOT_DIFFICULTY.EASY,
        'Hard': BOT_DIFFICULTY.HARD
    }).name('Bot Difficulty');

    configFolder.add(this.scene.game, 'moveTime', 60, 240).name('Move Time');
    configFolder.add(config, 'newGame').name('New Game');
    configFolder.open();

    return true;
};

/**
 * Gets initial configuration from Prolog.
 */
Interface.prototype.requestNewConfig = function () {
    getPrologRequest('initialConfig', this.scene.newGame.bind(this.scene, this.gameMode, this.botDifficulty));
};

Interface.prototype.processKeyDown = function (event) {
    CGFinterface.prototype.processKeyDown.call(this, event);
};

Interface.prototype.processKeyUp = function (event) {
    // call CGFinterface default code (omit if you want to override)
    CGFinterface.prototype.processKeyUp.call(this, event);

    switch (event.keyCode) {
        case (27): //Esc
            this.scene.cancelMode();
            break;
    }
};

/**
 * adds the light on/off checkbox to the gui
 * @param i the position of the current light in the scene lights array
 * @param id the id of the current light
 */
Interface.prototype.addLightControls = function (i, id) {
    this.lightGroup.add(this.scene.lightStatus, i, this.scene.lightStatus[i]).name(id);
}
