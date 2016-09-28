(function() {

	function getRnd(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function tryPlaceMine(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 3) {
			c = (col === 0) ? 0 : col || getRnd(0, data.cols - 2);
			r = (row === 0) ? 0 : row || getRnd(20, 80);
			pixels.push([c, r]);
			pixels.push([c, r+1]);
			pixels.push([c+1, r]);
		}
		return pixels;
	}
  
  function tryPlaceAcorn(data, col, row) { 
  var pixels = [];
		var r = row, c = col;
		if (data.budget >= 7) {			
			pixels.push([c, r+1]);
			pixels.push([c+1, r+3]);
			pixels.push([c+2, r+0]);
      pixels.push([c+2, r+1]);
      pixels.push([c+2, r+4]);
      pixels.push([c+2, r+5]);
      pixels.push([c+2, r+6]);
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
	
  var cb = function cb(data) {      
		var pixels = [];
		var plan;
		if (data.generation === 1) {
      flag = true
      flag2 = true
      flag3 = true
			planIndex = 0;
			fenceLocation = 0;
		}
    
     if (flag) {
    	var res = tryPlaceAcorn(data, 35, 75)
      if (res.length > 0) {        
       flag = false
       return res
      }
    }
    
    if (flag2) {
    	var res = tryPlaceAcorn(data, data.cols-35, 75)      
      if (res.length > 0) {        
       flag2 = false
       return res
      }
    }
    
     if (flag3) {
    	var res = tryPlaceAcorn(data, data.cols/2, 75)      
      if (res.length > 0) {        
       flag3 = false
       return res
      }
    }
    
		plan = ['mine', 'spaceship'];
		if (plan[planIndex] === 'mine') {
			pixels = tryPlaceMine(data);
		} else if (plan[planIndex] === 'spaceship') {
			pixels = tryPlaceSpaceship(data, null, 0);
		}
		if (pixels.length > 0) {
			planIndex = (planIndex + 1) % plan.length;
		}
		return pixels;
	};
    
	setTimeout(function registerArmy() {
		window.registerArmy({
			name: "BIG-DATA-EAGLES",
      icon : "eagle",
			cb: cb
		});
	}, 0);

})();
