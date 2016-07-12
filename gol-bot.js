(function() {

	function registerArmy() {
		window.registerArmy({
			name: 'BOT',
			icon: '',
			cb: cb
		});
	}

	setTimeout(registerArmy, 0);

	var plan1 = [
		'spaceship'
	];
	var plan2 = [
		'interceptor'
	];
	var plan3 = [
		'spaceship',
		'glider', 
		'blocker',
		'blocker',
		'blocker',
		'interceptor'
	];
	var planIndex = 0;

	function cb(data) {
		var pixels = [];
		var plan;
		if (data.ticks < 200) {
			plan = plan1;
		} else if (data.ticks < 600) {
			plan = plan2;
		} else {
			plan = plan3;
		}
		if (plan[planIndex] === 'blocker') {
			pixels = tryPlaceBlocker(data);
		} else if (plan[planIndex] === 'interceptor') {
			pixels = tryPlaceInterceptor(data);
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

	function tryPlaceBlocker(data) {
		var pixels = [];
		var r, c;
		if (data.budget >= 4) {
			c = Math.floor(Math.random() * (data.cols - 1));
			r = Math.floor(Math.random() * 60) + 20;
			pixels.push([c, r]);
			pixels.push([c, r+1]);
			pixels.push([c+1, r]);
			pixels.push([c+1, r+1]);			
		}
		return pixels;
	}

	function tryPlaceInterceptor(data) {
		var pixels = [];
		var r, c;
		if (data.budget >= 3) {
			c = Math.floor(Math.random() * data.cols / 4) * 4;
			r = data.rows - 10;
			pixels.push([c, r]);
			pixels.push([c+1, r]);
			pixels.push([c+2, r]);				
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
