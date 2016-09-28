(function() {

	// utilities ---------------------------------------------------------------------------------------------------------

	function getRnd(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// structures --------------------------------------------------------------------------------------------------------
	function tryPlacePentomino(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 5) {
			c = col || getRnd(0, data.cols - 3);
			r = row || getRnd(0, data.rows - 3);
      //console.log("acorn coors: col="+c+" row="+r);
			pixels.push([c, r]);
			pixels.push([c, r+1]);
			pixels.push([c+1, r+1]);
			pixels.push([c+1, r+2]);
			pixels.push([c+2, r+1]);
		}
		return pixels;
	}

	function tryPlaceAcorn(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 10) {
			c = col || getRnd(0, data.cols - 3);
			r = row || getRnd(0, data.rows - 3);
      //console.log("acorn coors: col="+c+" row="+r);
			pixels.push([c, r]);
			pixels.push([c+2, r]);
			pixels.push([c+2, r+1]);
			pixels.push([c+4, r+3]);
			pixels.push([c+4, r+4]);
			pixels.push([c+4, r+2]);
			pixels.push([c+6, r+5]);
			pixels.push([c+6, r+4]);
			pixels.push([c+6, r+3]);
			pixels.push([c+7, r+4]);
		}
		return pixels;
	}
  
function tryPlaceSmallAcorn(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 7) {
			c = col || getRnd(0, data.cols - 3);
			r = row || getRnd(0, data.rows - 3);
      //console.log("acorn coors: col="+c+" row="+r);
			pixels.push([c, r]);
			pixels.push([c, r+1]);
			pixels.push([c+2, r+1]);
			pixels.push([c+1, r+3]);
			pixels.push([c, r+4]);
			pixels.push([c, r+5]);
			pixels.push([c, r+6]);
		}
		return pixels;
	}
  
  function tryPlaceMine(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 3) {
			c = (col === 0) ? 0 : col || getRnd(0, data.cols - 2);
			r = (row === 0) ? 0 : row || getRnd(70, 90);
      //console.log("mine coors: col="+c+" row="+r);
			pixels.push([c, r]);
			pixels.push([c, r+1]);
			pixels.push([c+1, r]);
		}
		return pixels;
	}
	
	function tryPlaceFenceMng(data, col, row) {
		var pixels = [];
		if (fenceDirection === "left") {
			pixels = tryPlaceFenceLeft(data, col, row);
			fenceDirection = "right";
		} else if (fenceDirection === "right") {
			pixels = tryPlaceFenceRight(data, col, row);
			fenceDirection = "left";
		}
		//pixels = tryPlaceFence(data, col, row);
		
   		return pixels;
	}

	function tryPlaceFence(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 3) {
			c = col || fenceLocation;
			r = row || data.rows - 15;
      //console.log("fence coors: col="+c+" row="+r);
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
	
	function tryPlaceFenceRight(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 3) {
			c = col || rightFenceLocation;
			r = row || data.rows - 15;
      //console.log("fence coors: col="+c+" row="+r);
			pixels.push([c, r]);
			pixels.push([c+1, r]);
			pixels.push([c, r+1]);
			rightFenceLocation += 10;
			if (rightFenceLocation > data.cols - 10) {
				rightFenceLocation = 0;
			}
		}
		return pixels;
	}
	
	function tryPlaceFenceLeft(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 3) {
			c = col || leftFenceLocation;
			r = row || data.rows - 15;
      //console.log("fence coors: col="+c+" row="+r);
			pixels.push([c, r]);
			pixels.push([c+1, r]);
			pixels.push([c, r+1]);
			leftFenceLocation -= 10;
			if (leftFenceLocation < 10) {
				leftFenceLocation = data.cols - 5;
			}
		}
		return pixels;
	}

	function tryPlacePixel(data, col, row) {
  	var pixels = [];
		var r, c;
		if (data.budget >= 3) {
    	c = col || getRnd(0, data.cols - 3);
			r = row || getRnd(0, data.rows - 3);
      pixels.push([c, r]);
      pixels.push([c+1, r]);
      pixels.push([c+2, r]);
    }
    return pixels;
  }
  
	function tryPlaceGlider(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 5) {
			c = col || getRnd(0, data.cols - 3);
		  //r = row || getRnd(0, data.rows - 3);
      r = row || 10;
     //console.log("glider coors: col="+c+" row="+r);
			pixels.push([c, r]);
			pixels.push([c+1, r]);
			pixels.push([c+2, r]);
			pixels.push(getRnd(0, 1) === 0 ? [c, r+1] : [c+2, r+1]);
			pixels.push([c+1, r+2]);
		}
		return pixels;
	}
  
  function tryPlaceGliderWall(data, col, row) {
		var pixels = [];
		var r, c;
		if (data.budget >= 5) {
			c = col || fenceLocation;
			r = row || data.rows - 15;
			pixels.push([c, r]);
			pixels.push([c+1, r]);
			pixels.push([c+2, r]);
			//pixels.push(getRnd(0, 1) === 0 ? [c, r+1] : [c+2, r+1]);
      pixels.push( [c+2, r+1]);
			pixels.push([c+1, r+2]);
      fenceLocation += 5;
			if (fenceLocation > data.cols - 2) {
				fenceLocation = 0;
			}
		}
		return pixels;
	}
  
  function tryPlaceSpaceship(data, col, row) {
  	var pixels =[];
  	if (shipDirection === "left") {
    	pixels = tryPlaceSpaceshipLeft(data, col, row);
		shipDirection = "right";
    } else if (shipDirection === "right") {
    	pixels = tryPlaceSpaceshipRight(data, col, row);
		shipDirection = "left";
    }
    return pixels;
  }

	function tryPlaceSpaceshipLeft(data, col, row) {
		var pixels = [];
		var r, c;
    //for (i =0 ; i < 1 ; i++) {
		if (data.budget >= 9) {
			c = col || getRnd(0, data.cols - 4);
			//r = row || 75;
			c = col || leftShipLocation;
			r = row || data.rows - 45;
     // r = row || fenceLocation;
     //r = row || 0;
     //console.log("spaceship coors: col="+c+" row="+r);
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
			leftShipLocation -= 26;
     // console.log("shipLocationLeft="+shipLocation);
			//if (fenceLocation > data.cols - 2) {
			if (leftShipLocation < 10) {
				//leftShipDirection = "right";
				leftShipLocation = data.cols - 6;
			}
      
	}
    //}
		return pixels;
}
  
