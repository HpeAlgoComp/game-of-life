(function() {

               //REGISTER ARMY
  setTimeout(function registerArmy() {
                              window.registerArmy({
                                             name: 'OCD-TIGERS',
                                             icon: 'tiger',
                                             cb: cb
                              });
               }, 0);

               //ALGORITHM CODE
  var plan = [
                              'blocker', 
    'spaceship'
               ];
               var planIndex = 0;
               var cycle = 0;
  var isGunCreated = false;
               var defOffset, defStep, defCycle, defCycleMax = 4, c, r;
function setup(data) {
     defOffset = 3;
    defStep = 12;
    defCycle = 0;
    c = 0;
     r = data.rows - 20;
    cycle = 0;
  }

  function cb(data) {
     if (data.generation === 1) setup(data);
    
    var pixels = [];
    if (plan[planIndex] === 'blocker') {
      pixels = tryPlaceBlocker(data);
    }
    if (!pixels || plan[planIndex] === 'spaceship') {
      pixels = tryLightweightSpaceShip(data);
    }

    if (pixels.length > 0) {
      planIndex = (planIndex + 1) % plan.length;
    }
    cycle++;
    return pixels;
  }

  function tryLightweightSpaceShip(data) {
    var pixels = [];
    if (data.budget >= 9) {
      var c = (data.cols - 4) - (cycle % data.cols - 4);
      //var c = Math.floor(Math.random() * (data.cols - 1));
      var r = 0; //Math.floor(Math.random() * (data.rows - 1));
      pixels.push([c + 1, r]);
      pixels.push([c + 2, r]);
      pixels.push([c + 3, r]);
      pixels.push([c, r + 1]);
      pixels.push([c + 3, r + 1]);
      pixels.push([c + 3, r + 2]);
      pixels.push([c + 3, r + 3]);
      pixels.push([c, r + 4]);
      pixels.push([c + 2, r + 4]);
    }
    return pixels;
  }

  function tryPlaceBlocker(data) {
     if (defCycle === defCycleMax) return null;
     var pixels = [];
    if (data.budget >= 4) {
         if (c >= data.cols) {
                defCycle++;
                defOffset += defStep / 2;
                c = defOffset;
                r -= 7;
           }
           pixels.push([c, r]);
          pixels.push([c, r + 1]);
           pixels.push([c + 1, r]);
           pixels.push([c + 2, r]);
           c += defStep;
    }
    return pixels;
  }


})();
