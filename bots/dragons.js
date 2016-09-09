(function() {

	// utilities ---------------------------------------------------------------------------------------------------------

	function getRnd(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// structures --------------------------------------------------------------------------------------------------------

	function tryPlaceMine(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 3) {
			c = col || getRnd(0, data.cols - 2);
			r = row || getRnd(20, 80);
			pixels.push([c, r]);
			pixels.push([c, r+1]);
			pixels.push([c+1, r]);
		}
		return pixels;
	}

	function tryPlaceFence(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 3) {
			c = col || fenceLocation;
			r = row || data.rows - 15;
			pixels.push([c, r]);
			pixels.push([c+1, r]);
			pixels.push([c, r+1]);
			fenceLocation += 5;
			if (fenceLocation > data.cols - 2) {
				fenceLocation = 0;
			}
		}
		return pixels;
	}

	function tryPlaceGlider(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 5) {
			c = col || getRnd(0, data.cols - 3);
			r = row || getRnd(0, data.rows - 3);
			pixels.push([c, r]);
			pixels.push([c+1, r]);
			pixels.push([c+2, r]);
			pixels.push(getRnd(0, 1) === 0 ? [c, r+1] : [c+2, r+1]);
			pixels.push([c+1, r+2]);
		}
		return pixels;
	}

	function tryPlaceSpaceship(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 9) {
			c = col || getRnd(0, data.cols - 4);
			r = row || 0;
			if (c < data.cols / 2) {
				pixels.push([c+1, r]);
				pixels.push([c+2, r]);
				pixels.push([c+3, r]);
				pixels.push([c, r+1]);
				pixels.push([c+3, r+1]);
				pixels.push([c+3, r+2]);
				pixels.push([c+3, r+3]);
				pixels.push([c, r+4]);
				pixels.push([c+2, r+4]);
			} else {
				pixels.push([c, r]);
				pixels.push([c+1, r]);
				pixels.push([c+2, r]);
				pixels.push([c, r+1]);
				pixels.push([c+3, r+1]);
				pixels.push([c, r+2]);
				pixels.push([c, r+3]);
				pixels.push([c+1, r+4]);
				pixels.push([c+3, r+4]);
			}
		}
		return pixels;
	}

	// cbs ---------------------------------------------------------------------------------------------------------------

	var cb1 = function cb1(data) {
		var pixels = [];
		var plan;
		if (data.generation === 1) {
			planIndex = 0;
      fenceLocation = 0;
		}
		if (data.generation < 200) {
			plan = ['spaceship'];
		} else if (data.generation < 440) {
			plan = ['fence'];
		} else {
			plan = ['spaceship', 'glider', 'mine', 'fence'];
		}
		if (plan[planIndex] === 'mine') {
			pixels = tryPlaceMine(data);
		} else if (plan[planIndex] === 'fence') {
			pixels = tryPlaceFence(data);
		} else if (plan[planIndex] === 'glider') {
			pixels = tryPlaceGlider(data, null, 0);
		} else if (plan[planIndex] === 'spaceship') {
			pixels = tryPlaceSpaceship(data, null, 0);
		}
		if (pixels.length > 0) {
			planIndex = (planIndex + 1) % plan.length;
		}
		return pixels;
	};

	var cb2 = function cb2(data) {
		var pixels = [];
		var plan;
		if (data.generation === 1) {
			planIndex = 0;
			fenceLocation = 0;
		}
		plan = ['mine', 'glider'];
		if (plan[planIndex] === 'mine') {
			pixels = tryPlaceMine(data);
		} else if (plan[planIndex] === 'glider') {
			pixels = tryPlaceGlider(data, null, 0);
		}
		if (pixels.length > 0) {
			planIndex = (planIndex + 1) % plan.length;
		}
		return pixels;
	};

	var cb3 = function cb3(data) {
		var pixels = [];
		var plan;
		if (data.generation === 1) {
			planIndex = 0;
			fenceLocation = 0;
		}
		plan = ['glider', 'spaceship'];
		if (plan[planIndex] === 'glider') {
			pixels = tryPlaceGlider(data);
		} else if (plan[planIndex] === 'spaceship') {
			pixels = tryPlaceSpaceship(data, null, 0);
		}
		if (pixels.length > 0) {
			planIndex = (planIndex + 1) % plan.length;
		}
		return pixels;
	};

	// init --------------------------------------------------------------------------------------------------------------

	var planIndex = 0;
	var fenceLocation = 0;
	var cbs = [cb1, cb2, cb3];
	setTimeout(function registerArmy() {
		window.registerArmy({
			name: 'DRAGONS',
			icon: 'dragon',
			cb: cbs[getRnd(0, cbs.length-1)]
		});
	}, 0);

})();
