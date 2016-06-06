(function() {

	var cols = 400;
	var rows = 400;
	var points = cols * rows;
	var ticks = 0;
	var timeStamp = (new Date()).getTime();
	var turnsPerGeneration = 1000;
	var ageQuantum = 0.001;
	var minLife = 0;
	var ctx;
	var imgData;
	var matrices = [[], [], []];
	var baseColors = [];
	var colorsRGB = [ [0x33, 0xFF, 0x99], [0xFF, 0xB7, 0xB7] ]; //green and red
	var armies = [];
	var htmlHelper = new HtmlHelper();



	// HTML Helper -------------------------------------------------------------------------------------------------------
	function HtmlHelper() {

		var that = this;

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
			that.addCssRule('#gol-army-line-0 {margin: 5px; color: #' + that.getColorHexStr(colorsRGB[0]) + ';}');
			that.addCssRule('#gol-army-line-1 {margin: 5px; color: #' + that.getColorHexStr(colorsRGB[1]) + ';}');
		}

		that.addContainer = function addContainer() {
			var container = document.createElement('div');
			container.setAttribute('id', 'gol-container');
			return document.body.appendChild(container);
			;
		}

		that.addArmyLine = function addArmyLine(container, army) {
			var textNode,
					armyLine = document.createElement('div');
			armyLine.setAttribute('id', 'gol-army-line-' + army.index);
			textNode = document.createTextNode(army.name);
			armyLine.appendChild(textNode);
			return container.appendChild(armyLine);
		}

		that.addCanvas = function addCanvas(container) {
			var canvas = document.createElement('canvas');
			canvas.setAttribute('id', 'gol-canvas');
			canvas.setAttribute('width', cols + 'px');
			canvas.setAttribute('height', rows + 'px');
			return container.appendChild(canvas);
		}

		that.drawMatrixToCanvas = function drawMatrixToCanvas(curMatrix, nxtMatrix) {
			var i, x, y,
					imgData = ctx.createImageData(cols, rows);
			for (y = 0; y < rows; y++) {
				for (x = 0; x < cols; x++) {
					i = y * cols + x;
					if (curMatrix[i] !== nxtMatrix[i]) {
						imgData.data[i * 4] =	colorsRGB[baseColors[i]][0];
						imgData.data[i * 4 + 1] = colorsRGB[baseColors[i]][1];
						imgData.data[i * 4 + 2] = colorsRGB[baseColors[i]][2];
						imgData.data[i * 4 + 3] = Math.trunc(nxtMatrix[i] * 255);
					}
				}
			}
			ctx.putImageData(imgData, 0, 0);
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
	function Board(cols, rows) {

		var that = this;

		that.cols = cols;
		that.rows = rows;
		that.points = cols * rows;
	}
	// Board -------------------------------------------------------------------------------------------------------------



	function addArmy(name) {
		var index = armies.length,
				army = new Army(index, name, colorsRGB[index]);
		armies.push(army);
	}

	function initGameOfLife() {
		var i, container, canvas;
		htmlHelper.addCssRules();
		container = htmlHelper.addContainer();
		addArmy('Green Army');
		addArmy('Red Army');
		htmlHelper.addArmyLine(container, armies[1]);
		canvas = htmlHelper.addCanvas(container);
		htmlHelper.addArmyLine(container, armies[0]);
		ctx = canvas.getContext('2d');
		imgData = ctx.createImageData(cols, rows);
		for (i = 0; i < points; i++) {
			matrices[0][i] = matrices[1][i] = matrices[2][i] = 0;
			baseColors[i] = i < points / 2 ? 1 : 0;
		}
		setTimeout(onTick, 0);
	}

//function calcBrightness(hex) {
//    var rgb=[],r=hex>>16&0xFF;g=hex>>8&0xFF;b=hex&0xFF;
//    rgb.push(r, g, b);
//    return Math.sqrt((rgb[= 0] * rgb[0] * 0.241) + (rgb[1] * rgb[1] * 0.691) + (rgb[2] * rgb[2] * 0.68) ) / 255;
//}

	function copyMatrixValues(srcMatrix, dstMatrix) {
		var i;
		for (i = 0; i < points; i++) {
			dstMatrix[i] = srcMatrix[i];
		}
	}

	function ageMatrixValues(matrix) {
		var i;
		for (i = 0; i < points; i++) {
			if (matrix[i] > ageQuantum) {
				matrix[i] -= ageQuantum;
			} else {
				matrix[i] = 0;
			}
		}
	}

	function addRandomLife(matrix) {
		var n, x, y, r, c;
		if (Math.floor(Math.random() * 10 + 1) === 1) {
			r = Math.floor(Math.random() * (rows - 3) + 2);
			c = Math.floor(Math.random() * (cols - 3) + 2);
			for (y = r - 2; y <= r + 2; y++) {
				for (x = c - 2; x <= c + 2; x++) {
					matrix[y * cols + x] = (Math.floor(Math.random() * 2 + 1) === 1) ? 1 : 0;
				}
			}
		}
	}

	function getIndex(x, y) {
		return y * cols + x;
	}

	function getX(index) {
		return index % cols;
	}

	function getY(index) {
		return Math.trunc(index / cols);
	}

	function getAdjacentIndexes(index) {
		var indices = [];
		var x = getX(index);
		var y = getY(index);
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

	function getAdjacentIndexesByXY(x, y) {
		return getAdjacentIndexes(y * cols + x);
	}

	function computeNextState(matrix1, matrix2) {
		var i, a, j, x, y, n, v, n, s, c1, adjacents;
		for (i = 0; i < points; i++) {
			n = 0;
			s = 0;
			c0 = 0;
			adjacents = getAdjacentIndexes(i);
			for (a = 0; a < adjacents.length; a++) {
				j = adjacents[a];
				if (matrix1[j] > minLife) {
					n++;
					s += matrix1[j];
					if (baseColors[j] === 0) {
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
				baseColors[i] = (c0 >= 2) ? 0 : 1;
			} else {
				matrix2[i] = v;
			}
		}
	}

	function endGeneration() {
		console.log(((new Date()).getTime() - timeStamp) / 1000);
		timeStamp = (new Date()).getTime();
	}

	function onTick() {
		ticks++;
		copyMatrixValues(matrices[2], matrices[0]);
		ageMatrixValues(matrices[0]);
		addRandomLife(matrices[0]);
		computeNextState(matrices[0], matrices[1]);
		htmlHelper.drawMatrixToCanvas(matrices[2], matrices[1]);
		copyMatrixValues(matrices[1], matrices[2]);
		if (ticks % turnsPerGeneration === 0) {
			endGeneration();
		}
		setTimeout(onTick, 0);
	}

	window.initGameOfLife = initGameOfLife;
})();
