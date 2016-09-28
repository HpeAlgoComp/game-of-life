(function() {

    //REGISTER ARMY
    setTimeout(function registerArmy() {
        window.registerArmy({
            name: 'OCTANE-OMG-PIRATES',
            icon: 'pirate',
            cb: piratesCb
        });
    }, 0);

    var counter = 0;
    var ssCol = 2;
    var popCol=0;
    var popRow = 70;

    function piratesCb(data) {

        function createSS(){
            counter++;
            ssCol+=4;
            if(ssCol > data.cols -8){
                ssCol = 4;
            }
            return tryPlaceSpaceship(data,ssCol+=4 ,6);
        }

        function createPop(){
            counter++;
            //popCol += 4;
            if(popCol > data.cols -8){
                popCol = 0;
                popRow -= 5;
                if(popRow < 50){
                    popRow = 90;
                }
            }
            return tryPlacePop(data,popCol +=4 ,popRow);
        }



        if (data.generation === 1) {
            counter = 0;
            popCol = 0;
            ssCol = 0;
            popRow = 70;
        }


        if(counter < 100){
            return createPop();
        }

        if(counter < 400){
            return createSS();
        }

        counter = 0;

        return tryPlaceGlider(data);
    }

    function tryPlaceGlider(data) {
        var pixels = [];
        var r, c;
        if (data.budget >= 5) {
            c = Math.floor(Math.random() * (data.cols - 2));
            r = 5;
            pixels.push([c, r]);
            pixels.push([c+1, r]);
            pixels.push([c+2, r]);
            pixels.push( Math.floor(Math.random()*2) === 0 ? [c, r+1] : [c+2, r+1]);
            pixels.push([c+1, r+2]);
        }
        return pixels;
    }



    function tryPlacePop(data, c, r) {
        var pixels = [];
        pixels.push([c, r]);
        pixels.push([c+1, r]);
        pixels.push([c+2, r]);
        pixels.push([c+1, r+1]);
        pixels.push([c, r+2]);
        return pixels;
    }
    function tryPlaceSpaceship(data, c, r) {

        var pixels = [];
        if (data.budget >= 9) {
            if (c < data.cols / 2) {
                pixels.push([c+1, r]);
                pixels.push([c+2, r]);
                pixels.push([c+3, r]);
                pixels.push([c, r+1]);
                pixels.push([c+3, r+1]);
                pixels.push([c+3, r+2]);
                pixels.push([c+3, r+3]);
                pixels.push([c, r+4]);
                pixels.push([c+2, r+4]);
            } else {
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
        }
        return pixels;
    }


})();


