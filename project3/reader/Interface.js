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
        newGame: this.requestNewConfig,
        undo: this.scene.game.undo.bind(this.scene.game),
        scene: this.scene
    };

    this.gui.add(menu, 'newGame').name('New Game');
    this.gui.add(menu, 'undo').name('Undo');

    return true;
};

/**
 * Gets initial configuration from Prolog.
 */
Interface.prototype.requestNewConfig = function () {
    getPrologRequest('initialConfig', this.scene.newGame.bind(this.scene));
};

Interface.prototype.processKeyDown = function (event) {
    CGFinterface.prototype.processKeyDown.call(this, event);
};

Interface.prototype.processKeyUp = function (event) {
    // call CGFinterface default code (omit if you want to override)
    CGFinterface.prototype.processKeyUp.call(this, event);

    switch (event.keyCode) {
        case (77): // 'M'
            this.scene.switchMaterials();
            break;
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
