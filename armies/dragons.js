(function() {

  function registerArmy() {
    window.registerArmy({
      name: 'HPLN-DRAGONS',
      icon: 'dragon',
      cb: cb
    });
  }

  setTimeout(registerArmy, 0);

  var plan = [
    'blocker',
    'glider'
  ];
  var planIndex = 0;
  var fence = 0;
  var spaceshipCount = 0;
  var blockIdx = [50, 30, 10];
  var blockIdxRun = 0;
  var spaceColIdx = [5, 20, 80, 130, 150, 180];
  var spaceColIdxRun = 0;
  
  var spaceColRightIdx = [395, 375, 350, 330, 300, 280, 260];
  var spaceColRightIdxRun = 0;

  function cb(data) {

    if (data.generation === 1) {
      fence = 0;
      spaceshipCount = 0;
      blockIdxRun = 0;
      spaceColRightIdxRun = 0;
    }

    var pixels = [];
    if (fence <= data.cols) {
      pixels = tryPlaceBlocker(data, blockIdx[blockIdxRun % blockIdx.length]);
    }

    if (fence >= data.cols) {
      if (data.generation < 370) {
        pixels = tryPlaceSpaceship(data, spaceColIdx);
      } else if (data.generation > 370 && data.generation < 580) {
        fence = 0;
        blockIdxRun++;
      } else if (data.generation > 580 && data.generation < 800) {
      	pixels = tryPlaceSpaceship(data, spaceColRightIdx);
      } else if (data.generation > 800 && data.generation < 900) {
        fence = 0;
        blockIdxRun = 1;
      } else if (data.generation > 900 && data.generation < 1300) {
        pixels = tryPlaceSpaceship(data, spaceColIdx);
      } else if (data.generation > 1300 && data.generation < 1400) {
        fence = 0;
        blockIdxRun = 2;
      } else if (data.generation > 1400 && data.generation < 2000) {
				pixels = tryPlaceSpaceship(data, spaceColRightIdx);
      } else {
        fence = 0;
        blockIdxRun++;
      }

    }

    return pixels;
  }

  function tryPlaceBlocker(data, low) {
    var pixels = [];
    var r, c;
    if (data.budget >= 4) {
      //c = Math.floor(Math.random() * (data.cols - 1));
      c = fence + 10;
      fence += 15;
      r = Math.floor(data.rows - low);
      pixels.push([c, r]);
      pixels.push([c + 1, r]);
      pixels.push([c + 2, r]);
      pixels.push([c + 1, r - 1]);
    }
    return pixels;
  }

  function tryPlaceSpaceship(data, spaceIndex) {
    var pixels = [];
    var r, c;

    if (data.budget >= 9) {
      c = (Math.floor(data.cols) - spaceIndex[spaceColIdxRun++ % spaceIndex.length]);
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
