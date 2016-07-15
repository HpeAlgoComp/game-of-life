(function() {

	function registerArmy() {
		window.registerArmy({
			name: 'BotZero',
			icon: '',
			cb: cb
		});
	}

	setTimeout(registerArmy, 0);

	var plan = [
		'blocker', 
		'glider'		
	];
	var planIndex = 0;

	function cb(data) {
		var pixels = [];
		if (plan[planIndex] === 'blocker') {
			pixels = tryPlaceBlocker(data);
		} else if (plan[planIndex] === 'glider') {
			pixels = tryPlaceGlider(data);
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
			r = Math.floor(Math.random() * (data.rows - 1));
			pixels.push([c, r]);
			pixels.push([c, r+1]);
			pixels.push([c+1, r]);
			pixels.push([c+1, r+1]);			
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

})();
