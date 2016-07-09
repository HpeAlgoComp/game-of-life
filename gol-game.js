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
			_log('onTick()');
			that.ticks++;
			curVector = that.board.vectors[(that.ticks % 2) * (-1) + 1];
			nxtVector = that.board.vectors[that.ticks % 2];
			that.board.computeNextState(curVector, nxtVector);
			pixels = that.getNewPixels(curVector);
			that.board.placeNewPixels(nxtVector, pixels);
			that.htmlHelper.drawVectorToCanvas(curVector, nxtVector);
			setTimeout(that.onTick, 0);
		}

		that.getNewPixels = function getNewPixels(curVector) {
			var i, pixels;
			pixels = [];
			for (i = 0; i < that.armies.length; i++) {
				that.armies[i].budget++;
				pixels[i] = that.armies[i].cb(
					{
						cols: that.board.cols,
						rows: that.board.rows / 2,
						budget: that.armies[i].budget
					});
				that.armies[i].budget -= pixels[i].length;
			}
			return pixels;	
		}

	}
	
	var game = new GolGame();
	game.init(new GolSettings());
	
})();
