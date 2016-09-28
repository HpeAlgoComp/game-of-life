



(function () {

  //REGISTER ARMY
  setTimeout(function registerArmy() {
    window.registerArmy({
      name: 'HPLN-KINGS',
      icon: 'king',
      cb: cb
    });
  }, 0);

  // utilities ---------------------------------------------------------------------------------------------------------

  function getRnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var gameController = {
    placeSmallship: 2,
    placeAcorn: 1,
    placeBigShip: 0,
    placeFence: 3,
    currentPlan: 0
  };

  var plan = [placeBigShip, placeAcorn, placeSmallship,placeFence];

  var bigShipColIndex = 0;
  var acornColIndex = 0;
  var acornRowIndex = 0;
  var smallShipLocationIndex = 0;
  var fenceBlockInitialLoc = 0;
  var fenceBlockCurrentLoc = fenceBlockInitialLoc;
  var fenceBlockColJump = 10;
  var fenceRowIndex = 0;


  function cb(data) {

    var pixels = [];

    if (data.generation === 1) {

      bigShipColIndex = 0;
      acornColIndex = 0;
      acornRowIndex = 0;
      fenceBlockCurrentLoc = 0;
      gameController.currentPlan = 0;
      //simpleShipColIndex = 0;
      //simpleShipRowIndex = 0;
    }


    pixels = plan[gameController.currentPlan](data);


    return pixels;
  }

  function placeAcorn(data) {

    var locations = [10, 390, 30, 350 , 130, 270, 180,220,200];
    var rowLocations = [30];
    acornColIndex = acornColIndex % locations.length;
    acornRowIndex = acornRowIndex % rowLocations.length;
    var pixels = [];
    var row = rowLocations[acornRowIndex];
    var col = locations[acornColIndex];


    if (data.budget >= 7) {
      pixels = library('acorn', col, row);
      acornColIndex++;

      if (acornColIndex === locations.length - 1) {
        gameController.currentPlan = gameController.placeSmallship;
      }
    }

    return pixels;
  }

  function placeBigShip(data) {

    var locations = [100, 200, 300];
    bigShipColIndex = bigShipColIndex % locations.length;
    var pixels = [];
    var row = 0;
    var col = locations[bigShipColIndex];


    if (data.budget >= 22) {
      pixels = library('train', col, row);

      if (bigShipColIndex === locations.length - 1) {
        gameController.currentPlan = gameController.placeAcorn;
      }

      bigShipColIndex++;
    }

    return pixels;
  }

  function placeSmallship(data) {

    var locations = [2, 395, 30, 365, 60, 270, 240, 210, 395, 100, 150, 200];

    smallShipLocationIndex = smallShipLocationIndex % locations.length;

    var currentLocation = locations[smallShipLocationIndex];
    var pixels = [];
    var row = 0;

    if (data.budget >= 9) {
      pixels = library('lwss', currentLocation, row);

      if (smallShipLocationIndex === locations.length - 1) {
        gameController.currentPlan = gameController.placeFence;
      }

      smallShipLocationIndex++;
    }

    return pixels;
  }

  function placeFence(data) {
    var rows = [40, 90];
    fenceRowIndex = fenceRowIndex % rows.length;
    var row = rows[fenceRowIndex];
    var pixels = [];


    if (data.budget >= 4) {
      pixels = library('block', fenceBlockCurrentLoc, row);

      fenceBlockCurrentLoc += fenceBlockColJump;

      if (fenceBlockCurrentLoc > 395) {
        fenceRowIndex++;
        fenceBlockCurrentLoc = 0;
        gameController.currentPlan = gameController.placeBigShip;
      }
    }

    return pixels;
  }

  function library(model, initialC, initialR) {
    var c = initialC,
      r = initialR,
      pixels = [],
      models = {
        lwss: "OOO\nO..O\nO\nO\n.O.O",
        acorn: ".O\n...O\nOO..OOO",
        upperacorn: "O\nO.O\n..\n.O\nO\nO\nO",
        train: ".OOO...........OOO\nO..O..........O..O\n...O....OOO......O\n...O....O..O.....O\n..O....O........O",
        block: ".O.\nOOO"
      }
    for (var i = 0, len = models[model].length; i < len; i++) {
      if (models[model][i] === '.') {
        c++;
      }
      else if (models[model][i] === 'O') {
        pixels.push([c, r]);
        c++;
      } else {
        c = initialC;
        r++;
      }
    }

    return pixels;

  }

})();


