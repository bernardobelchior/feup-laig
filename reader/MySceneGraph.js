function MySceneGraph(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph = this;

    // File reading
    this.reader = new CGFXMLreader();
    this.rootId;
    this.materials = {};
    this.transformations = {};
    this.primitives = {};
    this.textures = {};
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

    error = this.parseIllumination(rootElement);

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

    return (this.parseScene(dsx) || this.parseViews(dsx) || this.parseTransformations(dsx) || this.parseTextures(dsx) || this.parseMaterials(dsx) || this.parsePrimitives(dsx) || this.parseComponents(dsx));
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
        var fromVector = parseVec3(this.reader, fromTag);

        var toTag = perspective.getElementsByTagName('to')[0];
        var toVector = parseVec3(this.reader, toTag);

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
 * Parses the textures from the dsx root element.
 */
MySceneGraph.prototype.parseTextures = function(dsx) {
    let textures = dsx.getElementsByTagName('textures')[0];

    for (let texture of textures.children) {

        let id = this.reader.getString(texture, 'id', true);
        if (!id)
            return ('A texture must have an id. One is missing.');

        if (this.textures[id])
            return ('Texture with id ' + id + ' already exists.');

        if (id === 'none' || id === 'inherit')
            return ('"none" and "inherit" are keywords and cannot be used as texture ids.');


        let file = this.reader.getString(texture, 'file', true);

        if (!file)
            return ('Texture with id ' + id + ' does not have a file associated.');



        let length_s = this.reader.getFloat(texture, 'length_s', false);

        if (!length_s) {
            console.log('Texture with id ' + id + ' does not have length_s defined or is invalid. Assuming 1.0.');
            length_s = 1;
        }



        let length_t = this.reader.getFloat(texture, 'length_t', false);

        if (!length_t) {
            console.log('Texture with id ' + id + ' does not have length_t defined or is invalid. Assuming 1.0.');
            length_t = 1;
        }

        this.textures[id] = new Texture(this.scene, file, length_s, length_t);
    }
}

/**
 * Parses the materials from the dsx root element.
 */
MySceneGraph.prototype.parseMaterials = function(dsx) {
    var materials = dsx.getElementsByTagName('materials')[0];

    if (!materials.children.length)
        return ('There must be at least one material defined.');

    for (let material of materials.children) {
        let id = this.reader.getString(material, 'id', true);
        if (!id)
            return ('A material must have an id. One is missing.');

        if (this.materials[id])
            return ('Material with id ' + id + ' already exists.');

        let emission = material.getElementsByTagName('emission')[0];
        let emissionRGBA = parseRGBA(this.reader, emission);

        let ambient = material.getElementsByTagName('ambient')[0];
        let ambientRGBA = parseRGBA(this.reader, ambient);

        let diffuse = material.getElementsByTagName('diffuse')[0];
        let diffuseRGBA = parseRGBA(this.reader, diffuse);

        let specular = material.getElementsByTagName('specular')[0];
        let specularRGBA = parseRGBA(this.reader, specular);

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
 * Parses the components from the dsx root element
 * And creates the scene graph.
 */
MySceneGraph.prototype.parseComponents = function(dsx) {
    let compsTag = dsx.getElementsByTagName('components')[0];
    let components = {};

    console.log(compsTag.children);

    for (let compTag of compsTag.children) {
        let id = this.reader.getString(compTag, 'id', true);

        if (!id)
            return 'A component must have an id. Please provide one.';

        if (components[id])
            return ('A component with id ' + id + ' already exists.');

        let component = new Component(this.scene, id);

        let transformationTag = compTag.getElementsByTagName('transformation')[0];
        let materialsTag = compTag.getElementsByTagName('materials')[0];

        //Error checking
        let error = this.parseComponentTransformations(component, transformationTag);
        if (error)
            return error;

        error = this.parseComponentMaterials(component, materialsTag)
        if (error)
            return error;

        /*
         * Texture parsing
         */
        let texture = compTag.getElementsByTagName('texture')[0];
        if (!texture)
            return ('A component with id ' + id + ' does not have a texture tag.');

        let textureId = this.reader.getString(texture, 'id', true);
        if (textureId)
            component.setTexture(textureId);
        else
            return ('A component with id ' + id + ' is missing a texture id');

        //Children parsing
        let childrenTag = compTag.getElementsByTagName('children')[0];

        error = this.parseComponentChildren(components, component, childrenTag)
        if (error)
            return error;
    }

    let error = this.createSceneGraph(components);

    if (error)
        return error;
}

/**
 * Creates the scene graph used to display the scene
 */
MySceneGraph.prototype.createSceneGraph = function(components) {
    for (let id in components) {
        for (let child of components[id].children) {
            components[id].component.addChild(components[child].component);
            console.log(components[id].component.children.length);
        }
    }

    if (!components[this.rootId])
        return 'There is no node with the root id provided.';

    this.scene.rootNode = components[this.rootId].component;

    /*
     * Handle textures inheritance
     */
    if (this.scene.rootNode.texture === 'inherit')
        return 'Root node cannot inherit a texture.';

    this.scene.rootNode.updateTextures(this.textures);

    /*
     * Handle materials inheritance
     */
};

/**
 * Parses the transformations and adds it to the component.
 */
MySceneGraph.prototype.parseComponentTransformations = function(component, tag) {
    for (let transfTag of tag.children) {
        let transformation;

        if (transfTag.nodeName === 'transformationref') {
            let id = this.reader.getString(transfTag, 'id', true);

            if (!this.transformations[id])
                return ('Transformation with id ' + id + ' does not exist.');

            transformation = this.transformations[id];
        } else
            transformation = parseTransformation(this.scene, this.reader, transfTag);

        component.transform(transformation);
    }
}

/**
 * Parses the component materials and adds it to the component.
 */
MySceneGraph.prototype.parseComponentMaterials = function(component, tag) {
    if (!tag.children.length)
        return 'There is a component that does not have a material.';

    for (let materialTag of tag.children) {
        let id = this.reader.getString(materialTag, 'id', true);

        if (!id)
            return 'A material in a component is missing its id.';

        if (id === 'inherit')
            component.inheritMaterial = true;

        component.addMaterial(this.materials[id]);
    }
}

/**
 * Parses the children of the given component and:
 * If it is a primitive, adds it to the Component class;
 * If it is another component, adds it to the children array;
 *
 * In the end, it adds the component and its children to the components dictionary.
 */
MySceneGraph.prototype.parseComponentChildren = function(components, component, tag) {
    let children = [];

    for (let child of tag.children) {
        if (child.nodeName !== 'componentref' && child.nodeName !== 'primitiveref')
            return ('There is a component with id ' + component.getId() + ' with an unexpected child tag.');

        let id = this.reader.getString(child, 'id', true);

        if (!id)
            return ('There is a component with id ' + component.getId() + ' that has a child without id.');

        if (child.nodeName === 'componentref') {

            if (id === component.getId()) //Check for cylic dependency
                return ('Cyclic dependency on component named ' + component.getId() + '.');

            children.push(id);
        } else //primitiveref
            component.addChild(this.primitives[id]);
    }

    components[component.getId()] = {
        'component': component,
        'children': children
    };
}

/**
 *  Parses the primitives from the dsx root element.
 */
MySceneGraph.prototype.parsePrimitives = function(dsx) {
    let primitives = dsx.getElementsByTagName('primitives')[0];

    for (let primitive of primitives.children) {
        let shape = primitive.children[0];
        let id = this.reader.getString(primitive, 'id', true);

        if (!id)
            return 'A primitive must have an id. Please provide one.';

        let object;

        switch (shape.nodeName) {
            case 'rectangle':
                object = new Rectangle(this.scene,
                    parseVec2(this.reader, shape, '1'),
                    parseVec2(this.reader, shape, '2')
                );
                break;
            case 'triangle':
                object = new Triangle(this.scene,
                    parseVec3(this.reader, shape, '1'),
                    parseVec3(this.reader, shape, '2'),
                    parseVec3(this.reader, shape, '3'));
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
                {
                    let inner = this.reader.getFloat(shape, 'inner', true);
                    let outer = this.reader.getFloat(shape, 'outer', true);
                    let slices = this.reader.getInteger(shape, 'slices', true);
                    let loops = this.reader.getInteger(shape, 'loops', true);

                    object = new Torus(this.scene, inner, outer, slices, loops);
                }
                break;
            default:
                return ('Unknown primitive found ' + shape.nodeName + '.');
                break;
        }

        if (this.primitives[id])
            return ('There are two primitives with the same id: ' + id + '.');

        if (object)
            this.primitives[id] = object;
    }
}

/**
 * Parses transformation element of DSX
 * stores transformations in a dictionary for future reference
 * the dictionary keys are the ID strings, the values are arrays
 * the first element of the value array is the function to be called (transtale/rotate/scale)
 * the remainder of the array are the arguments to the function
 */
MySceneGraph.prototype.parseTransformations = function(rootElement) {
    var transformations = rootElement.getElementsByTagName('transformations');
    if (transformations == null)
        return "transformations element is missing";

    if (transformations.length != 1)
        return "invalid number of transformations elements"

    if (transformations[0].children.length < 1)
        return 'there should be one or more "transformation" blocks';

    this.transformations = []; //dictionary
    var duplicate = false; //flag

    // this for loop gets the ID of the transformation and, if it is not already in use, stores it in the dictionary
    for (let transf of transformations[0].children) {
        duplicate = false;
        let transfID = this.reader.getString(transf, 'id', true);
        if (!transfID)
            return 'missing transformation ID';

        //check if a transformation with the same ID has already been stored
        if (this.transformations[transfID])
            return ('Transformation with ID ' + transfID + ' already exists.');

        this.transformations[transfID] = new Transformation(this.scene);

        for (let operations of transf.children) {
            this.transformations[transfID].multiply(parseTransformation(this.scene, this.reader, operations));
        }
    }
}

/*
 * Parses illumination in DSX
 */
MySceneGraph.prototype.parseIllumination = function(rootElement) {

    var illumination = rootElement.getElementsByTagName('illumination');

    if (illumination == null)
        return "illumination element is missing";


    this.doublesided = this.reader.getBoolean(illumination[0], 'doublesided', true);
    this.local = this.reader.getBoolean(illumination[0], 'local', true);

    if (this.doublesided == null || this.local == null)
        return "boolean value(s) in illumination missing";

    this.ambient = parseRGBA(this.reader, illumination[0].children[0]);
    this.background = parseRGBA(this.reader, illumination[0].children[1]);

    if (this.ambient == null || this.background == null)
        return "ambient and background illuminations missing";

}

/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};
