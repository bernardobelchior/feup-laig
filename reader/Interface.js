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
Interface.prototype.init = function(application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    // init GUI. For more information on the methods, check:
    //  http://workshop.chromeexperiments.com/examples/gui

    this.gui = new dat.GUI();

    // add a button:
    // the first parameter is the object that is being controlled (in this case the scene)
    // the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
    // e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); };

    //	this.gui.add(this.scene, 'clockAnimation');

    // add a group of controls (and open/expand by defult)

    //var group=this.gui.addFolder("Options");
    //group.open();

    // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
    // e.g. this.option1=true; this.option2=false;

    //group.add(this.scene, 'option1');
    //group.add(this.scene, 'option2');

    // add a slider
    // must be a numeric variable of the scene, initialized in scene.init e.g.
    // this.speed=3;
    // min and max values can be specified as parameters

    /*	this.gui.add(this.scene, 'speed', 0.1, 2);

    	var lightGroup = this.gui.addFolder("Lights");

    	lightGroup.open();
    	lightGroup.add(this.scene, 'light0');
    	lightGroup.add(this.scene, 'light1');
    	lightGroup.add(this.scene, 'light2');
    	lightGroup.add(this.scene, 'light3');
    	lightGroup.add(this.scene, 'light4');

    	// Choose from named values
    	this.gui.add(this.scene, 'textures', { texture1: 0, texture2: 1, texture3: 2} );*/

    return true;
};

/**
 * processKeyboard
 * @param event {Event}
 */
/*Interface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this,event);

	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars

	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	switch (event.keyCode)
	{
		case (97):	// 'A'
			this.scene.drone.turnLeft();
			break;
		case (100): // 'D'
			this.scene.drone.turnRight();
			break;
		case (119): // 'W'
			this.scene.drone.moveForward();
			break;
		case (115): // 'S'
			this.scene.drone.moveBackward();
			break;
		case (105): // 'I'
			this.scene.drone.moveUp();
			break;
		case (106): // 'J'
			this.scene.drone.moveDown();
			break;
	};
};*/

Interface.prototype.processKeyDown = function(event) {
    // call CGFinterface default code (omit if you want to override)
    CGFinterface.prototype.processKeyDown.call(this, event);

    // Check key codes e.g. here: http://www.asciitable.com/
    // or use String.fromCharCode(event.keyCode) to compare chars
    // for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
    /*switch (event.keyCode)
    {

    };*/
    //console.log(event.keyCode);
};

Interface.prototype.processKeyUp = function(event) {
    // call CGFinterface default code (omit if you want to override)
    CGFinterface.prototype.processKeyUp.call(this, event);

    // Check key codes e.g. here: http://www.asciitable.com/
    // or use String.fromCharCode(event.keyCode) to compare chars

    // for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp

    switch (event.keyCode) {
        case (77): // 'M'
            this.scene.switchMaterials();
            break;
        case (86): //'V'
            this.scene.nextCamera();
            break;
    };
};