function tryPlaceSpaceshipRight(data, col, row) {
	var pixels = [];
	var r, c;
    //for (i =0 ; i < 1 ; i++) {
	if (data.budget >= 9) {
		c = col || getRnd(0, data.cols - 4);
		//r = row || 75;
		c = col || rightShipLocation;
		r = row || data.rows - 45;
		// r = row || fenceLocation;
		//r = row || 0;
		//console.log("spaceship coors: col="+c+" row="+r);
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
		rightShipLocation += 26;
		//console.log("shipLocationRight="+shipLocation);
		if (rightShipLocation > data.cols - 10) {
			//rightShipDirection = "left";
			rightShipLocation = 17; 
		}
  
	}
    //}
	return pixels;
}

	// bots --------------------------------------------------------------------------------------------------------------

	var bot1 = function bot1(data) {
		var pixels = [];
		var plan;
    //console.log(data);
		if (data.generation === 1) {
			planIndex = 0;
      fenceLocation = 0;
      shipLocation = data.cols - 6;
      shipDirection = "left";
		}
    /*if (data.generation < 240) {
    	pixels = tryPlaceGliderWall(data);
      return pixels;
    }*/
   
   if (data.generation < 800) {
			plan = ['spaceship'];
		} else if (data.generation < 1040) {
			plan = ['fence'];
		} else if (data.generation < 1500) {
			plan = ['spaceship'];
  /*  } else if (data.generation < 1740) {
      pixels = tryPlaceGliderWall(data,null,10);
      return pixels;*/
      } else if (data.generation < 1740) {
      	plan = ['fence'];
		} else if (data.generation < 2000) {
      	plan = ['spaceship2'];
		} else {
    		plan = ['mine','spaceship2', 'glider','fence','glider','spaceship'];
		}
    
		if (plan[planIndex] === 'mine') {
			pixels = tryPlaceMine(data);
		} else if (plan[planIndex] === 'fence') {
			pixels = tryPlaceFence(data);
		} else if (plan[planIndex] === 'glider') {
			pixels = tryPlaceGlider(data, null, 0);
		} else if (plan[planIndex] === 'spaceship') {
			pixels = tryPlaceSpaceship(data, null, 0);
		} else if (plan[planIndex] === 'pixel') {
			pixels = tryPlacePixel(data, null, 0);
		} else if (plan[planIndex] === 'spaceship2') {
      
			pixels = tryPlaceSpaceship(data, null, 10);
		}else if (plan[planIndex] === 'acorn') {
    	pixels=tryPlaceAcorn(data,null,10);
    }
		if (pixels.length > 0) {
			planIndex = (planIndex + 1) % plan.length;
		}
		return pixels;
	};

	var bot2 = function bot2(data) {
		var pixels = [];
		var plan;
		if (data.generation === 1) {
			planIndex = 0;
			fenceLocation = 0;
		}
		plan = ['Sacorn', 'acorn'];
		if (plan[planIndex] === 'acorn') {
			pixels = tryPlacePentomino(data,null,1);
		} else if (plan[planIndex] === 'Sacorn') {
			pixels = tryPlacePentomino(data);
		}
		if (pixels.length > 0) {
			planIndex = (planIndex + 1) % plan.length;
		}
		return pixels;
	};

	var bot3 = function bot3(data) {
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

var bot4 = function bot4(data) {
	var pixels = [];
	
	if (data.generation === 1) {
		planIndex = 0;
		fenceLocation = 0;
		row = data.rows - 10;
		col = 5;
		leftShipLocation = data.cols - 6;
		rightShipLocation = 17;
		shipDirection = "left";
		leftShipDirection = "left";
		rightShipDirection = "right";
		fenceDirection = "left";
		leftFenceLocation = data.cols - 5;
		rightFenceLocation = 0;
	}
    if (data.generation % 240 === 0) {
			row -= 10;
      planIndex +=1;
    }
    if (data.generation % 10 === 0) {
			col += 10;
    }
	if (row < 5)	{row = data.rows - 15;}
  if (col > data.cols - 5)	{col = 5;}
  if (planIndex % 4 === 0) {
    	pixels = tryPlaceSpaceship(data, null, 5);
    } 
    else if (planIndex % 2 === 0) {
    	pixels = tryPlaceSpaceship(data, null, row);
    }
    else if (planIndex % 3 === 0) {
    	pixels = tryPlaceFenceMng(data, null, row);
    }
    else if (planIndex % 9 === 0) {
    	pixels = tryPlacePentomino(data, null, 1);
    }
    else if (planIndex % 8 === 0) {
    	pixels = tryPlaceSmallAcorn(data, null, 80);
    }
   else {
   		 pixels = tryPlaceSpaceship(data, null, row);
    }
	return pixels;
};
		
	// init --------------------------------------------------------------------------------------------------------------

var planIndex = 0;
var fenceLocation = 0;
var rightShipLocation = 0;
var leftShipLocation = 0;
var shipLocation = 0;
var leftShipDirection = "left";
var rightShipDirection = "right";
var ShipDirection = "left";
var fenceDirection = "left";
var leftFenceLocation = 0;
var rightFenceLocation = 0;

var row = 0;
var col = 0;
var bots1 = [
	{name: '### SHARKIE ### ALPHA',   icon:'bot', cb: bot1},
	{name: '### SHARKIE ### BETA',   icon:'bot', cb: bot2},
	{name: '### SHARKIE ### GAMA', icon:'bot', cb: bot3},
	{name: '### STORM SHARKS ###', icon:'bot', cb: bot4}
];

var bot = {name: 'STORM-SHARKS', icon:'shark', cb: bot4};

var b = getRnd(0, bots1.length-1);
var bot1 = bots1[b];
var bot1 = bots1[3];
	
setTimeout(function registerArmy() {
		window.registerArmy({
			name: bot.name,
			icon: bot.icon,
			cb: bot.cb
		});
	}, 0);

})();
