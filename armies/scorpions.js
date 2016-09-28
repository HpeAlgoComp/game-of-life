//INPROVE THIS CODE

(function() {

	function registerArmy() {
		window.registerArmy({
			name: 'SAAS-SCORPIONS',
			icon: 'scorpion',
			cb: cb
		});
	}

	setTimeout(registerArmy, 0);
	var up = false;
	var layingLocation;
	var spaceshipLocations = {};
	var wallLocations = {};
	
	var plan = [
		'shield',	
		'glider'		
	];
	var planIndex = 0;
	var fenceLocation = 0;


	function cb(data) {
		var pixels = [];
		var randomSeed = Math.random()*1000;	
		var m = new MersenneTwister(randomSeed);
		var randomValue = m.random();

		
		if (data.generation === 1) {
			fenceLocation = 0;
		}
		
		if (data.generation <= 72) {
			pixels = tryPlaceSpaceship(data);	
		} else  if (1000 < data.generation % 1000 && data.generation % 1000 <= 1072) {
			pixels = tryPlaceSpaceship(data);
		} else  if (2000 < data.generation && data.generation <= 2054) {
			pixels = tryPlaceSpaceship(data);
		} else  if (4000 < data.generation && data.generation <= 4054) {
			pixels = tryPlaceSpaceship(data);
		} else  if (8000 < data.generation && data.generation <= 8090) {
			pixels = tryPlaceSpaceship(data);
		} else  if (10000 < data.generation && data.generation <= 10090) {
			pixels = tryPlaceSpaceship(data);
		} else  if (randomValue < 0.2) {
			pixels = tryPlaceMine(data);					
		} else {
			pixels = tryPlaceGlider(data);			
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
	
	function tryPlaceGlider(data) {
		var pixels = [];
		var r, c;		
		if (data.budget >= 5) {
			c = Math.floor(Math.random() * (data.cols - 1));
			r = 0;
			pixels.push([c, r]);
			pixels.push([c+1, r]);
			pixels.push([c+2, r]);
			pixels.push( Math.floor(Math.random()*2) === 0 ? [c, r+1] : [c+2, r+1]);
			pixels.push([c+1, r+2]);
		}
		return pixels;
	}
	
	
	function buildWall(data) {
		var pixels = [];
		var c,r;
		if (!layingLocation) {
			layingLocation = Math.floor(Math.random() * (data.cols - 1));
		} else if (data.budget >= 3) {
			while (wallLocations[layingLocation]) {
				layingLocation = Math.floor(Math.random() * (data.cols - 1));	
				layingLocation += layingLocation % 3;				
			}
			wallLocations[layingLocation] = true;			
			c = layingLocation;
			r = up ? data.rows - 10 : data.rows - 14;
			up = !up;			 
			pixels.push([c-1, r]);
			pixels.push([c, r]);
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
	
	
	var MersenneTwister = function(seed) {
  if (seed == undefined) {
    seed = new Date().getTime();
  } 
  /* Period parameters */  
  this.N = 624;
  this.M = 397;
  this.MATRIX_A = 0x9908b0df;   /* constant vector a */
  this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
  this.LOWER_MASK = 0x7fffffff; /* least significant r bits */
 
  this.mt = new Array(this.N); /* the array for the state vector */
  this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

  this.init_genrand(seed);
}  
 
/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(s) {
  this.mt[0] = s >>> 0;
  for (this.mti=1; this.mti<this.N; this.mti++) {
      var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
   this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
  + this.mti;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this.mt[this.mti] >>>= 0;
      /* for >32 bit machines */
  }
}
 
/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
  var i, j, k;
  this.init_genrand(19650218);
  i=1; j=0;
  k = (this.N>key_length ? this.N : key_length);
  for (; k; k--) {
    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
      + init_key[j] + j; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++; j++;
    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
    if (j>=key_length) j=0;
  }
  for (k=this.N-1; k; k--) {
    var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
    this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
      - i; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++;
    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
  }

  this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */ 
}
 
/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function() {
  var y;
  var mag01 = new Array(0x0, this.MATRIX_A);
  /* mag01[x] = x * MATRIX_A  for x=0,1 */

  if (this.mti >= this.N) { /* generate N words at one time */
    var kk;

    if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
      this.init_genrand(5489); /* a default initial seed is used */

    for (kk=0;kk<this.N-this.M;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    for (;kk<this.N-1;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
    this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

    this.mti = 0;
  }

  y = this.mt[this.mti++];

  /* Tempering */
  y ^= (y >>> 11);
  y ^= (y << 7) & 0x9d2c5680;
  y ^= (y << 15) & 0xefc60000;
  y ^= (y >>> 18);

  return y >>> 0;
}
 
/* generates a random number on [0,0x7fffffff]-interval */
MersenneTwister.prototype.genrand_int31 = function() {
  return (this.genrand_int32()>>>1);
}
 
/* generates a random number on [0,1]-real-interval */
MersenneTwister.prototype.genrand_real1 = function() {
  return this.genrand_int32()*(1.0/4294967295.0); 
  /* divided by 2^32-1 */ 
}

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function() {
  return this.genrand_int32()*(1.0/4294967296.0); 
  /* divided by 2^32 */
}
 
/* generates a random number on (0,1)-real-interval */
MersenneTwister.prototype.genrand_real3 = function() {
  return (this.genrand_int32() + 0.5)*(1.0/4294967296.0); 
  /* divided by 2^32 */
}
 
/* generates a random number on [0,1) with 53-bit resolution*/
MersenneTwister.prototype.genrand_res53 = function() { 
  var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6; 
  return(a*67108864.0+b)*(1.0/9007199254740992.0); 
} 

})();
