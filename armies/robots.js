
(function() {



	setTimeout(function registerArmy() {
		window.registerArmy({
			name: 'ADM-ACOE-ROBOTS',
			icon: 'robot',
			cb: cb2
		});
	}, 0);
//   -------------------------------------------------- ARRAY OF SHAPES ------------------------------------------------------------

//-------------------- ATTACK
var glider = [[0,-1],[1, 0],[-1, 1],[0, 1],[1, 1]];
var gosperGliderGun = [[6,-4],[4,-3],[6,-3],[-6,-2],[-5,-2],[2,-2],[3,-2],[16,-2],[17,-2],[-7,-1],[-3,-1],[2,-1],[3,-1],[16,-1],[17,-1],[-18,0],[-17,0],[-8,0],[-2,0],[2,0],[3,0],[-18,1],[-17,1],[-8,1],[-4,1],[-2,1],[-1,1],[4,1],[6,1],[-8,2],[-2,2],[6,2],[-7,3],[-3,3],[-6,4],[-5,4]];
var lightweight_spaceship = [[-1, -2],[2, -2],[-2, -1],[-2, 0],[2, 0],[-2, 1],[-1, 1],[0, 1],[1, 1]];
var ship=[[-1,-4],[0,-4],[1,-4],[2,-4],[3,-4],[4,-4],[-3,-3],[-2,-3],[4,-3],[-5,-2],[-4,-2],[-2,-2],[4,-2],[-1,-1],[3,-1],[1,0],[1,1],[2,1],[0,2],[1,2],[2,2],[3,2],[0,3],[1,3],[3,3],[4,3],[2,4],[3,4]];
var airforce=[[0,-7],[-1,-6],[1,-6],[0,-5],[-2,-3],[-1,-3],[0,-3],[1,-3],[2,-3],[-3,-2],[3,-2],[5,-2],[6,-2],[-4,-1],[-2,-1],[-1,-1],[3,-1],[5,-1],[6,-1],[-4,0],[-2,0],[1,0],[3,0],[-7,1],[-6,1],[-4,1],[0,1],[1,1],[3,1],[-7,2],[-6,2],[-4,2],[2,2],[-3,3],[-2,3],[-1,3],[0,3],[1,3],[-1,5],[-2,6],[0,6],[-1,7]];
var puffer2 = [[-8, -2], [-7, -2], [-6, -2], [6, -2], [7, -2], [8, -2], [-9, -1], [-6, -1], [5, -1], [8, -1], [-6, 0], [-1, 0], [0, 0], [1, 0], [8, 0], [-6, 1], [-1, 1], [2, 1], [8, 1], [-7, 2], [-2, 2], [7, 2]];
var lidka = [[-3, -7], [-4, -6], [-2, -6], [-3, -5], [4, 3], [2, 4], [4, 4], [1, 5], [2, 5], [4, 5], [0, 7], [1, 7], [2, 7]];
var blinker = [[-1, 0], [0, 0], [1, 0]];



//--------------------DEFENCE
var block =[[-1,-1],[0,-1],[-1,0],[0,0]];
var bigs=[[1,-3],[2,-3],[0,-2],[3,-2],[0,-1],[2,-1],[3,-1],[-3,0],[-2,0],[0,0],[-3,1],[0,1],[-2,2],[-1,2]];
var acron=[[-2,-1],[0,0],[-3,1],[-2,1],[1,1],[2,1],[3,1]];
var beehive=[[-1,-1],[0,-1],[-2,0],[1,0],[-1,1],[0,1]];
var vacuum=[[-23,-21],[-22,-21],[2,-21],[3,-21],[-23,-20],[-22,-20],[2,-20],[0,-19],[2,-19],[-9,-18],[-8,-18],[0,-18],[1,-18],[-24,-17],[-23,-17],[-9,-17],[-7,-17],[-24,-16],[-23,-16],[-9,-16],[-7,-16],[-6,-16],[-8,-15],[-7,-15],[-8,-14],[20,-13],[21,-13],[-8,-12],[20,-12],[21,-12],[-8,-11],[-7,-11],[-24,-10],[-23,-10],[-9,-10],[-7,-10],[-6,-10],[8,-10],[12,-10],[-24,-9],[-23,-9],[-9,-9],[-7,-9],[7,-9],[13,-9],[21,-9],[22,-9],[-9,-8],[-8,-8],[7,-8],[21,-8],[22,-8],[7,-7],[8,-7],[12,-7],[-23,-6],[-22,-6],[9,-6],[10,-6],[11,-6],[-23,-5],[-22,-5],[9,-4],[10,-4],[11,-4],[7,-3],[8,-3],[12,-3],[7,-2],[21,-2],[22,-2],[7,-1],[13,-1],[21,-1],[22,-1],[8,0],[12,0],[20,2],[21,2],[20,3],[21,3],[13,8],[14,8],[13,9],[15,9],[23,9],[24,9],[15,10],[23,10],[24,10],[13,11],[14,11],[15,11],[-2,12],[0,12],[-3,13],[-2,13],[-1,13],[-3,14],[-2,14],[-1,14],[-3,15],[13,15],[14,15],[15,15],[1,16],[3,16],[15,16],[-3,17],[-2,17],[3,17],[13,17],[15,17],[-8,18],[-7,18],[-2,18],[2,18],[3,18],[13,18],[14,18],[-9,19],[-7,19],[0,19],[-9,20],[-10,21],[-9,21]];
var loaf=[[-1,-2],[0,-2],[-2,-1],[1,-1],[-1,0],[1,0],[0,1]];
var eater = [[-2, -2], [-1, -2], [-2, -1], [0, -1], [0, 0], [0, 1], [1, 1]];
var puffer2 = [[-8, -2], [-7, -2], [-6, -2], [6, -2], [7, -2], [8, -2], [-9, -1], [-6, -1], [5, -1], [8, -1], [-6, 0], [-1, 0], [0, 0], [1, 0], [8, 0], [-6, 1], [-1, 1], [2, 1], [8, 1], [-7, 2], [-2, 2], [7, 2]];
var lidka = [[-3, -7], [-4, -6], [-2, -6], [-3, -5], [4, 3], [2, 4], [4, 4], [1, 5], [2, 5], [4, 5], [0, 7], [1, 7], [2, 7]];
var blinker = [[-1, 0], [0, 0], [1, 0]];


	// ------------ Plan for the game
	// ------------ Board Info: cols - 0 to 400, row - o to 100
	
	var acoe_plan = [

		{pattern:lightweight_spaceship,c:397,r:2,rotate:true,flipHorizontal:true,flipVertical:true, count: 2, padding_c: -25, padding_r: 0},
		{pattern:lightweight_spaceship,c:2,r:2,rotate:true,flipHorizontal:true,flipVertical:true, count: 2, padding_c: 25, padding_r: 0},

		{pattern:acron,c:10,r:90,rotate:true,flipHorizontal:true,flipVertical:true, count: 10, padding_c: 20, padding_r: 0},
		{pattern:acron,c:390,r:90,rotate:true,flipHorizontal:true,flipVertical:true, count: 10, padding_c: -20, padding_r: 0},
		{pattern:lightweight_spaceship,c:2,r:2,rotate:true,flipHorizontal:true,flipVertical:true, count: 2, padding_c: 25, padding_r: 0},
		{pattern:lightweight_spaceship,c:397,r:2,rotate:true,flipHorizontal:true,flipVertical:true, count: 3, padding_c: -25, padding_r: 0},

		{pattern:acron,c:390,r:50,rotate:true,flipHorizontal:true,flipVertical:true, count: 10, padding_c: -20, padding_r: 0},
		{pattern:acron,c:10,r:50,rotate:true,flipHorizontal:true,flipVertical:true, count: 10, padding_c: 20, padding_r: 0}

		];




	// ------------ init indexes before the callback kicks in...
	
	var planIndex = 0;
	var shapeCounterIndex=0;


	var plan2 = acoe_plan;
	var planIndex2 = 0;
	var shapeCounterIndex2=0;



	function cb2(data) {
		var pixels = [];				

		var currentShape=plan2[planIndex2];

		if(data.generation==1){
			planIndex2=0;
			shapeCounterIndex2=0;
		}

		if (hasEnoughBudgetForShape(data,currentShape)) {
			
			// ------------ calculate the relavent c and r....
			var cPos=(currentShape.c+shapeCounterIndex2*currentShape.padding_c) % 400;
			var rPos=(currentShape.r+shapeCounterIndex2*currentShape.padding_r) % 100;

			pixels=insertShape(currentShape, cPos, rPos);
			shapeCounterIndex2++;

			// ------------ did we finish building a series of shape?
			if (shapeCounterIndex2==currentShape.count){

				// ------------ move the next plan index
				shapeCounterIndex2=0;
				planIndex2 = (planIndex2+1) % plan2.length;

			}
		}
		return pixels;
	}				



	function insertShape(shape,col,row){
		retArray=[];

		var flipH = shape.flipHorizontal? -1:1;
		var flipV = shape.flipVertical? -1:1;
		
		for (i in shape.pattern){

			if (shape.rotate){
				retArray.push([col+flipH * shape.pattern[i][1],row-flipV *shape.pattern[i][0]]);
				
			}
			else{
				retArray.push([col+flipH * shape.pattern[i][0],row-flipV *shape.pattern[i][1]]);
			}
		}

		return retArray;
	}


	// ------------ Utils functions

	function hasEnoughBudgetForShape(data,shape){
		return (data.budget >= getShapeSize(shape.pattern));
	}

	function isShapeWasPlaced(pixels){
		return (pixels.length > 0);
	}

	function getShapeSize(pixels){
		return pixels.length;
	}



})();
