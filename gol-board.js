function GolBoard() {

	var that = this;

	that.init = function init(settings) {
		var i;
		that.settings = settings;
		that.cols = settings.cols;
		that.rows = settings.rows;
		that.points = that.cols * that.rows;
		that.vectors = [[], []];
		for (i = 0; i < that.points; i++) {
			that.vectors[0][i] = that.vectors[1][i] = -1;
		}
	}

	that.copyVectorValues = function copyVectorValues(srcVector, dstVector) {
		var i;
		for (i = 0; i < that.points; i++) {
			dstVector[i] = srcVector[i];
		}
	}

	// that.ageVectorValues = function ageVectorValues(vector) {
	// 	var i;
	// 	for (i = 0; i < that.points; i++) {
	// 		if (vector[i] > that.ageQuantum) {
	// 			vector[i] -= that.ageQuantum;
	// 		} else {
	// 			vector[i] = 0;
	// 		}
	// 	}
	// }

	// that.addRandomLife = function addRandomLife(vector) {
	// 	var n, x, y, r, c;
	// 	if (Math.floor(Math.random() * 10 + 1) === 1) {
	// 		r = Math.floor(Math.random() * (that.rows - 3) + 2);
	// 		c = Math.floor(Math.random() * (that.cols - 3) + 2);
	// 		for (y = r - 2; y <= r + 2; y++) {
	// 			for (x = c - 2; x <= c + 2; x++) {
	// 				vector[y * that.cols + x] = (Math.floor(Math.random() * 2 + 1) === 1) ? 1 : 0;
	// 			}
	// 		}
	// 	}
	// }

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

	that.computeNextState = function computeNextState(vector1, vector2) {
		var i, a, j, x, y, n, v, n, c0, adjacents;
		for (i = 0; i < that.points; i++) {
			n = 0;
			c0 = 0;
			adjacents = that.getAdjacentIndexes(i);
			for (a = 0; a < adjacents.length; a++) {
				j = adjacents[a];
				if (vector1[j] === 0) {
					n++;
					c0++;
				} else if (vector1[j] === 1) {
					n++;
				}
			}
			v = vector1[i];
			if ((v === 0 || v === 1) && (n < 2 || n > 3))  {
				vector2[i] = -1;
			} else if (v === -1 && n === 3) {
				vector2[i] = (c0 >= 2) ? 0 : 1;
			} else {
				vector2[i] = v;
			}
		}
	}

	that.placeNewPixels = function placeNewPixels(vector, pixels) {
		var i, j, v;
		for (i = 0; i < pixels.length; i++) {
			for (j = 0; j < pixels[i].length; j++) {
				v = (i == 0)
				? that.getIndex(pixels[i][j][0], that.rows / 2 + pixels[i][j][1])
				: that.getIndex(pixels[i][j][0], that.rows / 2 - 1 - pixels[i][j][1]);
				if (v < 0 || v > that.points) {
					_err('new pixel out of range');
				} else {
					vector[v] = i; 
				}
			}	
		}
	}

	that.handleWinningPixels = function handleWinningPixels(vector) {
		var c;
		var winningPixels = [0, 0];
		for (c = 0; c < that.cols; c++) {
			if (vector[that.getIndex(c, 0)] === 0) {
				winningPixels[0]++;
				vector[that.getIndex(c, 0)] = -1;	
			}
		}
		for (c = 0; c < that.cols; c++) {
			if (vector[that.getIndex(c, that.rows - 1)] === 1) {
				winningPixels[1]++;
				vector[that.getIndex(c, that.rows - 1)] = -1;	
			}
		}
		return winningPixels;
	}

}
