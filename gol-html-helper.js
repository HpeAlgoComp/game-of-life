function GolHtmlHelper() {

	var that = this;

	that.init = function init(settings) {
		that.settings = settings;
		that.cols = settings.cols;
		that.rows = settings.rows;
		that.colorsRGB = settings.colorsRGB;
		that.addCssRules();
	}

	that.drawUserInterface = function drawUserInterface(armies) {
		var container, canvas;
		container = that.addContainer();
		that.addArmyLine(container, 1, armies[1]);
		canvas = that.addCanvas(container);
  		that.addArmyLine(container, 0, armies[0]);
		that.ctx = canvas.getContext('2d');
	}

	that.getColorHexStr = function getColorHexStr(colorRGBArray) {
		return colorRGBArray[0].toString(16) + colorRGBArray[1].toString(16) + colorRGBArray[2].toString(16);
	}

	that.addCssRule = function addCssRule(cssText) {
		var style;
		style = document.createElement('style');
		style.type = 'text/css';
		if (style.styleSheet) {
			style.styleSheet.cssText = cssText;
		} else {
			style.appendChild(document.createTextNode(cssText));
		}
		document.head.appendChild(style);
	}

	that.addCssRules = function addCssRules() {
		that.addCssRule('* {box-sizing: border-box;}');
		that.addCssRule('html {height: 100%;}');
		that.addCssRule('body {height: 100%; margin: 0; overflow: hidden; background-color: #222; color: #FFF; font-family: monospace; font-size: 15px;}');
		that.addCssRule('#gol-container {height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;}');
		that.addCssRule('#gol-canvas {background-color: #000000;}');
		that.addCssRule('#gol-army-line-0 {margin: 5px; color: #' + that.getColorHexStr(that.colorsRGB[0]) + ';}');
		that.addCssRule('#gol-army-line-1 {margin: 5px; color: #' + that.getColorHexStr(that.colorsRGB[1]) + ';}');
	}

	that.addContainer = function addContainer() {
		var container;
		container = document.createElement('div');
		container.setAttribute('id', 'gol-container');
		return document.body.appendChild(container);
	}

	that.addArmyLine = function addArmyLine(container, index, army) {
		var textNode, armyLine;
		armyLine = document.createElement('div');
		armyLine.setAttribute('id', 'gol-army-line-' + index);
		textNode = document.createTextNode(army.name);
		armyLine.appendChild(textNode);
		return container.appendChild(armyLine);
	}

	that.addCanvas = function addCanvas(container) {
		var canvas;
		canvas = document.createElement('canvas');
		canvas.setAttribute('id', 'gol-canvas');
		canvas.setAttribute('width', that.cols + 'px');
		canvas.setAttribute('height', that.rows + 'px');
		return container.appendChild(canvas);
	}

	that.drawVectorToCanvas = function drawVectorToCanvas(curVector, nxtVector) {
		var i, x, y, val, imgData;
		imgData = that.ctx.createImageData(that.cols, that.rows);
		for (y = 0; y < that.rows; y++) {
			for (x = 0; x < that.cols; x++) {
				i = y * that.cols + x;
				if (curVector[i] !== nxtVector[i]) {
					if (nxtVector[i] === -1) {
						imgData.data[i * 4] = imgData.data[i * 4 + 1] = imgData.data[i * 4 + 2] = 0;
					} else {
						imgData.data[i * 4] = that.colorsRGB[nxtVector[i]][0];
						imgData.data[i * 4 + 1] = that.colorsRGB[nxtVector[i]][1];
						imgData.data[i * 4 + 2] = that.colorsRGB[nxtVector[i]][2];
					}
					imgData.data[i * 4 + 3] = 255;
				}
			}
		}
		that.ctx.putImageData(imgData, 0, 0);
	}

}