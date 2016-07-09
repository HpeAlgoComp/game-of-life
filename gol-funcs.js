function _log(msg) {
	console.log('LOG ' + msg);
}

function _err(msg) {
	console.log('ERR ' + msg);
}

function calcBrightness(hex) {
   var rgb=[],r=hex>>16&0xFF;g=hex>>8&0xFF;b=hex&0xFF;
   rgb.push(r, g, b);
   return Math.sqrt((rgb[0] * rgb[0] * 0.241) + (rgb[1] * rgb[1] * 0.691) + (rgb[2] * rgb[2] * 0.68) ) / 255;
}
