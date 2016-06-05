(function() {

	var cols = 600;
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
	var color1 = [51, 255, 187]; // green #33FF99
	var color2 = [255, 183, 183]; // red #FFB7B7

	function initGameOfLife() {
		var i, r, c, canvas;
		addCssRules();
		canvas = createCanvas();
		ctx = canvas.getContext('2d');
		imgData = ctx.createImageData(cols, rows);
		for (i = 0; i < points; i++) {
			matrices[0][i] = matrices[1][i] = matrices[2][i] = 0;
			baseColors[i] = i < points / 2 ? 2 : 1;
		}
		setTimeout(onTick, 0);
	}

	function addCssRule(cssText) {
		var style = document.createElement('style');
		style.type = 'text/css';
		if (style.styleSheet) {
			style.styleSheet.cssText = cssText;
		} else {
			style.appendChild(document.createTextNode(cssText));
		}
		document.head.appendChild(style);
	}

	function addCssRules() {
		addCssRule('* {box-sizing: border-box;}');
		addCssRule('html {height: 100%;}');
		addCssRule('body {background-color: #222; height: 100%; margin: 0; overflow: hidden;}');
		addCssRule('#gol-container {height: 100%; display: flex; justify-content: center; align-items: center;}');
		addCssRule('#gol-canvas {background-color: #000000;}');
	}

	function createCanvas() {
		var container, canvas;
		addCssRules();
		container = document.getElementById('gol-container');
		canvas = document.createElement('canvas');
		canvas.setAttribute('id', 'gol-canvas');
		canvas.setAttribute('width', cols + 'px');
		canvas.setAttribute('height', rows + 'px');
		container.appendChild(canvas);
		return canvas;
	}

//function calcBrightness(hex) {
//    var rgb=[],r=hex>>16&0xFF;g=hex>>8&0xFF;b=hex&0xFF;
//    rgb.push(r, g, b);
//    return Math.sqrt((rgb[= 0] * rgb[0] * 0.241) + (rgb[1] * rgb[1] * 0.691) + (rgb[2] * rgb[2] * 0.68) ) / 255;
//}

	function drawMatrixToCanvas(curMatrix, nxtMatrix) {
		var imgData = ctx.createImageData(cols, rows);
		var i, x, y;
		for (y = 0; y < rows; y++) {
			for (x = 0; x < cols; x++) {
				i = y * cols + x;
				if (curMatrix[i] !== nxtMatrix[i]) {
					imgData.data[i * 4] = baseColors[i] === 1 ? color1[0] : color2[0];
					imgData.data[i * 4 + 1] = baseColors[i] === 1 ? color1[1] : color2[1];
					imgData.data[i * 4 + 2] = baseColors[i] === 1 ? color1[2] : color2[2];
					imgData.data[i * 4 + 3] = Math.trunc(nxtMatrix[i] * 255);
				}
			}
		}
		ctx.putImageData(imgData, 0, 0);
	}

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
			c1 = 0;
			adjacents = getAdjacentIndexes(i);
			for (a = 0; a < adjacents.length; a++) {
				j = adjacents[a];
				if (matrix1[j] > minLife) {
					n++;
					s += matrix1[j];
					if (baseColors[j] === 1) {
						c1++;
					}
				}
			}
			v = matrix1[i];
			if (v > 0 && n < 2) {
				matrix2[i] = (Math.floor(Math.random() * 1000000 + 1) === 1) ? 1 : 0;
			} else if (v > 0 && n > 3) {
				matrix2[i] = (Math.floor(Math.random() * 1000000 + 1) === 1) ? 1 : 0;
			} else if (v === 0 && n === 3) {
				matrix2[i] = (Math.floor(Math.random() * 1000000 + 1) === 1) ? 0 : Math.min(1, s / 3 * 1.1);
				baseColors[i] = (c1 >= 2) ? 1 : 2;
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
		drawMatrixToCanvas(matrices[2], matrices[1]);
		copyMatrixValues(matrices[1], matrices[2]);
		if (ticks % turnsPerGeneration === 0) {
			endGeneration();
		}
		setTimeout(onTick, 0);
	}

	window.initGameOfLife = initGameOfLife;
})();
