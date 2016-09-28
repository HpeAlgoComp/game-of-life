//INPROVE THIS CODE

(function () {
    var bunnies9 = "bo6b$2o5bo$6bob$6bob$5bo2b$4bo3b$4bo!";//metushelah 9
    var corner = "4bo$2bobo$b2obo2$3o!"; // part of lidka 9
    var acorn = "bo$3bo$2o2b3o!"; //metushelah 7
    var acornUp = "o$obo2$bo$o$o$o!";//metushelah 7
    var acornRight = "5bo$3bo$3o2b2o!";//metushelah 7
    var bunnies = "o5bob$2bo3bob$2bo2bobo$bobo!";//metushelah 9
    var switchEngine = "bobo$o$bo2bo$3b3o!";//metushelah 8
    var switchEngineRotated = "2bo$bobo2$o2bo$2o$o!";//metushelah 8
    var multum = "2$b2o$bo$bo$2bo$3bo$4bo!";//metushelah 7
    var lidka = "bo7b$obo6b$bo7b8$8bo$6bobo$5b2obo2$4b3o!";//metushelah 13
    var eater = "2o2b$obob$2bob$2b2o!";//size = 7
    var rightPuffer2 = "3bo$4bo$o3bo$b4o4$o$b2o$2bo$2bo$bo3$3bo$4bo$o3bo$b4o!";// messy puffer 22
    var leftPuffer2 = "bo$o$o3bo$4o4$4bo$2b2o$2bo$2bo$3bo3$bo$o$o3bo$4o!";// messy puffer 22
    var spaceShip = "3o$o2bo$o$o$bo!";//lightweight spaceShip 8
    var lGlider = "3o$o$bo!";//glider 5
    var jaydot = "b2o$3o2$bo$b2o$o!";//metushelah 9
    var rGlider = "3o$2bo$bo!";//glilder 5
    var largeExploder = "bo5bo$3o3b3o!";//pre pulsar 8
    var puffer2 = "b3o11b3o$o2bo10bo2bo$3bo4b3o6bo$3bo4bo2bo5bo$2bo4bo8bo!";// messy puffer 22
    var coeRake = "3b4o$2b6o$2b4ob2o$6b2o6bo$15bo$11bo3bo$12b4o3$12b3o$11b5o$10b4ob2o$14b\n2o3$5bo$6bo$o5bo$b6o!";// messy puffer 52
    var gosperGliderGun = "24bo11b$22bobo11b$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o14b$2o8b\no3bob2o4bobo11b$10bo5bo7bo11b$11bo3bo20b$12b2o!";
    var rpentomino = "o$b2o$bo!"; //metushelah 5
    var preblock = "2o$o!";// pre block 3
    var bunny = "2bo$2o$2bo!";//pre traffic light 4
    var smallExploder = "bo$3o$obo$bo!";//pre Honey farm 7
    var gliderDozen = "2o2bo$o3bo$o2b2o!"// evolves into still lifes and shoots 3 gliders to all 4 corners cost=8
    var rotatedGliderDozen = "3o$o2$2bo$3o!";
    var zap = "o$2o$bo!";// creates a boat(6) costs:4
    var blinker = "3o!";
    var line2 = "2o!";
    var pixel = "1o!";
    var doubleShot = "b3o5b3o$o2bo4bo2bo$3bo7bo$3bo7bo$2bo7bo!";

    function registerArmy() {
        window.registerArmy({
            name: 'SRF-GLADIATORS',
            icon: 'gladiator',
            cb: cb
        });
    }
    function getRandom() {
        return Math.random();
    }
    setTimeout(registerArmy, 0);

    var plan = {
        ongoing: [
            'spaceShip',
        ]
    };
    var bottomIndex = 0;
    var shipRowPos = 0;

    var lidkaPos = 0.47 + getRandom() * 0.06;
    var rightPufferPos = 0.80 + getRandom() * 0.1;
    var leftPufferPos = 0.30 + getRandom() * 0.14;
    var trafficIndex = 0;
    var exploderIndex = 0;
    var pufferRangeIdx = 0;
    var planIndex = 0;
    var planOnceIndex = 0;
    var shipIndex = 0;
    var gliderIndex = 0;
    var blockIndex = 0;
    var lexploderIndex = 0;

    var shipRowWidth = 0.09;
    var shipRowBurst = 200;
    var shipRowSpacing = 4;
    var shipRowMiddle = true;

    function cb(data) {
        var pixels = [];


        if (data.generation % 100 == 0) {
            //console.log("gen: " + data.generation);
        }

        if (data.generation % shipRowBurst == 0) {
            shipRowPos = getRandom() * 0.93;
            if (data.generation < 850) {
                while ((shipRowPos > lidkaPos - 0.12 && shipRowPos < lidkaPos + 0.12)
                    || (shipRowPos > rightPufferPos - 0.15 && shipRowPos < rightPufferPos + 0.12)
                    || (shipRowPos > leftPufferPos - 0.12 && shipRowPos < leftPufferPos + 0.12))
                // while ((shipRowPos > leftPufferPos - 0.15 && shipRowPos < rightPufferPos + 0.15) )
                {
                    shipRowPos = getRandom() * 0.93;
                }

                //console.log(">>>not allowed bigger than: " + ((leftPufferPos - 0.15) * data.cols) + " smaller than: " + ((rightPufferPos + 0.15) * data.cols));
                //console.log(">>>pos = " + shipRowPos * data.cols);
            }
            if (shipRowPos + shipRowWidth > 1)
                shipRowPos = 1 - shipRowWidth - 0.02;
        }

        if (data.generation == 1) {
            shipRowWidth = 0.09;
            shipRowBurst = 200;
            shipRowSpacing = 4;
            shipRowMiddle = true;


            bottomIndex = 0;
            blockIndex = 0;
            exploderIndex = 0;
            trafficIndex = 0;
            shipIndex = 0;
            gliderIndex = 0;
            planOnceIndex = 0;
            lexploderIndex = 0;
            plan = {
                once: [
                    //'dozen','dozen',


                    'rightPuffer',
                    'lidka',
                    'leftPuffer',
                ],
                ongoing: [
                    'sidePuffer',
                    'sidePuffer',
                    'puffer',
                    'shipRow',
                    'shipRow',
                    'shipRow',
                    'shipRow',
                    'shipRow',
                    'shipRow',
                ]
            };
            planIndex = 0;
        }
        if (data.generation == 67) {

            plan = {
                once: [
                    //  'leftBattlement',
                    //'rightBattlement'
                ],
                ongoing: [
                    'defences',
                    //'exploderRow'
                ]

            };
            planIndex = 0;
            planOnceIndex = 0;
            //return tryPlaceRle(data, acorn, 300, 60, 7);
        }
        if (data.generation == 250) {

            plan = {
                once: [
                    'rightShip',
                    'leftShip',
                ],
                ongoing: [

                    'shipRow', 'shipRow', 'shipRow', 'shipRow', 'shipRow',
                    'defences',
                ]
            };
            planIndex = 0;
            planOnceIndex = 0;
        }
        if (data.generation == 800) {
            shipRowWidth = 0.08;
            shipRowBurst = 30;
            shipRowSpacing = 2;
            shipRowMiddle = false;

            plan = {
                once: [

                ],
                ongoing: [
                    //'gliderRow',
                    //'spaceShip',
                    // 'acornUp',
                    //'trafficRow',
                    //'dozen', 'blockRow', 
                    'shipRow', 'shipRow', 'shipRow', 'shipRow', 'shipRow',
                    // 'defences',
                    //  'defences',
                    // 'multum'
                ]
            };
            planIndex = 0;
            planOnceIndex = 0;
        }
        if (data.generation == 1100) {
            plan = {
                once: [

                ],
                ongoing: [
                    //'gliderRow',
                    //'spaceShip', 'spaceShip', 'spaceShip', 'spaceShip',
                    //'dozen',
                    'shipRow', 'shipRow', 'shipRow','shipRow','shipRow',
                    //'rightMag',
                    //'leftMag',
                    //'upperDefenceChaos',
                    //'lowerDefenceRand',
                    'acornUp','acornUp',
                    //  'bottomUpRow',
                    // 'multum'
                ]
            };
            planIndex = 0;
            planOnceIndex = 0;
        }
   

        // ---- once ----

        if (plan.once && planOnceIndex != plan.once.length) {
            var actionName = plan.once[planOnceIndex];
            pixels = getActionPixels(data, actionName);

            if (pixels.length > 0) {
                planOnceIndex++;
            }
        }

        // -----ongoing-----
        if (pixels.length == 0) {
            pixels = getActionPixels(data, plan.ongoing[planIndex]);

            if (pixels == null || pixels.length > 0) {
                planIndex = (planIndex + 1) % plan.ongoing.length;
            }
        }

        if (!pixels)
            pixels = [];

        return pixels;
    }

    function getActionPixels(data, actionName) {
        pixels = [];
        switch (actionName) {
            case 'blocker':
                pixels = tryPlaceBlocker(data);
                break;
            case 'rightPuffer':
                pixels = tryPlacePuffer2(data, [rightPufferPos]);
                break;
            case 'leftPuffer':
                pixels = tryPlacePuffer2(data, [leftPufferPos]);
                break;
            case 'sidePuffer':
                pixels = tryPlacePuffer2(data, [getRandom() * 0.25, 0.70 + getRandom() * 0.24]);
                break;
            case 'puffer':
                pixels = tryPlacePuffer2(data);
                break;
            case 'glider':
                pixels = tryPlaceGlider(data);
                break;
            case 'gliderGun':
                pixels = tryPlaceGliderGun(data);
                break;
            case 'sExploder':
                pixels = tryPlaceSmallExploder(data);
                break;
            case 'multum':
                pixels = tryPlaceRleFront(data, multum, 7);
                break;
            case 'dozen':
                //pixels = tryPlaceRleFront(data, gliderDozen, 8);
                pixels = tryPlaceShape(
                    data,
                    8,//singleShapeCost,
                    0.01 * getRandom(),//heightPrecentage,
                    getRandom(),//widthPrecentage,
                    gliderDozen//rleStringOrPixelFunct
                );
                break;
            case 'lidka':
                pixels = tryPlaceShape(data, 22, 0, lidkaPos, puffer2, 13);
                break;
            case 'rightShip':
                pixels = tryPlaceShape(data, 8, 0, 1, spaceShip, 4);
                break;
            case 'leftShip':
                pixels = tryPlaceShape(data, 8, 0, 0.0025, spaceShip, 4);
                break;
            case 'leftMag':
                pixels = tryPlaceShape(
                    data,
                    8,//singleShapeCost,
                    0,//heightPrecentage,
                    0.01 + 0.03 * getRandom(),//widthPrecentage,
                    spaceShip//rpentomino//rleStringOrPixelFunct
                );
                break;
            case 'rightMag':
                pixels = tryPlaceShape(
                    data,
                    8,//singleShapeCost,
                    0,//heightPrecentage,
                    0.9 + 0.03 * getRandom(),//widthPrecentage,
                    spaceShip//rpentomino//rleStringOrPixelFunct
                );
                break;
            case 'leftLazer':
                pixels = tryPlaceShape(
                    data,
                    5,//singleShapeCost,
                    0,//heightPrecentage,
                    0.01 + 0.1 * getRandom(),//widthPrecentage,
                    rGlider//rpentomino//rleStringOrPixelFunct
                );
                break;
            case 'rightLazer':
                pixels = tryPlaceShape(
                    data,
                    5,//singleShapeCost,
                    0,//heightPrecentage,
                    0.9 + 0.09 * getRandom(),//widthPrecentage,
                    lGlider//rpentomino//rleStringOrPixelFunct
                );
                break;
            case 'lowerDefenceRand':
                pixels = tryPlaceShape(
                    data,
                    3,//singleShapeCost,
                    0.3 + (0.70 * getRandom()),//heightPrecentage,
                    getRandom(),//widthPrecentage,
                    preblock//rpentomino//rleStringOrPixelFunct
                );
                break;
            case 'doubleShot':
                pixels = tryPlaceShape(
                    data,
                    16,//singleShapeCost,
                    0,//heightPrecentage,
                    getRandom() * 0.97,//widthPrecentage,
                    doubleShot//rleStringOrPixelFunct
                );
                break;
            case 'acornUp':
                pixels = tryPlaceShape(data, 7, 0.87, getRandom() * 0.94, acorn, 3);
                break;
            case 'exploderRow':
                pixels = tryPlaceMultipleShapes(
                    data,
                    8,//singleShapeCost,
                    largeExploder,//shapePixelFunct,
                    1,//numberOfShapeLines,
                    lexploderIndex,// currShapeCount,
                    13,// shapeLength,
                    5,// leftPadding,
                    5,// rightPadding,
                    0.2,// heightPrecentage,
                    10,// lineShift,
                    15,// maxSpaceBetweenShapes,
                    5,// interLineSpacing
                    true, //stop on end
                    false //towards middle
                );
                if (pixels.length > 0) {
                    ++lexploderIndex;
                }
                break;
            case 'blockRow':
                pixels = tryPlaceMultipleShapes(
                    data,
                    3,//singleShapeCost,
                    preblock,//shapePixelFunct,
                    7,//numberOfShapeLines,
                    blockIndex,// currShapeCount,
                    2,// shapeLength,
                    1,// leftPadding,
                    1,// rightPadding,
                    0.90,// heightPrecentage,
                    6,// lineShift,
                    9,// maxSpaceBetweenShapes,
                    -9,// interLineSpacing
                    false, //stop on end
                    true //towards middle
                );
                if (pixels.length > 0) {
                    ++blockIndex;
                }
                break;
            case "shipRow":

                pixels = tryPlaceMultipleShapes(
                    data,
                    8,//singleShapeCost,
                    spaceShip,//shapePixelFunct,
                    1,//numberOfShapeLines,
                    shipIndex,// currShapeCount,
                    4,// shapeLength,
                    2,// leftPadding,
                    0,// rightPadding,
                    0,// heightPrecentage,
                    0,// lineShift,
                    shipRowSpacing,// maxSpaceBetweenShapes,
                    10,// interLineSpacing
                    false, //stop on end
                    shipRowMiddle, //towards middle
                    shipRowPos,
                    shipRowPos + shipRowWidth
                );
                if (pixels.length > 0) {
                    ++shipIndex;
                }
                break;
            case "gliderRow":

                pixels = tryPlaceMultipleShapes(
                    data,
                    5,//singleShapeCost,
                    lGlider,//shapePixelFunct,
                    2,//numberOfShapeLines,
                    gliderIndex,// currShapeCount,
                    4,// shapeLength,
                    5,// leftPadding,
                    5,// rightPadding,
                    0,// heightPrecentage,
                    10,// lineShift,
                    15,// maxSpaceBetweenShapes,
                    0,// interLineSpacing
                    false,//stop at end
                    true //towards middle 
                );
                if (pixels.length > 0) {
                    ++gliderIndex;
                }
                break;
            case 'leftBattlement':
                pixels = tryPlaceShape(
                    data,
                    7,//singleShapeCost,
                    0.60,//heightPrecentage,
                    0.05,//widthPrecentage,
                    acorn//rleStringOrPixelFunct
                );
                break;
            case 'rightBattlement':
                pixels = tryPlaceShape(
                    data,
                    7,//singleShapeCost,
                    0.60,//heightPrecentage,
                    0.97,//widthPrecentage,
                    acorn//rleStringOrPixelFunct
                );
                break;
            case 'eater':
                pixels = tryPlaceShape(
                    data,
                    7,//singleShapeCost,
                    0.1,//heightPrecentage,
                    Math.random(),//widthPrecentage,
                    eater//rleStringOrPixelFunct
                );
                break;
            case 'defences':
                pixels = tryPlaceMultipleShapes(
                    data,
                    7,//singleShapeCost,
                    acorn,//shapePixelFunct,
                    3,//numberOfShapeLines,
                    exploderIndex,// currShapeCount,
                    7,// shapeLength,
                    15,// leftPadding,
                    15,// rightPadding,
                    0.84,// heightPrecentage,
                    15,// lineShift,
                    45,// maxSpaceBetweenShapes,
                    -26,// interLineSpacing
                    false,
                    true
                );

                if (pixels.length > 0) {
                    ++exploderIndex;
                }
                break;
            case 'bottomUpRow':
                pixels = tryPlaceMultipleShapes(
                    data,
                    7,//singleShapeCost,
                    acorn,//shapePixelFunct,
                    1,//numberOfShapeLines,
                    bottomIndex,// currShapeCount,
                    3,// shapeLength,
                    15,// leftPadding,
                    15,// rightPadding,
                    0.85,// heightPrecentage,
                    6,// lineShift,
                    35,// maxSpaceBetweenShapes,
                    15,// interLineSpacing
                    false,
                    true
                );

                if (pixels && pixels.length > 0) {
                    ++bottomIndex;
                }
                break;
            case 'trafficRow':
                pixels = tryPlaceMultipleShapes(
                    data,
                    4,//singleShapeCost,
                    bunny,//shapePixelFunct,
                    4,//numberOfShapeLines,
                    trafficIndex,// currShapeCount,
                    3,// shapeLength,
                    5,// leftPadding,
                    5,// rightPadding,
                    0.48,// heightPrecentage,
                    6,// lineShift,
                    10,// maxSpaceBetweenShapes,
                    15,// interLineSpacing
                    false,
                    true
                );

                if (pixels.length > 0) {
                    ++trafficIndex;
                }
                break;
            case 'lExploder':
                pixels = tryPlaceLargeExploder(data);
                break;
            case 'spaceShip':
                pixels = tryPlaceSpaceship(data);
                break;
            case 'fullRangePuffer':
                pixels = tryPlacePuffer2(data, [getRandom()], 0);
                break;
            case 'rake':
                pixels = tryPlaceCoeRake(data, 80, 30);
                break;
        }
        return pixels;
    }
    function tryPlaceLargeExploder(data) {

        return tryPlaceRleRand(data, largeExploder, 8);
    }

    function tryPlaceSmallExploder(data) {
        var pixels = [];
        var r, c;
        if (data.budget >= 7) {
            c = Math.floor(getRandom() * (data.cols - 1));
            r = Math.floor(getRandom() * (data.rows - 1));
            pixels = getExploderPixels(c, r);
        }
        return pixels;
    }

    function tryPlaceCoeRake(data, c, r) {
        return tryPlaceRle(data, coeRake, c, r, 52);
    }

    function tryPlaceRleRand(data, rle, neededBudget) {
        c = Math.floor(getRandom() * (data.cols - 1));
        r = Math.floor(getRandom() * (data.rows - 1));
        return tryPlaceRle(data, rle, c, r, neededBudget);
    }

    function tryPlaceRleFront(data, rle, neededBudget) {
        c = Math.floor(getRandom() * (data.cols - 1));
        r = 0;
        return tryPlaceRle(data, rle, c, r, neededBudget);
    }

    function tryPlaceRle(data, rle, c, r, neededBudget) {
        var pixels = [];

        if (data.budget >= neededBudget) {
            pixels = getPixelsFromRle(rle, c, r);
        }
        return pixels;
    }

    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    function tryPlaceShape(
        data,
        singleShapeCost,
        heightPrecentage,
        widthPrecentage,
        rleStringOrPixelFunct,
        shapeWidth
    ) {
        shapeWidth = shapeWidth || 2;
        var pixels = [];
        var r, c;
        if (data.budget < singleShapeCost)
            return pixels;

        var vPos = Math.floor(heightPrecentage * data.rows);
        var hPos = Math.floor(widthPrecentage * data.cols);

        if (widthPrecentage == 1)
            hPos = hPos - shapeWidth;

        if (isFunction(rleStringOrPixelFunct)) {
            pixels = rleStringOrPixelFunct(
                hPos,
                vPos,
                pixels
            );
        }
        else {
            pixels = getPixelsFromRle(rleStringOrPixelFunct, hPos, vPos, pixels);
        }
        return pixels;
    }

    function tryPlaceMultipleShapes(
        data,
        singleShapeCost,
        rleStringOrPixelFunct,
        numberOfShapeLines,
        currShapeCount,
        shapeLength,
        leftPadding,
        rightPadding,
        heightPrecentage,
        lineShift,
        maxSpaceBetweenShapes,
        interLineSpacing,
        stopAtEnd,
        towardsMiddle,
        widthPrecentStart,
        widthPrecentEnd

    ) {
        var pixels = [];
        var r, c;
        if (data.budget < singleShapeCost)
            return pixels;
        widthPrecentStart = widthPrecentStart || 0;
        widthPrecentEnd = widthPrecentEnd || 1;
        lineLen = widthPrecentEnd * data.cols - widthPrecentStart * data.cols;

        var nettLineLength = lineLen - leftPadding - rightPadding;
        leftPadding = leftPadding + widthPrecentStart * data.cols;
        var numberOfShapesInline = Math.ceil((nettLineLength - shapeLength) / (shapeLength + maxSpaceBetweenShapes));
        var lineNumber = Math.floor(currShapeCount / numberOfShapesInline);


        //exit with nothing if done.
        if (stopAtEnd && lineNumber >= numberOfShapeLines) {
            //return null indicate we want to skip our turn.
            return null;
        }
        if (!stopAtEnd && lineNumber >= numberOfShapeLines) {
            lineNumber = lineNumber % numberOfShapeLines;
        }

        var actualSpaceBetweenShapes = (nettLineLength - shapeLength * numberOfShapesInline) / (numberOfShapesInline - 1)
        var horizontalShift = lineShift * (lineNumber % 2); // shift line into padding area on odd rows
        var verticalDrift = (interLineSpacing * (lineNumber % numberOfShapeLines)); // each line will be lower then previous one unless spacing is negative
        var startHeight = heightPrecentage * data.rows;
        var posInCurrLine = (currShapeCount % numberOfShapesInline);
        if (towardsMiddle) {
            if (posInCurrLine % 2 == 0) {
                posInCurrLine = posInCurrLine / 2;
            }
            else {
                posInCurrLine = numberOfShapesInline - 1 - ((posInCurrLine - 1) / 2);
            }
        }
        var hPos = Math.floor(leftPadding + posInCurrLine * (actualSpaceBetweenShapes + shapeLength) + horizontalShift);

        if (isFunction(rleStringOrPixelFunct)) {
            pixels = rleStringOrPixelFunct(
                hPos,
                startHeight + verticalDrift,
                pixels
            );
        }
        else {
            pixels = getPixelsFromRle(rleStringOrPixelFunct, hPos, startHeight + verticalDrift, pixels);
        }
        return pixels;
    }


    function tryPlaceSpaceship(data, heightPrecentage) {
        var pixels = [];
        var r, c;
        if (data.budget >= 8) {
            var rand = getRandom();
            //avoid shooting the middle of the field
            // while (rand < 0.7 && rand > 0.3) {
            //     rand = getRandom();
            // }
            c = Math.floor(rand * (data.cols - 4));

            if (!heightPrecentage)
                heightPrecentage = 0;

            r = heightPrecentage * data.rows;

            if (c < data.cols / 2) {
                pixels.push([c + 1, r]);
                pixels.push([c + 2, r]);
                pixels.push([c + 3, r]);
                pixels.push([c, r + 1]);
                pixels.push([c + 3, r + 1]);
                pixels.push([c + 3, r + 2]);
                pixels.push([c + 3, r + 3]);
                //pixels.push([c, r+4]);
                pixels.push([c + 2, r + 4]);
            } else {
                pixels.push([c, r]);
                pixels.push([c + 1, r]);
                pixels.push([c + 2, r]);
                pixels.push([c, r + 1]);
                pixels.push([c + 3, r + 1]);
                pixels.push([c, r + 2]);
                pixels.push([c, r + 3]);
                pixels.push([c + 1, r + 4]);
                //pixels.push([c+3, r+4]);				
            }
        }
        return pixels;
    }


    function tryPlacePuffer2(data, ranges, heightPrecentage) {
        var pixels = [];
        var r, c;

        if (!heightPrecentage)
            heightPrecentage = 0;

        r = heightPrecentage * data.rows;

        var ranges = ranges || [
            0.25 + getRandom() * 0.15,
            0.4 + getRandom() * 0.2,
            0.6 + getRandom() * 0.15,
        ];
        var range = ranges[pufferRangeIdx % ranges.length];

        c = Math.floor(data.cols * range - 1);

        var pixels = tryPlaceRle(data, puffer2, c, r, 22);

        if (pixels.length > 0)
            pufferRangeIdx++;

        return pixels;
    }

    function get5MetuselahPixels(c, r, pixels) {
        if (!pixels) {
            pixels = [];
        }
        pixels.push([c, r]);
        pixels.push([c, r - 1]);
        pixels.push([c, r + 1]);
        pixels.push([c - 1, r]);
        pixels.push([c + 1, r + 1]);
        return pixels;
    }

    function getExploderPixels(c, r, pixels) {

        return getPixelsFromRle(smallExploder, c, r, pixels);
    }

    function tryPlaceBlocker(data) {
        var pixels = [];
        var r, c;
        if (data.budget >= 4) {
            c = Math.floor(getRandom() * (data.cols - 1));
            r = Math.floor(getRandom() * (data.rows - 1));
            pixels.push([c, r]);
            pixels.push([c, r + 1]);
            pixels.push([c + 1, r]);
            pixels.push([c + 1, r + 1]);
        }
        return pixels;
    }

    function tryPlaceGlider(data) {

        var c = Math.floor(getRandom() * (data.cols - 2));
        return tryPlaceRle(data, lGlider, c, 0, 5);
    }

    function getPixelsFromRle(rle, c, r, pixels) {
        var pixels = [];
        var num = '';
        var x = 0;
        var y = 0;
        var l;

        for (var s in rle) {
            var s = rle[s];
            if (s === 'b') {
                x = num === '' ? x + 1 : x + parseInt(num);
                num = '';
            }
            else if (s === 'o') {
                var i = num === '' ? 1 : parseInt(num);
                while (i--)
                    pixels.push([c + x + i, r + y]);

                x = num === '' ? x + 1 : x + parseInt(num);
                num = '';
            }
            else if (s === '$') {
                y += num === '' ? 1 : parseInt(num);
                x = 0;
                num = '';
            }
            else if (s === '!')
                break;
            else if (parseInt(s).toString() !== 'NaN') {
                num += s;
            }
        }
        return pixels;
    };

    function tryPlaceGliderGun(data) {
        var pixels = [];
        var r, c;
        c = Math.floor(getRandom() * (data.cols - 1));
        r = 20;
        return tryPlaceRle(data, gosperGliderGun, c, r, 36);
    }
})();
