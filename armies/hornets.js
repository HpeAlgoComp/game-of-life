//IMPROVE THIS CODE

(function() {

    //REGISTER ARMY
    setTimeout(function registerArmy() {
        window.registerArmy({
            name: 'TRACE-HORNETS',
            icon: 'hornet',
            cb: cb
        });
    }, 0);

    //--------
    //Utils
    //--------
    function getRnd(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function tryPlaceLightSpaceship(data, col, row) {
        var pixels = [];
        var r, c;
        if (data.budget >= 9) {
            c = col;
            r = row;
            pixels.push([c, r]);
            pixels.push([c+1, r]);
            pixels.push([c+2, r]);
            pixels.push([c, r+1]);
            pixels.push([c+3, r+1]);
            pixels.push([c, r+2]);
            pixels.push([c, r+3]);
            pixels.push([c+1, r+4]);
            pixels.push([c+3, r+4]);
        }
        return pixels;
    }

    function tryPlaceFlippedPentomino(data, col, row) {
        var pixels = [];
        var r, c;
        if (data.budget >= 5) {
            c = col;
            r = row;
            pixels.push([c+1, r]);
            pixels.push([c+1, r+1]);
            pixels.push([c+2, r+1]);
            pixels.push([c, r+2]);
            pixels.push([c+1, r+2]);
        }
        return pixels;
    }


    //--------
    //Algorithm
    //--------
    var currentPlan;
    var defenceXLocation;
    var defenceYLocation;
    var attackXLocation;
    var pentominoCounter;
    var defenceYLocationUP;
    var defenceYLocationDOWN;
    var isRightSide;
    var fastAttackCounter;
    var flowerXLocation;
    var flowerYLocation;
    var attackFlip;


    function cb(data) {
        var pixels = [];
        //init
        if (data.generation === 1) {
            currentPlan = "fastAttack";
            defenceXLocation = 5;
            defenceYLocation = 50;
            defenceYLocationUP = 20;
            defenceYLocationDOWN = 70;
            attackXLocation = 30;
            pentominoCounter = 0;
            isRightSide = true;
            fastAttackCounter = 0;
            flowerXLocation = 5;
            flowerYLocation = 50;
            attackFlip = 0;
        }

        if (currentPlan === 'fastAttack') {
            pixels = tryPlaceLightSpaceship(data, isRightSide ? data.cols - 4 : 1, 1);
            if (pixels.length > 0) {
                fastAttackCounter += 1;
            }
            isRightSide = !isRightSide;

            if (fastAttackCounter > 8) {
                currentPlan = "defence";
            }
        }

        else if (currentPlan === 'defence') {
            if (pentominoCounter === 0) {
                defenceXLocation = 5;
            }

            // if (defenceXLocation < 0) {
            //     console.log("defence:" + defenceXLocation);
            // }

            pixels = tryPlaceFlippedPentomino(data, isRightSide ? ((data.cols - 4) - defenceXLocation) : defenceXLocation, defenceYLocation);

            if (pixels.length > 0) {
                if (pentominoCounter > 14) {
                    currentPlan = "attack";
                }
                pentominoCounter += 1;
                defenceXLocation += 25;
                isRightSide = !isRightSide;
            }

            if (defenceYLocation === defenceYLocationDOWN) {
                defenceYLocation = defenceYLocationUP;
            }
            else {
                defenceYLocation = defenceYLocationDOWN;
            }
        }
        else if (currentPlan === 'attack') {
            pixels = tryPlaceLightSpaceship(data, attackXLocation, 1);
            attackXLocation += getRnd(5, 15);
            if (attackXLocation >= data.cols - 30) {
                attackXLocation = 0;
            }
        }
        else if (currentPlan === 'finalPipe') {

            pixels = tryPlaceLightSpaceship(data, isRightSide ? data.cols - 4 : 1, 1);

            if (pixels.length > 0) {
                fastAttackCounter += 1;
            }
            isRightSide = !isRightSide;
        }

        attackFlip += 1;

        if (data.generation > 700) {
            if (attackFlip % 200 === 0) {
                if (currentPlan === 'attack') {
                    fastAttackCounter = 0;
                    currentPlan = 'finalPipe';
                }
                else {
                    attackXLocation = 30;
                    currentPlan = 'attack';
                    attackFlip = 0;
                }
            }
        }

        return pixels;
    };



})();
