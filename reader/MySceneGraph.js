function MySceneGraph(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;

    // File reading
    this.reader = new CGFXMLreader();
    this.rootId;
    /*
     * Read the contents of the xml file, and refer to this class for loading and error handlers.
     * After the file is read, the reader calls onXMLReady on this object.
     * If any error occurs, the reader calls onXMLError on this object, with an error message
     */

    this.reader.open('scenes/' + filename, this);
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady = function() {
    console.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various blocks
    var error = this.parseDsx(rootElement);

    if (error != null) {
        this.onXMLError(error);
        return;
    }

    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
    this.loadedOk = true;
};

MySceneGraph.prototype.parseDsx = function(dsx) {
    //NOTE: There cannot be a carriage return between the 'return' keyword and
    //the OR statement, otherwise the functions are not called.
    return (this.parseScene(dsx) || this.parseViews(dsx));
}

/**
  Parses the given tag and returns a Vec3 with the result.
  TODO:Check if the read values are valid
*/
MySceneGraph.prototype.parseVec3 = function(tag) {
    var x = this.reader.getFloat(tag, 'x', true);
    var y = this.reader.getFloat(tag, 'y', true);
    var z = this.reader.getFloat(tag, 'z', true);

    return [x, y, z];
}

/**
  Parses the scene tag
*/
MySceneGraph.prototype.parseScene = function(dsx) {
    var scene = dsx.getElementsByTagName('scene')[0];

    this.rootId = this.reader.getString(scene, 'root', true);

    if (this.rootId == null)
        return 'Scene tag must define a root component.';

    this.scene.axisLength = this.reader.getFloat(scene, 'axis_length', false);
}

/**
  Parses the views tag and its children and sets the scene's cameras accordingly.
*/
MySceneGraph.prototype.parseViews = function(dsx) {
    var views = dsx.getElementsByTagName('views')[0];
    var defaultCamera;

    var defaultPerspectiveId = this.reader.getString(views, 'default', true);

    if (!(views.children.length > 0))
        return 'You need to have at least one perspective defined.';

    for (let perspective of views.children) {
        //Parse perspective attributes
        var id = this.reader.getString(perspective, 'id', true);
        var fov = this.reader.getFloat(perspective, 'angle', true);
        var near = this.reader.getFloat(perspective, 'near', true);
        var far = this.reader.getFloat(perspective, 'far', true);

        //Parse perspective elements
        var fromTag = perspective.getElementsByTagName('from')[0];
        var fromVector = this.parseVec3(fromTag);

        var toTag = perspective.getElementsByTagName('to')[0];
        var toVector = this.parseVec3(toTag);

        //Sets the default camera
        if (defaultPerspectiveId === id)
            this.scene.defaultCamera = this.scene.cameras.length;

        this.scene.cameras.push(new CGFcamera(fov, near, far, fromVector, toVector));
    }

    if (this.scene.defaultCamera == null)
        return 'The default perspective is not a child of views.';

    //this.scene.camera = this.cameras[defaultCamera];
}

/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
/*MySceneGraph.prototype.parseGlobalsExample = function(rootElement) {

    var elems = rootElement.getElementsByTagName('globals');
    if (elems == null) {
        return "globals element is missing.";
    }

    if (elems.length != 1) {
        return "either zero or more than one 'globals' element found.";
    }

    // various examples of different types of access
    var globals = elems[0];
    this.background = this.reader.getRGBA(globals, 'background');
    this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill", "line", "point"]);
    this.cullface = this.reader.getItem(globals, 'cullface', ["back", "front", "none", "frontandback"]);
    this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw", "cw"]);

    console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

    var tempList = rootElement.getElementsByTagName('list');

    if (tempList == null || tempList.length == 0) {
        return "list element is missing.";
    }

    this.list = [];
    // iterate over every element
    var nnodes = tempList[0].children.length;
    for (var i = 0; i < nnodes; i++) {
        var e = tempList[0].children[i];

        // process each element and store its information
        this.list[e.id] = e.attributes.getNamedItem("coords").value;
        console.log("Read list item id " + e.id + " with value " + this.list[e.id]);
    };

};*/

/*
 * Callback to be executed on any read error
 */

MySceneGraph.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};
