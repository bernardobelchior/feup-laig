/**
 *Parses the given tag and returns a Vec3 with the result.
 * Attributes are named x, y and z concatenated with the number.
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
 *Parses the given tag and returns a Vec4 with the result.
 * Attributes are named x, y, and w concatenated with the number.
 */
function parseVec4(reader, tag, number) {
    if (!number)
        number = '';

    let w = reader.getFloat(tag, 'w' + number, true);

    let vec4 = parseVec3(reader, tag, number);
    vec4.push(w);

    return vec4;
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

/**
 * Parses a transformation block, creating the appropriate object
 */
function parseTransformation(scene, reader, tag) {
    let transformation = new Transformation(scene);

    switch (tag.nodeName) {
        case 'translate': {
            let vec = parseVec3(reader, tag);
            transformation.translate(vec[0], vec[1], vec[2]);
        }
            break;
        case 'rotate':
            let axis = reader.getString(tag, 'axis', true);
            let angle = reader.getFloat(tag, "angle", true);

            switch (axis) {
                case 'x':
                    transformation.rotate(angle, 1, 0, 0);
                    break;
                case 'y':
                    transformation.rotate(angle, 0, 1, 0);
                    break;
                case 'z':
                    transformation.rotate(angle, 0, 0, 1);
                    break;
                default:
                    throw new Error('Invalid rotation axis.');
                    return null;
            }
            break;
        case 'scale': {
            let vec = parseVec3(reader, tag);
            transformation.scale(vec[0], vec[1], vec[2]);
        }
            break;
        default:
            throw new Error('Invalid node name.');
            return null;
    }

    return transformation;
}

/**
 *  Parses the given tag and returns a Vec3 with the result.
 */
function parseControlPoint(reader, tag) {
    let x = reader.getFloat(tag, 'xx', true);
    let y = reader.getFloat(tag, 'yy', true);
    let z = reader.getFloat(tag, 'zz', true);

    return [x, y, z];
}

/**
 * Parses the information of a linear animation from the animation tag.
 * Returns the animation object
 */
function parseLinearAnimation(reader, animationTag, scene, id, span) {
    let listRoot;
    let prevNode;
    let node;
    for (let controlPoint of animationTag.children) {
        node = new ListNode(parseControlPoint(reader, controlPoint));
        if (!listRoot)
            listRoot = node;
        if (prevNode)
            prevNode.next = node;

        prevNode = node;
    }
    node.next = listRoot;

    return new LinearAnimation(scene, id, span, listRoot);
}

/**
 * Parses the information of a circular animation from the animation tag.
 * Returns the animation object
 */
function parseCircularAnimation(reader, tag, scene, id, span) {
    let centerX = reader.getFloat(tag, "centerx", true);
    let centerY = reader.getFloat(tag, "centery", true);
    let centerZ = reader.getFloat(tag, "centerz", true);

    let radius = reader.getFloat(tag, "radius", true);

    let startAng = reader.getFloat(tag, "startang", true) * Math.PI / 180;
    let rotAng = reader.getFloat(tag, "rotang", true) * Math.PI / 180;

    let center = [centerX, centerY, centerZ]

    return new CircularAnimation(scene, id, span, center, radius, startAng, rotAng);
}

/**
 * Parses the control points from a patch
 */
function parseControlPoints(reader, patchChildren, orderU, orderV) {
    let controlPoints = [];

    for (let i = 0; i <= orderU; i++) {
        controlPoints.push([]);
    }

    let pointV = 0;
    let pointU = 0;
    for (let controlPoint of patchChildren) {
        let point = parseVec3(reader, controlPoint);
        point.push(1);

        controlPoints[pointU].push(point);

        if (pointV === orderV) {
            pointU++;
            pointV = 0;
        } else
            pointV++;
    }

    return controlPoints;
}

/**
 * Computes the 3D distance between two 3D points
 */
function distance(point1, point2) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2) + Math.pow(point1[2] - point2[2], 2));
}

/**
 * Returns the substraction of point2 with point1.
 * In mathematical terms, it returns the vector from point1 to point2.
 */
function subtractPoints(point1, point2) {
    return [point2[0] - point1[0], point2[1] - point1[1], point2[2] - point1[2]];
}

/**
 * Returns the addition of point1 with point2.
 */
function addPoints(point1, point2) {
    return [point1[0] + point2[0], point1[1] + point2[1], point1[2] + point2[2]];
}

/**
 * Multiplies a vector by a constant. Does the modify any of the objects.
 */
function multVector(vector, constant) {
    return [vector[0] * constant, vector[1] * constant, vector[2] * constant];
}

/**
 * Returns the vector norm
 */
function vectorNorm(vector) {
    return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
}

/**
 * Returns the vectors dot product
 */
function dotProduct(vector1, vector2) {
    return (vector1[0] * vector2[0] + vector1[1] * vector2[1] + vector1[2] * vector2[2]);
}

/**
 * Returns the angle between two vectors.
 */
function angleBetweenVectors(vector1, vector2) {
    return Math.acos(dotProduct(vector1, vector2) / (vectorNorm(vector1) + vectorNorm(vector2)));
}

/**
 * Returns a new normalized vector
 * @param vector Vector to be normalized.
 */
function normalizeVector(vector) {
   let norm = distance([0, 0, 0], vector);
    return [vector[0]/norm, vector[1]/norm, vector[2]/norm];
}

/**
 * Gets the Knots Vector.
 */
function getKnotsVector(degree) {
    let v = [];
    for (let i = 0; i <= degree; i++)
        v.push(0);

    for (let i = 0; i <= degree; i++)
        v.push(1);

    return v;
};
