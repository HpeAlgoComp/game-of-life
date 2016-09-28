(function() {

       function registerArmy() {
        window.registerArmy({
            name: 'INNOVATION-WIZARDS',
            icon: 'wizard',
            cb: cb
        });
    }

    setTimeout(registerArmy, 0);

    var plan = [ tryPlaceSmallExploder,tryPlaceSmallExploder, tryPlaceSpaceship];

    var planIndex = 0;
    var lastBlockerCol = 0;
    var blockerRound = 0;
    var rowCol = [0, 3, 6,12,15];
    var firstTime = 0;
    var defenceIndex = [];

    function init() {
        defenceIndex = [];
        plan = [tryPlaceSmallExploder, tryPlaceSmallExploder, tryPlaceSpaceship];
        planIndex = 0;
        lastBlockerCol = 0;
        blockerRound = 0;
        rowCol = [0, 3, 6, 12, 15];
        firstTime = 0;
        for (var i = 0; i < 22; i++) {
                        defenceIndex.push(10+i * 18);
                }
    }

    function cb(data) {
        var pixels = [];
        if (data.generation <= 1) init();
        planIndex = planIndex % plan.length;
        pixels = plan[planIndex](data);
        if (pixels.length > 0) {
            planIndex = (planIndex + 1) % plan.length;
        }
        return pixels;
    }

    function tryPlaceBlocker(data) {
        var pixels = [];
        var r, c;
        if (data.budget >= 3) {
            c = lastBlockerCol*15+rowCol[blockerRound];
            r = data.rows - (5 - blockerRound)*5-20;
            pixels.push([c, r+1]);
            pixels.push([c+1, r]);
            pixels.push([c, r]);
            lastBlockerCol++;
            if (data.cols < (lastBlockerCol * 15 + rowCol[blockerRound]+2)) {
                lastBlockerCol = 0;
                blockerRound++;
                if (firstTime==0) {
                    plan.push(tryPlaceSpaceship);
                    plan.push(tryPlaceBlocker);
                }
                if (blockerRound == 3 && firstTime==0) {
                    firstTime++;
                    plan = [tryPlaceBlocker, tryPlaceSpaceship, tryPlaceBlocker,tryPlaceSpaceshipRow, tryPlaceSpaceship, tryPlaceSmallExploder, tryPlaceBlocker];
                }
                if (blockerRound == 5) {
                    blockerRound = 0;
                    plan.push(tryPlaceBigSpaceship);
                    //plan.push(tryPlace10CellLine);
                    plan.push(tryPlaceBeehive); 
                    plan.push(tryPlaceGlider);
                    plan.push(tryPlaceGlider);
                    plan.push(tryPlaceExploder);
                }
                rowCol[blockerRound] = rowCol[blockerRound] + 3;
                if (rowCol[blockerRound] == 15) rowCol[blockerRound] = 0;
            }
        }
        return pixels;
    }

    function tryPlace10CellLine(data) {
        var pixels = [];
        var r, c;
       
        if (data.budget >= 10) {
            c = Math.floor(Math.random() * (data.cols - 11));
            r = 0;
            pixels.push([c, r ]);
            pixels.push([c, r+ 1]);
            pixels.push([c, r + 2]);
            pixels.push([c, r + 3]);
            pixels.push([c, r+4]);
            pixels.push([c, r + 5]);
            pixels.push([c, r + 6]);
            pixels.push([c, r+7]);
            pixels.push([c, r + 8]);
            pixels.push([c, r + 9]);
        }
        return pixels;
    }

    function tryPlaceGlider(data) {
        var pixels = [];
        var r, c;
        if (data.budget >= 5) {
            c = Math.floor(Math.random() * (data.cols - 3));
            r = 0;
            pixels.push([c, r]);
            pixels.push([c+1, r]);
            pixels.push([c+2, r]);
            pixels.push( Math.floor(Math.random()*2) === 0 ? [c, r+1] : [c+2, r+1]);
            pixels.push([c+1, r+2]);
        }
        return pixels;
    }

    function tryPlaceSmallExploder(data) {
        var pixels = [];
        var r, c;
        if (defenceIndex.length <= 0) {
            plan=[ tryPlaceBlocker, tryPlaceSpaceship];
        }
        if (data.budget >= 6) {
            ran = Math.floor(Math.random() * (defenceIndex.length));
            c = defenceIndex[ran];
            defenceIndex.splice(ran, 1);
            r = 45;
            pixels.push([c, r]);
            pixels.push([c, r+1]);
            pixels.push([c - 1, r + 1]);
            pixels.push([c - 1, r + 2]);
            pixels.push([c + 1, r + 2]);
            pixels.push([c , r + 3]);
        }
        return pixels;
    }

    function tryPlaceExploder(data) {
        var pixels = [];
        var r, c;
        if (data.budget >= 12) {
            c = 10 + Math.floor(Math.random() * (data.cols - 20));
            r = Math.floor(Math.random() * 50);
            pixels.push([c, r]);
            pixels.push([c, r + 1]);
            pixels.push([c, r + 2]);
            pixels.push([c , r + 3]);
            pixels.push([c, r + 4]);
            pixels.push([c + 4, r]);
            pixels.push([c + 4, r + 1]);
            pixels.push([c + 4, r + 2]);
            pixels.push([c + 4, r + 3]);
            pixels.push([c+4, r + 4]);
            pixels.push([c + 2, r]);
            pixels.push([c+2, r + 4]);
        }
        return pixels;
    }

    function tryPlaceBeehive(data) {
        var pixels = [];
        var r, c;
        if (data.budget >= 6) {
            c = 1+Math.floor(Math.random() * (data.cols - 2));
            r = 1+Math.floor(Math.random() * (data.rows - 2));
            pixels.push([c, r - 1]);
            pixels.push([c + 1, r - 1]);
            pixels.push([c - 1, r]);
            pixels.push([c + 2, r]);
            pixels.push([c, r + 1]);
            pixels.push([c + 1, r + 1]);
        }
        return pixels;
    }

    var BigSpaceshipLastCOL = 0;
    var BigSpaceshipCount = 0;

    function tryPlaceBigSpaceship(data) {
        var pixels = [];
        var r, c;
        if (data.budget >= 12) {
            c = Math.floor(Math.random() * (data.cols - 5));
            r = 0;
            pixels.push([c + 2, r]);
            pixels.push([c + 1, r + 1]);
            pixels.push([c + 2, r + 1]);
            pixels.push([c + 3, r + 1]);
            pixels.push([c, r + 2]);
            pixels.push([c + 1, r + 2]);
            pixels.push([c + 3, r + 2]);
            pixels.push([c, r + 3]);
            pixels.push([c + 1, r + 3]);
            pixels.push([c + 2, r + 3]);
            pixels.push([c + 1, r + 4]);
            pixels.push([c + 2, r + 4]);
        }
        return pixels;
    }

    function tryPlaceSpaceshipRow(data) {
        var pixels = [];
        var r, c;
        if (data.budget >= 9) {
            if (BigSpaceshipCount == 0) {
                BigSpaceshipLastCOL = Math.floor(Math.random() * (data.cols - 5));
                BigSpaceshipCount = 2;
            }
            else BigSpaceshipCount--;
            c = BigSpaceshipLastCOL;
            r = 0;
            if (c < data.cols / 2) {
                pixels.push([c + 1, r]);
                pixels.push([c + 2, r]);
                pixels.push([c + 3, r]);
                pixels.push([c, r + 1]);
                pixels.push([c + 3, r + 1]);
                pixels.push([c + 3, r + 2]);
                pixels.push([c + 3, r + 3]);
                pixels.push([c, r + 4]);
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
                pixels.push([c + 3, r + 4]);
            }
        }
        return pixels;
    }

    function tryPlaceSpaceship(data) {
        var pixels = [];
        var r, c;
        if (data.budget >= 9) {
            c = Math.floor(Math.random() * (data.cols - 4));
            r = 0;
            if (c < data.cols / 2) {
                pixels.push([c + 1, r]);
                pixels.push([c + 2, r]);
                pixels.push([c + 3, r]);
                pixels.push([c, r + 1]);
                pixels.push([c + 3, r + 1]);
                pixels.push([c + 3, r + 2]);
                pixels.push([c + 3, r + 3]);
                pixels.push([c, r + 4]);
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
                pixels.push([c + 3, r + 4]);
            }
        }
        return pixels;
    }

})();
