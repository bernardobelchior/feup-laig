function MySceneGraph(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;

    // File reading
    this.reader = new CGFXMLreader();
    this.rootId;
    this.materials = {};
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

    return (this.parseScene(dsx) || this.parseViews(dsx) || this.parsePrimitives(dsx) || this.parseTransformations(dsx) || this.parseMaterials(dsx));
}

/**
 *Parses the given tag and returns a Vec3 with the result.
 * Attributes are named x, y and z concatenated with the number.
 *TODO:Check if the read values are valid
 */
MySceneGraph.prototype.parseVec3 = function(tag, number) {
    if (!number)
        number = '';

    let z = this.reader.getFloat(tag, 'z' + number, true);

    let vec3 = this.parseVec2(tag, number);
    vec3.push(z);

    return vec3;
}

/**
 * Parses the vector from the given tag attributes.
 * Attributes are named x and y concatenated with the number.
 */
MySceneGraph.prototype.parseVec2 = function(tag, number) {
    if (!number)
        number = '';

    let x = this.reader.getFloat(tag, 'x' + number, true);
    let y = this.reader.getFloat(tag, 'y' + number, true);

    return [x, y];
}

MySceneGraph.prototype.parseRGBA = function(tag) {
    let r = this.reader.getFloat(tag, 'r', true);
    let g = this.reader.getFloat(tag, 'g', true);
    let b = this.reader.getFloat(tag, 'b', true);
    let a = this.reader.getFloat(tag, 'a', true);

    return [
        r, g, b, a
    ];
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

/**
 * Parses the materials from the dsx root element.
 */
MySceneGraph.prototype.parseMaterials = function(dsx) {
    var materials = dsx.getElementsByTagName('materials')[0];

    for (let material of materials.children) {
        let id = this.reader.getString(material, 'id', true);
        if (!id)
            return ('A material must have an id. One is missing.');

        if (this.materials[id])
            return ('Material with id ' + id + ' already exists.');

        let emission = material.getElementsByTagName('emission')[0];
        let emissionRGBA = this.parseRGBA(emission);

        let ambient = material.getElementsByTagName('ambient')[0];
        let ambientRGBA = this.parseRGBA(ambient);

        let diffuse = material.getElementsByTagName('diffuse')[0];
        let diffuseRGBA = this.parseRGBA(diffuse);

        let specular = material.getElementsByTagName('specular')[0];
        let specularRGBA = this.parseRGBA(specular);

        let shininess = material.getElementsByTagName('shininess')[0];
        let shininessValue = this.reader.getFloat(shininess, 'value', true);


        let appearance = new CGFappearance(this.scene);
        appearance.setEmission(emissionRGBA[0], emissionRGBA[1], emissionRGBA[2], emissionRGBA[3]);
        appearance.setAmbient(ambientRGBA[0], ambientRGBA[1], ambientRGBA[2], ambientRGBA[3]);
        appearance.setDiffuse(diffuseRGBA[0], diffuseRGBA[1], diffuseRGBA[2], diffuseRGBA[3]);
        appearance.setSpecular(specularRGBA[0], specularRGBA[1], specularRGBA[2], specularRGBA[3]);
        appearance.setShininess(shininessValue);

        this.materials[id] = appearance;
    }
}

/**
  Parses the primitives from the dsx root element.
*/
MySceneGraph.prototype.parsePrimitives = function(dsx) {
    var primitives = dsx.getElementsByTagName('primitives')[0];

    for (let primitive of primitives.children) {
        let shape = primitive.children[0];
        let id = this.reader.getString(primitive, 'id', true);

        if (!id)
            return 'A primitive must have an id. Please provide one.';

        let object;

        switch (shape.nodeName) {
            case 'rectangle':
                object = new Rectangle(this.scene,
                    this.parseVec2(shape, '1'),
                    this.parseVec2(shape, '2')
                );
                break;
            case 'triangle':
                object = new Triangle(this.scene,
                    this.parseVec3(shape, '1'),
                    this.parseVec3(shape, '2'),
                    this.parseVec3(shape, '3'));
                break;
            case 'cylinder':
                {
                    let base = this.reader.getFloat(shape, 'base', true);
                    let top = this.reader.getFloat(shape, 'top', true);
                    let height = this.reader.getFloat(shape, 'height', true);
                    let slices = this.reader.getFloat(shape, 'slices', true);
                    let stacks = this.reader.getFloat(shape, 'stacks', true);

                    object = new Cylinder(this.scene, base, top, height, slices, stacks);
                }
                break;
            case 'sphere':
                {
                    let radius = this.reader.getFloat(shape, 'radius', true);
                    let slices = this.reader.getFloat(shape, 'slices', true);
                    let stacks = this.reader.getFloat(shape, 'stacks', true);

                    object = new Sphere(this.scene, radius, slices, stacks);
                }
                break;
            case 'torus':
                console.log('Torus found. Not implemented yet.');
                break;
            default:
                return ('Unknown primitive found ' + shape.nodeName + '.');
                break;
        }

        if (this.scene.primitives[id])
            return ('There are two primitives with the same id: ' + id + '.');

        if (object)
            this.scene.primitives[id] = object;
    }
}

/**
 * Parses transformation element of DSX
 * stores transformations in a dictionary for future reference
 * the dictionary keys are the ID strings, the values are arrays
 * the first element of the value array is the function to be called (transtale/rotate/scale)
 * the remainder of the array are the arguments to the function
 */
MySceneGraph.prototype.parseTransformations = function(rootElement){

    console.log("Parsing transformations");

    var transformations = rootElement.getElementsByTagName('transformations');
    if(transformations == null)
        return "transformations element is missing";

    if(transformations.length != 1)
        return "invalid number of transformations elements"

    if(transformations[0].children.length < 1)
        return 'there should be one or more "transformation" blocks';

    this.transfDic = []; //dictionary
    var duplicate = false; //flag

    // this for loop gets the ID of the transformation and, if it is not already in use, stores it in the dictionary
    for(let transf of transformations[0].children){
        duplicate = false;
        var transfID = this.reader.getString(transf, 'id', true);
        if(transfID == null)
            return "missing transformation ID";

        for(let storedID of this.transfDic){    //check if a transformation with the same ID has already been stored
            if(storedID == transfID){
                console.log("transformation ID " + transfID + " already in use");
                duplicate = true;
            }
        }

        var values;
        
        /**
         * the parsing happens here
         * checks what transformation is called and stores the function
         * and its arguments on a vector
         */
        for(let t of transf.children){
        switch(t.nodeName){
            case "translate":
                console.log("translate");
                vec = [this.scene.translate];
                console.log
                values = vec.concat(this.parseVec3(t));
                console.log(values);
                break;
           
            case "rotate":
                console.log("rotate")
                values = [this.scene.rotate]
                let axis = this.reader.getString(t,"axis",true);
                if(axis != "x" || axis != "y" || axis != "z")
                    return "Invalid axis on transformation " + transfID;
                values.push();
                values.push(this.reader.getFloat(t,"angle",true));
                console.log(values);
                break;

            case "scale":
                console.log("scale");
                vec = [this.scene.scale]
                values= vec.concat(this.parseVec3(t));
                console.log(values);
        }
        }

        if(!duplicate)
            this.transfDic.push({
                key: transfID,
                value: values
            });
    }
}

/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};
