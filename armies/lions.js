/**
 * Created by avidan on 19-09-16.
 */
(function () {
	'use strict';
	//REGISTER ARMY
	setTimeout(function registerArmy() {
		window.registerArmy({
			name: 'HOD-LIONS',
			icon: 'lion',
			cb: cb
		});
	}, 0);

	var defenceObject = {
		defenceColumns: {
			defPtr: null,
			defPtrJump: 20,
			defLineJmp: 20,
			defPtrDir: 1
		},
		defenceRows: {
			defLinePtr: null,
			defLineStart: 80,
			defJmp: -24,
			defLines: 2
		}
	}
	var offencebject = {
		firstOffence: 16,
		lastPtr:null
	}


	function cb(data) {
		var pixels = [];

		if (data.generation == 1) init(data)

		else if (data.generation <= offencebject.firstOffence * 8) {
			var ptr = drawColumn(data, {margin : 4, last: offencebject.lastPtr, delta: 6});
			offencebject.lastPtr = ptr
			pixels = tryPlaceSpaceship(data, ptr, 0)
		}
		else if (defenceObject.defenceRows.defLines >= 1) {
			pixels = tryPlaceBasicBlocker(data);
		} else {
			var ptr = drawColumn(data, {margin : 4, last: offencebject.lastPtr, delta: 6});
			offencebject.lastPtr = ptr
			pixels = tryPlaceSpaceship(data, ptr, 0)
		}
		return pixels;
	}

	/**
	 *
	 * @param data
	 * @param options
	 * @returns {*}
	 */
	function drawColumn(data, options) {
		options = options || {}
		var _margin = options.margin || 4
		var _delta = options.delta || 6
		var result = Math.floor(Math.random() * (data.cols - 2*_margin )) + _margin
		var delta = Math.abs(result - options.last)
		while (options.last && delta <= _delta) {
			result = Math.floor(Math.random() * (data.cols - 2*_margin )) + _margin
			delta = Math.abs(result - options.last)
		}
		return result
	}

	function init(data) {
		defenceObject.defenceColumns.defPtrJump = 20;
		defenceObject.defenceColumns.defPtrDir = 1;
		if (data.generation == 1) {
			defenceObject.defenceColumns.defPtr = data.cols / 2 + defenceObject.defenceRows.defJmp / 2;
			defenceObject.defenceRows.defLinePtr = defenceObject.defenceRows.defLineStart;
			defenceObject.defenceRows.defLines = 2
		} else {
			defenceObject.defenceColumns.defPtr = data.cols / 2;
			defenceObject.defenceRows.defLinePtr = defenceObject.defenceRows.defLinePtr + defenceObject.defenceRows.defJmp;
			--defenceObject.defenceRows.defLines
		}
	}

	function tryPlaceSpaceship(data, _c, _r) {
		var pixels = [];
		var r, c;
		if (data.budget >= 8) {
			c = _c || drawColumn(data);
			r = _r || 0;
			pixels.push([c, r]);
			pixels.push([c, r + 1]);
			pixels.push([c, r + 2]);
			pixels.push([c, r + 3]);
			pixels.push([c + 1, r + 4]);
			pixels.push([c + 1, r]);
			pixels.push([c + 2, r]);
			pixels.push([c + 3, r + 1]);
		}
		return pixels;
	}


	function tryPlaceStrem(data, start) {
		var pixels = []
		var r, c;
		if (data.budget >= 10) {
			r = 6
			c = start
			pixels.push([c, r])
			pixels.push([c + 2, r])
			pixels.push([c + 2, r - 1])
			pixels.push([c + 4, r - 2])
			pixels.push([c + 4, r - 3])
			pixels.push([c + 4, r - 4])
			pixels.push([c + 6, r - 3])
			pixels.push([c + 6, r - 4])
			pixels.push([c + 6, r - 5])
			pixels.push([c + 7, r - 4])
		}
		return pixels
	}

	function tryPlaceBasicBlocker(data) {
		var pixels = []
		var r, c;
		if (data.budget >= 6) {
			c = defenceObject.defenceColumns.defPtr;
			r = defenceObject.defenceRows.defLinePtr;
			pixels = tryPlaceExploder(data, c, r)
			if (defenceObject.defenceColumns.defPtr <= 0 || defenceObject.defenceColumns.defPtr > data.cols - 1) {
				init(data)
			} else {
				defenceObject.defenceColumns.defPtr = defenceObject.defenceColumns.defPtr + defenceObject.defenceColumns.defPtrJump * defenceObject.defenceColumns.defPtrDir
				defenceObject.defenceColumns.defPtrDir = -(defenceObject.defenceColumns.defPtrDir)
				defenceObject.defenceColumns.defPtrJump = defenceObject.defenceColumns.defPtrJump + defenceObject.defenceColumns.defLineJmp
			}
		}
		return pixels
	}

	function tryPlaceExploder(data, _c, _r) {
		var pixels = []
		var r = _r, c = _c;
		if (data.budget >= 6) {
			pixels.push([c - 1, r - 1])
			pixels.push([c, r])
			pixels.push([c + 1, r])
			pixels.push([c, r + 1])
			pixels.push([c + 2, r + 1])
			pixels.push([c, r + 2])
		}
		return pixels
	}
})();
