(function() {

//function calcBrightness(hex) {
//    var rgb=[],r=hex>>16&0xFF;g=hex>>8&0xFF;b=hex&0xFF;
//    rgb.push(r, g, b);
//    return Math.sqrt((rgb[= 0] * rgb[0] * 0.241) + (rgb[1] * rgb[1] * 0.691) + (rgb[2] * rgb[2] * 0.68) ) / 255;
//}



	// Settings ----------------------------------------------------------------------------------------------------------
	function Settings() {

		var that = this;

		that.colorsRGB = [ [0x33, 0xFF, 0x99], [0xFF, 0xB7, 0xB7] ]; //green and red
		that.cols = 400;
		that.rows = 400;
	}
	// Settings ----------------------------------------------------------------------------------------------------------



	// HTML Helper -------------------------------------------------------------------------------------------------------
	function HtmlHelper() {

		var that = this;

		that.init = function init(settings) {
			that.settings = settings;
			that.cols = settings.cols;
			that.rows = settings.rows;
			that.colorsRGB = settings.colorsRGB;
			that.addCssRules();
			container = that.addContainer();
			that.addArmyLine(container, 1, 'Red Army');
			canvas = that.addCanvas(container);
      that.addArmyLine(container, 0, 'Green Army');
			that.ctx = canvas.getContext('2d');
		}

		that.getColorHexStr = function getColorHexStr(colorRGBArray) {
			return colorRGBArray[0].toString(16) + colorRGBArray[1].toString(16) + colorRGBArray[2].toString(16);
		}

		that.addCssRule = function addCssRule(cssText) {
			var style = document.createElement('style');
			style.type = 'text/css';
			if (style.styleSheet) {
				style.styleSheet.cssText = cssText;
			} else {
				style.appendChild(document.createTextNode(cssText));
			}
			document.head.appendChild(style);
		}

		that.addCssRules = function addCssRules() {
			that.addCssRule('* {box-sizing: border-box;}');
			that.addCssRule('html {height: 100%;}');
			that.addCssRule('body {height: 100%; margin: 0; overflow: hidden; background-color: #222; color: #FFF; font-family: monospace; font-size: 15px;}');
			that.addCssRule('#gol-container {height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;}');
			that.addCssRule('#gol-canvas {background-color: #000000;}');
			that.addCssRule('#gol-army-line-0 {margin: 5px; color: #' + that.getColorHexStr(that.colorsRGB[0]) + ';}');
			that.addCssRule('#gol-army-line-1 {margin: 5px; color: #' + that.getColorHexStr(that.colorsRGB[1]) + ';}');
		}

		that.addContainer = function addContainer() {
			var container = document.createElement('div');
			container.setAttribute('id', 'gol-container');
			return document.body.appendChild(container);
			;
		}

		that.addArmyLine = function addArmyLine(container, index, name) {
			var textNode,
					armyLine = document.createElement('div');
			armyLine.setAttribute('id', 'gol-army-line-' + index);
			textNode = document.createTextNode(name);
			armyLine.appendChild(textNode);
			return container.appendChild(armyLine);
		}

		that.addCanvas = function addCanvas(container) {
			var canvas = document.createElement('canvas');
			canvas.setAttribute('id', 'gol-canvas');
			canvas.setAttribute('width', that.cols + 'px');
			canvas.setAttribute('height', that.rows + 'px');
			return container.appendChild(canvas);
		}

		that.drawMatrixToCanvas = function drawMatrixToCanvas(curMatrix, nxtMatrix, baseColors) {
			var i, x, y,
					imgData = that.ctx.createImageData(that.cols, that.rows);
			for (y = 0; y < that.rows; y++) {
				for (x = 0; x < that.cols; x++) {
					i = y * that.cols + x;
					if (curMatrix[i] !== nxtMatrix[i]) {
						imgData.data[i * 4] =	that.colorsRGB[baseColors[i]][0];
						imgData.data[i * 4 + 1] = that.colorsRGB[baseColors[i]][1];
						imgData.data[i * 4 + 2] = that.colorsRGB[baseColors[i]][2];
						imgData.data[i * 4 + 3] = Math.trunc(nxtMatrix[i] * 255);
					}
				}
			}
			that.ctx.putImageData(imgData, 0, 0);
		}

	}
	// HTML Helper -------------------------------------------------------------------------------------------------------



	// Army --------------------------------------------------------------------------------------------------------------
	function Army(index, name, color) {

		var that = this;

		that.index = index;
		that.name = name;
		that.color = color;
	}
	// Army --------------------------------------------------------------------------------------------------------------



	// Board -------------------------------------------------------------------------------------------------------------
	function Board() {

		var that = this;

		that.init = function init(settings) {
			var i;
			that.settings = settings;
			that.cols = settings.cols;
			that.rows = settings.rows;
			that.points = that.cols * that.rows;
			that.ageQuantum = 0.001;
			that.matrices = [[], [], []];
			that.baseColors = [];
			for (i = 0; i < that.points; i++) {
				that.matrices[0][i] = that.matrices[1][i] = that.matrices[2][i] = 0;
				that.baseColors[i] = i < that.points / 2 ? 1 : 0;
			}
		}

		that.copyMatrixValues = function copyMatrixValues(srcMatrix, dstMatrix) {
			var i;
			for (i = 0; i < that.points; i++) {
				dstMatrix[i] = srcMatrix[i];
			}
		}

		that.ageMatrixValues = function ageMatrixValues(matrix) {
			var i;
			for (i = 0; i < that.points; i++) {
				if (matrix[i] > that.ageQuantum) {
					matrix[i] -= that.ageQuantum;
				} else {
					matrix[i] = 0;
				}
			}
		}

		that.addRandomLife = function addRandomLife(matrix) {
			var n, x, y, r, c;
			if (Math.floor(Math.random() * 10 + 1) === 1) {
				r = Math.floor(Math.random() * (that.rows - 3) + 2);
				c = Math.floor(Math.random() * (that.cols - 3) + 2);
				for (y = r - 2; y <= r + 2; y++) {
					for (x = c - 2; x <= c + 2; x++) {
						matrix[y * that.cols + x] = (Math.floor(Math.random() * 2 + 1) === 1) ? 1 : 0;
					}
				}
			}
		}

		that.getIndex = function getIndex(x, y) {
			return y * that.cols + x;
		}

		that.getX = function getX(index) {
			return index % that.cols;
		}

		that.getY = function getY(index) {
			return Math.trunc(index / that.cols);
		}

		that.getAdjacentIndexes = function getAdjacentIndexes(index) {
			var indices = [],
					x = that.getX(index),
					y = that.getY(index),
					cols = that.cols,
					rows = that.rows;
			if ((y - 1) >= 0 && (x - 1) >= 0) {
				indices.push((y - 1) * cols + (x - 1));
			}
			if ((y - 1) >= 0) {
				indices.push((y - 1) * cols + (x));
			}
			if ((y - 1) >= 0 && (x + 1) <= (cols - 1)) {
				indices.push((y - 1) * cols + (x + 1));
			}
			if ((x - 1) >= 0) {
				indices.push((y) * cols + (x - 1));
			}
			if ((x + 1) <= (cols - 1)) {
				indices.push((y) * cols + (x + 1));
			}
			if ((y + 1) <= (rows - 1) && (x - 1) >= 0) {
				indices.push((y + 1) * cols + (x - 1));
			}
			if ((y + 1) <= (rows - 1)) {
				indices.push((y + 1) * cols + (x));
			}
			if ((y + 1) <= (rows - 1) && (x + 1) <= (cols - 1)) {
				indices.push((y + 1) * cols + (x + 1));
			}
			return indices;
		}

		that.getAdjacentIndexesByXY = function getAdjacentIndexesByXY(x, y) {
			return that.getAdjacentIndexes(y * that.cols + x);
		}

		that.computeNextState = function computeNextState(matrix1, matrix2) {
			var i, a, j, x, y, n, v, n, s, c1, adjacents;
			for (i = 0; i < that.points; i++) {
				n = 0;
				s = 0;
				c0 = 0;
				adjacents = that.getAdjacentIndexes(i);
				for (a = 0; a < adjacents.length; a++) {
					j = adjacents[a];
					if (matrix1[j] > 0) {
						n++;
						s += matrix1[j];
						if (that.baseColors[j] === 0) {
							c0++;
						}
					}
				}
				v = matrix1[i];
				if (v > 0 && n < 2) {
					matrix2[i] = 0;
				} else if (v > 0 && n > 3) {
					matrix2[i] = 0;
				} else if (v === 0 && n === 3) {
					matrix2[i] = Math.min(1, s / 3 * 1.1);
					that.baseColors[i] = (c0 >= 2) ? 0 : 1;
				} else {
					matrix2[i] = v;
				}
			}
		}

	}
	// Board -------------------------------------------------------------------------------------------------------------



	// Game --------------------------------------------------------------------------------------------------------------
	function Game() {

		var that = this;

		that.init = function init(settings) {
			var i, container, canvas;

			that.settings = settings;
			that.colorsRGB = settings.colorsRGB;
			that.ticks = 0;
			that.timeStamp = (new Date()).getTime();
			that.turnsPerGeneration = 1000;
			that.armies = [];

			that.htmlHelper = new HtmlHelper();
			that.htmlHelper.init(settings);

			that.board = new Board();
			that.board.init(settings);

			that.addArmy('Green Army');
			that.addArmy('Red Army');
		}

		that.addArmy = function addArmy(name) {
			that.armies.push(new Army(that.armies.length, name, that.colorsRGB[that.armies.length]));
		}

		that.start = function start() {
			setTimeout(that.onTick, 0);
		}

		that.endGeneration = function endGeneration() {
			console.log(((new Date()).getTime() - that.timeStamp) / 1000);
			that.timeStamp = (new Date()).getTime();
		}

		that.onTick = function onTick() {
			var board = that.board;
			that.ticks++;
			board.copyMatrixValues(board.matrices[2], board.matrices[0]);
			board.ageMatrixValues(board.matrices[0]);
			board.addRandomLife(board.matrices[0]);
			board.computeNextState(board.matrices[0], board.matrices[1]);
			that.htmlHelper.drawMatrixToCanvas(board.matrices[2], board.matrices[1], board.baseColors);
			board.copyMatrixValues(board.matrices[1], board.matrices[2]);
			if (that.ticks % that.turnsPerGeneration === 0) {
				that.endGeneration();
			}
			setTimeout(that.onTick, 0);
		}

	}
	// Game --------------------------------------------------------------------------------------------------------------



	// Public API --------------------------------------------------------------------------------------------------------
	window.initGameOfLife = function initGameOfLife() {
		var settings = new Settings();
		var game = new Game();
		game.init(settings);
		game.start();
	};
	// Public API --------------------------------------------------------------------------------------------------------



})();
