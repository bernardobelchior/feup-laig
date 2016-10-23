/**
 * intializes the reader, root id, as well as the dictionaries for the materials, transformations, primitives and textures
 * @constructor
 */
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

/**
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

/**
 * Calls the parsing functions on every block of the dsx, checking for an error in any of them
 * @param dsx
 */
MySceneGraph.prototype.parseDsx = function(dsx) {
    //Mandatory in order to ensure the blocks order.
    let scene = dsx.children[0];
    let views = dsx.children[1];
    let illumination = dsx.children[2];
    let lights = dsx.children[3];
    let textures = dsx.children[4];
    let materials = dsx.children[5];
    let transformations = dsx.children[6];
    let primitives = dsx.children[7];
    let components = dsx.children[8];

    return (this.parseScene(scene) || this.parseViews(views) || this.parseIllumination(illumination) || this.parseLights(lights) || this.parseTextures(textures) || this.parseMaterials(materials) || this.parseTransformations(transformations) || this.parsePrimitives(primitives) || this.parseComponents(components));
}

/**
  Parses the scene tag
*/
MySceneGraph.prototype.parseScene = function(scene) {
    if (scene.nodeName !== 'scene')
        return ('Blocks not ordered correctly. Expected "scene", found "' + scene.nodeName + '".');

    this.rootId = this.reader.getString(scene, 'root', true);

    if (this.rootId == null)
        return 'Scene tag must define a root component.';

    this.scene.axisLength = this.reader.getFloat(scene, 'axis_length', false);
}

/**
  Parses the views tag and its children and sets the scene's cameras accordingly.
*/
MySceneGraph.prototype.parseViews = function(views) {
    if (views.nodeName !== 'views')
        return ('Blocks not ordered correctly. Expected "views", found "' + views.nodeName + '".');

    let defaultPerspectiveId = this.reader.getString(views, 'default', true);

    if (!(views.children.length > 0))
        return 'You need to have at least one perspective defined.';

    for (let perspective of views.children) {
        //Parse perspective attributes
        var id = this.reader.getString(perspective, 'id', true);
        var fov = this.reader.getFloat(perspective, 'angle', true) * Math.PI / 180; //To radians
        var near = this.reader.getFloat(perspective, 'near', true);
        var far = this.reader.getFloat(perspective, 'far', true);

        //Parse perspective elements
        var fromTag = perspective.getElementsByTagName('from')[0];
        var fromVector = parseVec3(this.reader, fromTag);

        var toTag = perspective.getElementsByTagName('to')[0];
        var toVector = parseVec3(this.reader, toTag);

        //Sets the default camera
        if (defaultPerspectiveId === id)
            this.scene.currentCamera = this.scene.cameras.length;

        this.scene.cameras.push(new CGFcamera(fov, near, far, fromVector, toVector));
    }

    if (this.scene.currentCamera == null)
        return 'The default perspective is not a child of views.';
}


/**
 * Parses the illumination block of the DSX
 */
MySceneGraph.prototype.parseIllumination = function(illumination) {
    if (illumination.nodeName !== 'illumination')
        return ('Blocks not ordered correctly. Expected "illumination", found "' + illumination.nodeName + '".');

    this.doublesided = this.reader.getBoolean(illumination, 'doublesided', true);
    this.local = this.reader.getBoolean(illumination, 'local', true);

    if (this.doublesided == null || this.local == null)
        return 'Boolean value(s) in illumination missing.';

    let ambientTag = illumination.getElementsByTagName('ambient')[0];
    this.ambient = parseRGBA(this.reader, ambientTag);

    let backgroundTag = illumination.getElementsByTagName('background')[0];
    this.bg = parseRGBA(this.reader, backgroundTag);


    if (this.ambient == null)
        return 'Ambient illumination missing.';

    if (this.bg == null)
        return 'Background illumination missing.';
}

/**
 * Parses the lights block from the dsx.
 */
