(function() {

	function GolGame() {

		var that = this;
		
		that.init = function init(settings) {
			_dbg('init()');
			that.settings = settings;
			that.htmlHelper = new GolHtmlHelper();
			that.htmlHelper.init(settings);
			that.board = new GolBoard();
			that.board.init(settings);
			that.armies = [];
			window.registerArmy = that.registerArmy;
			window.startGame = that.startGame;
		};

		that.registerArmy = function registerArmy(data) {
			var army = new GolArmy(that.armies.length, data.name, that.settings.colorsRGB[that.armies.length], that.settings.powerMaxValue, data.icon, data.cb);
			_dbg('registerArmy()');
			_log('army name: ' + data.name + ', icon: ' + data.icon);
			that.armies.push(army);
			_dbg('number of armies: ' + that.armies.length);
		};

		that.startGame = function startGame() {
			_dbg('startGame()');
			if (that.armies.length < 2) {
				_log('waiting for armies...');
				setTimeout(that.startGame, 1000);
			} else {
				that.htmlHelper.drawUserInterface(that.armies);
				that.ticks = 0;
				setTimeout(that.onTick, 3000);
			}
		};
		
		that.onTick = function onTick() {
			var curArray, nxtArray, newPixels, scoringPixelCount, gameEnded;
			//_dbg('onTick()');
			that.ticks++;
			curArray = that.board.arrays[(that.ticks % 2) * (-1) + 1];
			nxtArray = that.board.arrays[that.ticks % 2];			
			that.board.computeNextState(curArray, nxtArray);
			scoringPixelCount = that.board.countScoringPixels(nxtArray);
			that.handleScore(scoringPixelCount);
			gameEnded = that.armies[0].power <= 0 || that.armies[1].power <= 0;
			newPixels = that.getNewPixels();
			that.board.placeNewPixelsOnBoard(nxtArray, newPixels);
			if (!gameEnded) {								
				that.htmlHelper.drawArrayToCanvas(nxtArray, newPixels, scoringPixelCount, gameEnded);
				that.board.deleteScoringPixels(nxtArray);				
				setTimeout(that.onTick, 0);
			} else {
				that.htmlHelper.drawArrayToCanvas(nxtArray, newPixels, scoringPixelCount, gameEnded);
				that.endGame();
			}						
		};

		that.getNewPixels = function getNewPixels() {
			var i, pixels, adjustedPixels;
			pixels = [];
			adjustedPixels = [[],[]];
			for (i = 0; i < 2; i++) {
				that.armies[i].budget += that.settings.budgetTickQuantum;
				pixels[i] = that.armies[i].cb(
					{
						ticks: that.ticks,
						cols: that.board.cols,
						rows: that.board.rows / 2,
						budget: that.armies[i].budget
					});
				if (that.armies[i].budget >= pixels[i].length) {
					that.armies[i].budget -= pixels[i].length;
				} else {
					_err('Budget exceeded. ArmyName: ' + that.armies[i].name);
					pixels[i] = [];
				}
				
			}
			if (pixels[0].length > 0 || pixels[1].length > 0) {
				adjustedPixels = that.board.adjustNewPixels(pixels);
			}
			return adjustedPixels;
		};

		that.handleScore = function handleScore(winningPixelsCount) {
			that.armies[0].power -= that.settings.powerTickQuantum;
			that.armies[1].power -= that.settings.powerTickQuantum;
			if (winningPixelsCount[0] !== 0 || winningPixelsCount[1] !== 0) {
				that.armies[1].power -= winningPixelsCount[0] * that.settings.powerPixelQuantum;
				that.armies[0].power -= winningPixelsCount[1] * that.settings.powerPixelQuantum;
				if (winningPixelsCount[0] !== 0) {
					_log(that.armies[0].name + ' scores');	
				}
				if (winningPixelsCount[1] !== 0) {
					_log(that.armies[1].name + ' scores');		
				}
			}
			that.armies[0].power = Math.max(that.armies[0].power, 0);
			that.armies[1].power = Math.max(that.armies[1].power, 0);
			that.htmlHelper.updateScore(that.armies[0], winningPixelsCount[1]);
			that.htmlHelper.updateScore(that.armies[1], winningPixelsCount[0]);
		};

		that.endGame = function endGame() {
			if (that.armies[0].power <= 0 && that.armies[1].power <= 0) {
				_log('draw');				
			} else if (that.armies[1].power <= 0) {
				_log(that.armies[0].name + ' wins');
			} else if (that.armies[0].power <= 0) {
				_log(that.armies[1].name + ' wins');
			}
			that.htmlHelper.endGame();
		};

	}
	
	var game = new GolGame();
	game.init(new GolSettings());
	
})();
