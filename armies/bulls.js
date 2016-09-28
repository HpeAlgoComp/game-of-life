/**
 * Created by bennun on 12/09/2016.
 */

(function () {
  //REGISTER ARMY
  setTimeout(function registerArmy() {
    window.registerArmy({
      name: 'ALM-BULLS',
      icon: 'bull',
      cb: battlePlan
    });
  }, 0);

  //ALGORITHM CODE
  var wereSettingsInited = false;

  var battleSettings = {
    boardResolution: 0,
    machineGunDirection: true,
    currentBattleMode: '',
    machineGunCounter: 0,
    massiveCannonsCounter: 0,
    defenceXCounter: 0,
    defenceYCounter: 0,
    defenceBlockPixelShiftX: 0,
    defenceBlockPixelShiftY: 0
  };

  //BATTLE PLANNER
  function battlePlan(data) {
    var pixels = [];
    var coordinates;

    if (!wereSettingsInited) {
      //change resolution depends on board's width
      if (data.cols <= 400) {
        initSettings(data, 5);
      } else if (data.cols <= 600) {
        initSettings(data, 8);
      } else {
        initSettings(data, 10);
      }
      wereSettingsInited = true;
    }

    switch (battleSettings.currentBattleMode) {
      case 'defence':
        coordinates = calcNextDefenceCoordinates(data);

        pixels = battlePlanMethods.defenceBlock(coordinates, data.budget);

        if (pixels.length > 0) { //if has budget
          battleSettings.defenceXCounter++;

          if (battleSettings.defenceXCounter >= battleSettings.boardResolution) {
            battleSettings.defenceXCounter = 0;
            battleSettings.defenceYCounter++;

            //after a line of defence change plan
            changeBattlePlan();

            if (battleSettings.defenceYCounter >= battleSettings.boardResolution / 2) {
              battleSettings.defenceYCounter = 0;
            }
          }
        }
        break;

      case 'sideDefence':
        if (battleSettings.defenceXCounter == 0) {
          coordinates = {
            x: data.cols - battleSettings.defenceBlockPixelShiftX,
            y: battleSettings.defenceBlockPixelShiftY
          };
        } else {
          coordinates = {x: battleSettings.defenceBlockPixelShiftX, y: battleSettings.defenceBlockPixelShiftY};
        }

        pixels = battlePlanMethods.defenceBlock(coordinates, data.budget);

        if (pixels.length > 0) { //if has budget
          battleSettings.defenceXCounter++;

          if (battleSettings.defenceXCounter == 2) {
            battleSettings.defenceXCounter = 0;

            //after 2 side defenders change plan
            changeBattlePlan();
          }
        }
        break;

      case 'massiveAttack':
        coordinates = calcNextAttackCoordinates(data);

        pixels = battlePlanMethods.massiveCannon(coordinates, data.budget);

        if (pixels.length > 0) { //if has budget
          battleSettings.massiveCannonsCounter++;
        }

        if (battleSettings.massiveCannonsCounter >= battleSettings.boardResolution) {
          battleSettings.massiveCannonsCounter = 0;

          //after a set of massive attacks change plan
          changeBattlePlan();
        }
        break;

      case 'ultraAttack':

        break;

      case 'machineGunAttack':
        coordinates = calcNextAttackCoordinates(data);

        pixels = battlePlanMethods.machineGun(coordinates, data.budget, battleSettings.machineGunDirection);

        if (pixels.length > 0) { //if has budget
          battleSettings.machineGunCounter++;
        }

        if (battleSettings.machineGunCounter >= battleSettings.boardResolution) {
          battleSettings.machineGunCounter = 0;
          battleSettings.machineGunDirection = !battleSettings.machineGunDirection;
          battleSettings.massiveCannonsCounter++;

          //after a set of machine gun shots change plan
          changeBattlePlan();
        }
        break;

      default:

    }

    return pixels;
  }

  //init battle settings
  function initSettings(data, resolution) {
    var boardRatio = Math.floor(data.cols / data.rows);

    battleSettings.currentBattleMode = 'sideDefence';
    battleSettings.boardResolution = resolution;
    battleSettings.defenceBlockPixelShiftX = Math.floor((data.cols - resolution) / (resolution * 2));
    battleSettings.defenceBlockPixelShiftY = Math.floor(data.rows / (resolution));

    //console.log(battleSettings, boardRatio);
  }

  //calculates the next x,y for defence
  function calcNextDefenceCoordinates(data) {
    var ret = {x: 0, y: 0};

    ret.x = Math.floor((battleSettings.defenceXCounter * data.cols / battleSettings.boardResolution + battleSettings.defenceYCounter % 3 * battleSettings.defenceBlockPixelShiftX) % data.cols);
    ret.y = Math.floor((data.rows - (battleSettings.defenceYCounter * battleSettings.defenceBlockPixelShiftY)) % (data.rows - battleSettings.defenceBlockPixelShiftY));


    //make sure coordinates are in the board's range
    ret.x = ret.x % (data.cols - battleSettings.defenceBlockPixelShiftX);
    ret.y = ret.y % (data.rows - battleSettings.defenceBlockPixelShiftY);

    ret.x = ret.x < battleSettings.defenceBlockPixelShiftX ? battleSettings.defenceBlockPixelShiftX : ret.x;
    ret.y = ret.y <= battleSettings.defenceBlockPixelShiftY ? data.rows - battleSettings.defenceBlockPixelShiftY : ret.y;

    return ret;
  }

  //calculates the next x,y for offence
  function calcNextAttackCoordinates(data) {
    var ret = {x: 0, y: 0};

    switch (battleSettings.currentBattleMode) {
      case 'machineGunAttack':
        ret.x = Math.floor((data.cols / 2));
        // % data.rows / 2 -> make sure defence stays on the bottom half of our side
        ret.y = Math.floor((battleSettings.machineGunCounter * data.rows / battleSettings.boardResolution) % data.rows / 2);
        break;

      case 'massiveAttack':
        ret.x = Math.floor(((data.cols / battleSettings.boardResolution) * battleSettings.massiveCannonsCounter));
        ret.y = 0; //start from the middle of the screen (Y-AXIS)
        break;

      case 'ultraAttack':
        ret.x = Math.floor(((data.cols / battleSettings.boardResolution) * battleSettings.massiveCannonsCounter));
        ret.y = 0;
        break;
    }

    //make sure coordinates are in the board's range
    ret.x = ret.x % data.cols;
    ret.y = ret.y % data.rows;

    return ret;
  }

  //CHANGE BATTLE PLAN FROM ONE TO ANOTHER
  function changeBattlePlan() {
    switch (battleSettings.currentBattleMode) {
      case 'defence':
        battleSettings.currentBattleMode = 'machineGunAttack';
        break;

      case 'sideDefence':
        battleSettings.currentBattleMode = 'defence';
        break;

      case 'massiveAttack':
        battleSettings.currentBattleMode = 'sideDefence';
        break;

      case 'ultraAttack':

        break;

      case 'machineGunAttack':
        if (battleSettings.massiveCannonsCounter >= 2) { //number of machineGun sets
          battleSettings.currentBattleMode = 'massiveAttack';
          battleSettings.massiveCannonsCounter = 0;
        } else {
          battleSettings.currentBattleMode = 'defence';
        }
        break;

      default:

    }
  }

  //FUNCTIONS FOR CREATING SHAPES ONLY IF ENOUGH RESOURCES ARE AVAILABLE, RETURNS EMPTY ARRAY IF NOT ENOUGH RESOURCES
  function massiveCannon(coordinates, currentBudget) { //requires 9 pixels
    return absShapeFunction(createSpaceship, coordinates, currentBudget, 9);
  }

  function machineGun(coordinates, currentBudget, direction) { //requires 5 pixels
    return absShapeFunction(createGlider, coordinates, currentBudget, 5, direction);
  }

  function defenceBlock(coordinates, currentBudget, direction) { //requires 5 pixels
    return absShapeFunction(createBlockUnit, coordinates, currentBudget, 5, direction);
  }

  function absShapeFunction(method, coordinates, currentBudget, requiredBudget, anotherParam) {
    if (currentBudget >= requiredBudget) { //if enough pixels are available, call method(coordinates)
      return method(coordinates, anotherParam);
    }

    return [];
  }

  var battlePlanMethods = {
    massiveCannon: massiveCannon,
    machineGun: machineGun,
    defenceBlock: defenceBlock
  };

  //SHAPES GENERATORS
  function createGliderGun(coordinates, direction) { //false -> left
    var pixels = [];
    var multiplier = direction == true ? 1 : -1;

    pixels.push([coordinates.x + multiplier * 1, coordinates.y + 8]);
    pixels.push([coordinates.x + multiplier * 3, coordinates.y + 7]);
    pixels.push([coordinates.x + multiplier * 3, coordinates.y + 8]);
    pixels.push([coordinates.x + multiplier * 5, coordinates.y + 4]);
    pixels.push([coordinates.x + multiplier * 5, coordinates.y + 5]);
    pixels.push([coordinates.x + multiplier * 5, coordinates.y + 6]);
    pixels.push([coordinates.x + multiplier * 7, coordinates.y + 3]);
    pixels.push([coordinates.x + multiplier * 7, coordinates.y + 4]);
    pixels.push([coordinates.x + multiplier * 7, coordinates.y + 5]);
    pixels.push([coordinates.x + multiplier * 8, coordinates.y + 6]);

    return pixels;
  }

  function createSpaceship(coordinates) {
    var pixels = [];

    pixels.push([coordinates.x + 1, coordinates.y]);
    pixels.push([coordinates.x + 2, coordinates.y]);
    pixels.push([coordinates.x + 3, coordinates.y]);
    pixels.push([coordinates.x, coordinates.y + 1]);
    pixels.push([coordinates.x + 3, coordinates.y + 1]);
    pixels.push([coordinates.x + 3, coordinates.y + 2]);
    pixels.push([coordinates.x + 3, coordinates.y + 3]);
    pixels.push([coordinates.x, coordinates.y + 4]);
    pixels.push([coordinates.x + 2, coordinates.y + 4]);

    return pixels;
  }

  function createGlider(coordinates, direction) {
    var pixels = [];

    pixels.push([coordinates.x, coordinates.y]);
    pixels.push([coordinates.x + 1, coordinates.y]);
    pixels.push([coordinates.x + 2, coordinates.y]);
    pixels.push(direction == true ? [coordinates.x, coordinates.y + 1] : [coordinates.x + 2, coordinates.y + 1]);
    pixels.push([coordinates.x + 1, coordinates.y + 2]);

    return pixels;
  }

  function createBlockUnit(coordinates, direction) {
    var pixels = [];
    var multiplier = direction == true ? -1 : 1;

    pixels.push([coordinates.x, coordinates.y]);
    pixels.push([coordinates.x + multiplier * 1, coordinates.y]);
    pixels.push([coordinates.x + multiplier * 2, coordinates.y]);
    pixels.push([coordinates.x, coordinates.y - 1]);
    pixels.push([coordinates.x + multiplier * 1, coordinates.y + 2]);

    return pixels;
  }

  function createHat(coordinates) {
    var pixels = [];

    pixels.push([coordinates.x, coordinates.y]);
    pixels.push([coordinates.x + 1, coordinates.y]);
    pixels.push([coordinates.x + 1, coordinates.y + 1]);
    pixels.push([coordinates.x + 2, coordinates.y + 1]);
    pixels.push([coordinates.x + 3, coordinates.y + 1]);
    pixels.push([coordinates.x + 3, coordinates.y]);
    pixels.push([coordinates.x + 4, coordinates.y]);

    return pixels;
  }
})
();