MySceneGraph.prototype.parseLights = function(lights) {
    if (lights.nodeName !== 'lights')
        return ('Blocks not ordered correctly. Expected "lights", found "' + lights.nodeName + '".');

    let error;
    this.ids = {};

    if (!lights.children.length) {
        return "No lights detected in the dsx";
    }

    /*
     * For every light, checks it attributes and if it is an omni or spot light, calling the appropriate parser
     */
    for (let light of lights.children) {
        let id = this.reader.getString(light, 'id', true);
        if (!id)
            return ('A light must have an id. One is missing.');

        let enabled = this.reader.getBoolean(light, 'enabled', true);
        if (enabled === undefined)
            return ("Light with id " + id + " has no valid 'enabled' attribute");

        if (this.ids[id])
            return ('Light with id ' + id + ' already exists.');

        let type = light.nodeName;

        switch (type) {
            case 'omni':
                error = this.parseOmniLight(light, this.scene.lights.length, enabled, id);
                break;

            case 'spot':
                error = this.parseSpotLight(light, this.scene.lights.length, enabled, id);
                break;

            default:
                error = ("Light with id " + id + " has an invalid type");
        }
        this.ids[id] = id;
    }

    return error;
};

/**
 * Parses an omni type light from the lights block
 */
MySceneGraph.prototype.parseOmniLight = function(light, n_lights, enabled, id) {

    let locationTag = light.getElementsByTagName('location')[0];
    let location = parseVec4(this.reader, locationTag);
    if (!location)
        return ("Light with id " + id + " is missing a valid location!");

    let ambientTag = light.getElementsByTagName('ambient')[0];
    let ambient = parseRGBA(this.reader, ambientTag);
    if (!ambient)
        return ("Light with id " + id + " is missing a valid ambient setting!");

    let diffuseTag = light.getElementsByTagName('diffuse')[0];
    let diffuse = parseRGBA(this.reader, diffuseTag);
    if (!diffuse)
        return ("Light with id " + id + " is missing a valid diffuse setting!");

    let specularTag = light.getElementsByTagName('specular')[0];
    let specular = parseRGBA(this.reader, specularTag);
    if (!specular)
        return ("Light with id " + id + " is missing a valid specular setting!");

    let newLight = new CGFlight(this.scene, n_lights);
    if (enabled)
        newLight.enable();
    else
        newLight.disable();

    newLight.setPosition(location[0], location[1], location[2], location[3]);
    newLight.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
    newLight.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
    newLight.setSpecular(specular[0], specular[1], specular[2], specular[3]);
    newLight.setVisible(true);

    this.scene.lights.push(newLight);
    //needed for GUI
    this.scene.lightIDs.push(id);
    newLight.update();
}

MySceneGraph.prototype.parseSpotLight = function(light, n_lights, enabled, id) {
    let angle = this.reader.getFloat(light, 'angle', true);
    if (!angle)
        return ("Light with id " + id + " has an invalid angle");

    let exponent = this.reader.getFloat(light, 'exponent', true);
    if (!exponent)
        return ("Light with id " + id + " has an invalid exponent");


    let targetTag = light.getElementsByTagName('target')[0];
    let target = parseVec3(this.reader, targetTag);
    if (!target)
        return ("Light with id " + id + " is missing a valid target!");

    let locationTag = light.getElementsByTagName('location')[0];
    let location = parseVec3(this.reader, locationTag);
    if (!location)
        return ("Light with id " + id + " is missing a valid location!");

    let ambientTag = light.getElementsByTagName('ambient')[0];
    let ambient = parseRGBA(this.reader, ambientTag);
    if (!ambient)
        return ("Light with id " + id + " is missing a valid ambient setting!");


    let diffuseTag = light.getElementsByTagName('diffuse')[0];
    let diffuse = parseRGBA(this.reader, diffuseTag);
    if (!diffuse)
        return ("Light with id " + id + " is missing a valid diffuse setting!");

    let specularTag = light.getElementsByTagName('specular')[0];
    let specular = parseRGBA(this.reader, specularTag);
    if (!specular)
        return ("Light with id " + id + " is missing a valid specular setting!");

    let direction = [];
    direction[0] = target[0] - location[0];
    direction[1] = target[1] - location[1];
    direction[2] = target[2] - location[2];
    let newLight = new CGFlight(this.scene, n_lights);

    if (enabled)
        newLight.enable();
    else
        newLight.disable();

    newLight.setPosition(location[0], location[1], location[2], 1);
    newLight.setSpotDirection(direction[0], direction[1], direction[2]);
    newLight.setSpotExponent(exponent);
    newLight.setSpotCutOff(angle);
    newLight.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
    newLight.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
    newLight.setSpecular(specular[0], specular[1], specular[2], specular[3]);
    newLight.setVisible(true);

    this.scene.lights.push(newLight);
    //needed for GUI
    this.scene.lightIDs.push(id);
    newLight.update();
}


