(function() {

	function registerArmy() {
		window.registerArmy({
			name: 'BOT',
			icon: '',
			cb: cb
		});
	}

	setTimeout(registerArmy, 0);

	function cb(data) {
		var pixels = [];
		var n, x, y, r, c;		
		c = Math.floor(Math.random() * (data.cols - 2) + 1);
		r = Math.floor(Math.random() * (data.rows - 2) + 1);
		pixels.push([c-1, r]);
		pixels.push([c, r]);
		pixels.push([c+1, r]);
		return pixels;
	}

})();
