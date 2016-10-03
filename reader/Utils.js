/**
 *Parses the given tag and returns a Vec3 with the result.
 * Attributes are named x, y and z concatenated with the number.
 *TODO:Check if the read values are valid
 */
function parseVec3(reader, tag, number) {
    if (!number)
        number = '';

    let z = reader.getFloat(tag, 'z' + number, true);

    let vec3 = parseVec2(reader, tag, number);
    vec3.push(z);

    return vec3;
}

/**
 * Parses the vector from the given tag attributes.
 * Attributes are named x and y concatenated with the number.
 */
function parseVec2(reader, tag, number) {
    if (!number)
        number = '';

    let x = reader.getFloat(tag, 'x' + number, true);
    let y = reader.getFloat(tag, 'y' + number, true);

    return [x, y];
}

/**
 * Parses the RGBA attributes from the given tag.
 * Returns a vector with the result.
 */
function parseRGBA(reader, tag) {
    let r = reader.getFloat(tag, 'r', true);
    let g = reader.getFloat(tag, 'g', true);
    let b = reader.getFloat(tag, 'b', true);
    let a = reader.getFloat(tag, 'a', true);

    return [
        r, g, b, a
    ];
}

function parseTransformation(scene, reader, tag) {
    let transformation = [];
    
    switch (tag.nodeName) {
        case 'translate':
            transformation[0] = scene.translate;
            transformation = transformation.concat(parseVec3(tag));
            break;
        case 'rotate':
            transformation[0] = scene.rotate;
            let axis = reader.getString(t, 'axis', true);

            if (axis != 'x' || axis != 'y' || axis != 'z')
                return null;

            transformation.push(axis);
            transformation.push(reader.getFloat(t, "angle", true));
            break;
        case 'scale':
            transformation[0] = scene.scale;
            transformation = transformation.concat(parseVec3(t));
    }

    return transformation;
}