/**
 * Parses the textures block from the dsx.
 */
MySceneGraph.prototype.parseTextures = function(textures) {
    if (textures.nodeName !== 'textures')
        return ('Blocks not ordered correctly. Expected "textures", found "' + textures.nodeName + '".');

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

        if (!length_s || length_s <= 0) {
            console.log('Texture with id ' + id + ' does not have length_s defined or is invalid. Assuming 1.0.');
            length_s = 1;
        }


        let length_t = this.reader.getFloat(texture, 'length_t', false);

        if (!length_t || length_t <= 0) {
            console.log('Texture with id ' + id + ' does not have length_t defined or is invalid. Assuming 1.0.');
            length_t = 1;
        }

        this.textures[id] = new Texture(this.scene, file, length_s, length_t);
    }
}

/**
 * Parses the materials block from the dsx.
 */
MySceneGraph.prototype.parseMaterials = function(materials) {
    if (materials.nodeName !== 'materials')
        return ('Blocks not ordered correctly. Expected "materials", found "' + materials.nodeName + '".');

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
 * Parses the components block from the dsx.
 * And creates the scene graph.
 */
MySceneGraph.prototype.parseComponents = function(compsTag) {
    if (compsTag.nodeName !== 'components')
        return ('Blocks not ordered correctly. Expected "components", found "' + compsTag.nodeName + '".');

    let components = {};

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
        if (textureId) {
            if (textureId !== 'none' && textureId !== 'inherit' && !this.textures[textureId])
                return ('No texture with id ' + textureId + ' exists.');

            error = component.setTexture(textureId);

            if (error)
                return error;
        } else
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
    //Used to prevent the dsx from having transformation ref and other
    //transformations in the same block.
    let transfRef;

    for (let transfTag of tag.children) {
        let transformation;

        if (transfTag.nodeName === 'transformationref') {
            /*
             * If transfRef is undefined, transformationref can be parsed.
             * If transfRef is true, a transformationref has already been parsed,
             * and cannot be parsed again.
             * If transfRef is undefined, nothing has been parsed and the parsing
             * can be executed.
             */
            if (transfRef === false)
                return ('Component with id ' + component.id + ' has transformationref and other transformations mixed.');
            else if (transfRef === true)
                return;

            let id = this.reader.getString(transfTag, 'id', true);

            if (!this.transformations[id])
                return ('Transformation with id ' + id + ' does not exist.');

            transformation = this.transformations[id];
            component.transform(transformation);
            transfRef = true;
        } else {
            /*
             * If transfRef is true, a transformationref has been parsed and
             * other types of transformation cannot be parsed.
             * If transfRef is false or undefined, transformations can be parsed.
             */
            if (transfRef === true)
                return ('Component with id ' + component.id + ' has transformationref and other transformations mixed.');

            transformation = parseTransformation(this.scene, this.reader, transfTag);
            component.transform(transformation);
            transfRef = false;
        }
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
        else if (!this.materials[id])
            return ('There is no material with id ' + id + '.');

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
MySceneGraph.prototype.parsePrimitives = function(primitives) {
    if (primitives.nodeName !== 'primitives')
        return ('Blocks not ordered correctly. Expected "primitives", found "' + primitives.nodeName + '".');

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
MySceneGraph.prototype.parseTransformations = function(transformations) {
    if (transformations.nodeName !== 'transformations')
        return ('Blocks not ordered correctly. Expected "transformations", found "' + transformations.nodeName + '".');

    if (transformations.children.length < 1)
        return 'At least one transformation is needed in transformations block.';

    this.transformations = []; //dictionary

    // this for loop gets the ID of the transformation and, if it is not already in use, stores it in the dictionary
    for (let transf of transformations.children) {
        let transfID = this.reader.getString(transf, 'id', true);
        if (!transfID)
            return 'Missing transformation ID.';

        //check if a transformation with the same ID has already been stored
        if (this.transformations[transfID])
            return ('Transformation with ID ' + transfID + ' already exists.');

        this.transformations[transfID] = new Transformation(this.scene);

        for (let operations of transf.children) {
            this.transformations[transfID].multiply(parseTransformation(this.scene, this.reader, operations));
        }
    }
};

/**
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError = function(message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};
