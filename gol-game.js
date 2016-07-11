(function() {

	function GolGame() {

		var that = this;
		
		that.init = function init(settings) {
			_log('init()');
			that.settings = settings;
			that.htmlHelper = new GolHtmlHelper();
			that.htmlHelper.init(settings);
			that.board = new GolBoard();
			that.board.init(settings);
			that.armies = [];
			window.registerArmy = that.registerArmy;
			window.startGame = that.startGame;
		}

		that.registerArmy = function registerArmy(data) {
			var army = new GolArmy(that.armies.length, data.name, that.settings.colorsRGB[that.armies.length], data.icon, data.cb);
			_log('registerArmy()');
			_log('name: ' + data.name + ', icon: ' + data.icon);
			that.armies.push(army);
			_log('number of armies: ' + that.armies.length);
		}

		that.startGame = function startGame() {
			_log('startGame()');
			if (that.armies.length < 2) {
				_log('waiting for armies...');
				setTimeout(that.startGame, 1000);
			} else {
				that.htmlHelper.drawUserInterface(that.armies);
				that.ticks = 0;
				setTimeout(that.onTick, 1000);
			}
		}
		
		that.onTick = function onTick() {
			var m1, m2, pixels;
			//_log('onTick()');
			that.ticks++;
			curVector = that.board.vectors[(that.ticks % 2) * (-1) + 1];
			nxtVector = that.board.vectors[that.ticks % 2];			
			that.board.computeNextState(curVector, nxtVector);
			//that.board.makeRandomChange(nxtVector);			
			that.addNewPixels(nxtVector);
			that.htmlHelper.drawVectorToCanvas(nxtVector);
			that.handleScore(nxtVector);
			setTimeout(that.onTick, 0);
		}

		that.addNewPixels = function addNewPixels(vector) {
			var i, pixels;
			pixels = [];
			for (i = 0; i < that.armies.length; i++) {
				that.armies[i].budget++;
				pixels[i] = that.armies[i].cb(
					{
						ticks: that.ticks,
						cols: that.board.cols,
						rows: that.board.rows / 2,
						budget: that.armies[i].budget
					});
				that.armies[i].budget -= pixels[i].length;
			}
			if (pixels[0].length || pixels[1].length) {
				that.board.placeNewPixels(vector, pixels);
			}
		}

		that.handleScore = function handleScore(vector) {
			var winningPixels = that.board.handleWinningPixels(vector);
			if (winningPixels[0] !== 0 || winningPixels[1] != 0) {
				that.armies[0].score += winningPixels[0];
				that.armies[1].score += winningPixels[1];
				_log('score: ' + that.armies[0].score + ':' + that.armies[1].score);
				that.htmlHelper.updateScores(that.armies);
			}
		}

	}
	
	var game = new GolGame();
	game.init(new GolSettings());
	
})();
