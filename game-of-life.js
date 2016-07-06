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
		that.cols = 100;
		that.rows = 100;
	}
	// Settings ----------------------------------------------------------------------------------------------------------



	// HTML Helper -------------------------------------------------------------------------------------------------------
	function HtmlHelper() {

		var that = this;

		that.init = function init(settings, p1info, p2info) {
			that.settings = settings;
			that.cols = settings.cols;
			that.rows = settings.rows;
			that.colorsRGB = settings.colorsRGB;
			that.addCssRules();
			container = that.addContainer();
			that.addArmyLine(container, 1, p1info.name);
			canvas = that.addCanvas(container);
      that.addArmyLine(container, 0, p2info.name);
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



	// player1 -----------------------------------------------------------------------------------------------------------

	function Player1() {
		var that = this;

		that.init = function init() {
			return {
				name: 'GameOfDeath',
				icon: 'http://files.gamebanana.com/img/ico/sprays/megadethspray.png'
			}
		}

		that.turn = function turn(board) {
			var answer = [];
			var n, x, y, r, c;

			if (Math.floor(Math.random() * 10 + 1) === 1) {
				r = Math.floor(Math.random() * (board.rows - 3) + 2);
				c = Math.floor(Math.random() * (board.cols - 3) + 2);
				for (y = r - 2; y <= r + 2; y++) {
					for (x = c - 2; x <= c + 2; x++) {
						answer.push([x,y]);
					}
				}
			}
			return answer;
		}
	}

	function Player2() {
		var that = this;

		that.init = function init() {
				return {
					name: 'yuvals team',
					icon: 'https://cdn4.iconfinder.com/data/icons/popo_emotions_full_png/popo_emotions_addon/hell_boy.png'
				}
		}

		that.turn = function turn(board) {
			var answer = [];
			var n, x, y, r, c;
			if (Math.floor(Math.random() * 10 + 1) === 1) {
				r = Math.floor(Math.random() * (board.rows - 3) + 2);
				c = Math.floor(Math.random() * (board.cols - 3) + 2);
				for (y = r - 2; y <= r + 2; y++) {
					for (x = c - 2; x <= c + 2; x++) {
						answer.push([x,y]);
					}
				}
			}
			return answer;
		}

	}

	// player1 -----------------------------------------------------------------------------------------------------------


	function BotHandler() {
		var that = this;

		that.init = function init(board) {
				that.board = board;
				that.checkBoard(board);
		}

		that.checkPlayer = function checkPlayer(player) {
			//todo: throw exception if player does not have two methods init and turn;
		}

		that.checkPlayerInfo = function checkPlayerInfo(playerInfo) {
			//todo: throw exception if player.init returned wrong info format
		}

		that.checkPlayerAnswer = function checkPlayerTurn(playerTurn) {
			//todo: throw exception if player.turn(...) return wrong move format
		}

		/*
		Since botHandler handle the copying from the board into player board,
		it needs to make sure that the board size is an even number and a square
		*/
		that.checkBoard = function checkBoard(board) {
			//todo: check that board.cols is an even number (throw exceptio if not)
			//todo: check that board.cols === board.rows (throw exceptio if not)
		}

		/*
		call player turn, handle any exception and check that the answer has the right format
		*/
		that.callPlayerTurn = function callPlayerTurn(player, playerBoard) {
			//todo: check time of move. if move is above 0.2?ms, pass next move
			var result;
			try {
				result = player.turn(playerBoard);
				that.checkPlayerAnswer(result);
			} catch (e) {
				console.log(e.message);
			}

			return result;
		}

		/*
		call player initialization and handle errors, check return value for correct format
		*/
		that.callPlayerInit = function callPlayerInit(player) {
			//todo: check time of move. if move is above 5sec, fail it
			var result;
			try {
				result = player.init();
				that.checkPlayerInfo(result);
			} catch (e) {
				console.log(e.message);
			}

			return result;
		}

		function rotate180degree(x,y,width,height) {
			return (height-y)*height+(width-x)
		}

		function getPlayerValue(side) {
			return (side === 'left') ? 1 : 0;
		}

		that.prepareBoardForPlayer = function prepareBoardForPlayer(board, side) { //side = 'left' or 'right'
			//todo: player board has some issues:
			// 1. empty cells are not handled
			// 2. player value (0? 1? 2? is not verified)
			// 3. need to check for bugs here

			var source = board.matrices[0];
			var height = board.rows;
			var middleWidth = board.cols / 2;
			var width = board.cols;
			var dest = [];
			var playerValue = getPlayerValue(side);
			var sourceIndex, destIndex;
			var xStartPoint = (side === 'left') ? 0 : middleWidth;
			var xEndPoint = (side === 'left') ? middleWidth : width;

			// go through half the board (left or right side)
			for (var x = xStartPoint; x < xEndPoint; x++) {
				for (var y = 0; y < height; y++) {
					sourceIndex = y*height + x;
					// if player has a particle in there
					if (source[sourceIndex]===playerValue) {
						// copy it (left side stays the same, right side gets rotated 180 clockwise)
						destIndex = (side === 'left') ? sourceIndex : rotate180degree(x, y, width, height);
						dest[destIndex] = source[sourceIndex];
					}
				}
			}
			return board;
		}

		that.applyPlayerTurn = function applyPlayerTurn(board, side, result) {

			var playerValue = getPlayerValue(side);
			var destIndex, x, y;
			var height = board.cols;
			var width = board.rows;
			var matrix = board.matrices[0];

			// for each point in player's answer
			for (var i=0; i<result.length; i++) {
				x = result[i][0];
				y = result[i][1];
				// copy back to the board (left side as is, right side 180 degree clockwise)
				destIndex = (side === 'left') ? y*height + x : rotate180degree(x, y, width, height);
				matrix[destIndex] = playerValue;
			}
		}
	}

	// Game --------------------------------------------------------------------------------------------------------------
	function Game() {

		var that = this;
		that.botHandler = new BotHandler();

		that.init = function init(settings, player1, player2) {
			var i, container, canvas, p1info, p2info;

			// init vars
			that.settings = settings;
			that.colorsRGB = settings.colorsRGB;
			that.ticks = 0;
			that.turnsPerGeneration = 1000;
			that.armies = [];

			// init board
			that.board = new Board();
			that.board.init(settings);
			that.botHandler.init(that.board);

			// init players
			that.player1 = player1;
			that.player2 = player2;

			that.botHandler.checkPlayer(that.player1);
			that.botHandler.checkPlayer(that.player2);

			p1info = that.botHandler.callPlayerInit(that.player1);
			p2info = that.botHandler.callPlayerInit(that.player2);

			// init html
			that.htmlHelper = new HtmlHelper();
			that.htmlHelper.init(settings, p1info, p2info);

			that.addArmy(p1info.name);
			that.addArmy(p2info.name);
		}

		that.addArmy = function addArmy(name) {
			that.armies.push(new Army(that.armies.length, name, that.colorsRGB[that.armies.length]));
		}

		that.start = function start() {
			setTimeout(that.onTick, 0);
		}

		that.onTick = function onTick() {
			var board = that.board;
			that.ticks++;
			board.copyMatrixValues(board.matrices[2], board.matrices[0]);

			// player 1 turn
			var p1board = that.botHandler.prepareBoardForPlayer(board, 'left');
			var p1answer = that.botHandler.callPlayerTurn(that.player1, p1board);
			that.botHandler.applyPlayerTurn(board, 'left', p1answer);

			// player 2 turn
			var p2board = that.botHandler.prepareBoardForPlayer(board, 'right');
			var p2answer = that.botHandler.callPlayerTurn(that.player2, p2board);
			that.botHandler.applyPlayerTurn(board, 'right', p2answer);

			// simulate next turn
			board.computeNextState(board.matrices[0], board.matrices[1]);
			that.htmlHelper.drawMatrixToCanvas(board.matrices[2], board.matrices[1], board.baseColors);
			board.copyMatrixValues(board.matrices[1], board.matrices[2]);

			// set next tick
			setTimeout(that.onTick, 0);
		}

	}
	// Game --------------------------------------------------------------------------------------------------------------



	// Public API --------------------------------------------------------------------------------------------------------
	window.initGameOfLife = function initGameOfLife() {
		var settings = new Settings();
		var game = new Game();
		var p1 = new Player1();
		var p2 = new Player2();
		game.init(settings, p1, p2);
		game.start();
	};
	// Public API --------------------------------------------------------------------------------------------------------



})();
