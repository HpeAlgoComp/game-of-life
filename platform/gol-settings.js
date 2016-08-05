function GolSettings() {

	var that = this;

	that.colorsRGB = [ [0x11, 0xFF, 0xCC], [0xFF, 0x33, 0x33] ];

	that.cols = 400;
	that.rows = 200;

	that.budgetTickQuantum = 1;

	that.powerMaxValue = 100;
	that.powerHitQuantum = 5;
	that.millisBetweenPowerTimeReductions = 2000;
	that.powerTimeQuantum = 1;		

	that.millisBetweenRounds = 5000;
	that.winRoundLimit = 3;
}
