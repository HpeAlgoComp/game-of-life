(function() {

	function registerArmy() {
		window.registerArmy({
			name: 'BotOne',
			icon: '',
			cb: cb
		});
	}

	setTimeout(registerArmy, 1000);

	var plan1 = [
		'spaceship'
	];
	var plan2 = [
		'fence'
	];
	var plan3 = [
		'spaceship',
		'glider', 
		'mine',
		'fence'
	];
	var planIndex = 0;
  var fenceLocation = 0;

	function cb(data) {
		var pixels = [];
		var plan;
		if (data.generation === 1) {
			planIndex = 0;
      fenceLocation = 0;
		}
		if (data.generation < 200) {
			plan = plan1;
		} else if (data.generation < 520) {
			plan = plan2;
		} else {
			plan = plan3;
		}
		if (plan[planIndex] === 'mine') {
			pixels = tryPlaceMine(data);
		} else if (plan[planIndex] === 'fence') {
			pixels = tryPlaceFence(data);
		} else if (plan[planIndex] === 'glider') {
			pixels = tryPlaceGlider(data);
		} else if (plan[planIndex] === 'spaceship') {
			pixels = tryPlaceSpaceship(data);
		}
		if (pixels.length > 0) {
			planIndex = (planIndex + 1) % plan.length;
		}
		return pixels;
	}

	function tryPlaceMine(data) {
		var pixels = [];
		var r, c;
		if (data.budget >= 3) {
			c = Math.floor(Math.random() * (data.cols - 1));
			r = Math.floor(Math.random() * 60) + 20;
			pixels.push([c, r]);
			pixels.push([c, r+1]);
			pixels.push([c+1, r]);			
		}
		return pixels;
	}

	function tryPlaceFence(data) {
		var pixels = [];
		var r, c;
		if (data.budget >= 3) {
			c = fenceLocation;
			r = data.rows - 15;
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

	function tryPlaceGlider(data) {
		var pixels = [];
		var r, c;
		if (data.budget >= 5) {
			c = Math.floor(Math.random() * (data.cols - 2));
			r = 0;
			pixels.push([c, r]);
			pixels.push([c+1, r]);
			pixels.push([c+2, r]);
			pixels.push( Math.floor(Math.random()*2) === 0 ? [c, r+1] : [c+2, r+1]);
			pixels.push([c+1, r+2]);
		}
		return pixels;
	}

	function tryPlaceSpaceship(data) {
		var pixels = [];
		var r, c;
		if (data.budget >= 9) {
			c = Math.floor(Math.random() * (data.cols - 3));
			r = 0;
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

})();
