function GolSettings() {

	var that = this;

	that.colorsRGB = [ [0x11, 0xFF, 0xCC], [0xFF, 0x33, 0x33] ];

	that.cols = 400;
	that.rows = 200;

	that.initialBudget = 0;
	that.budgetTickQuantum = 1;

	that.powerMaxValue = 100;
	that.millisBetweenPowerTimeReductions = 1000;
	that.powerTimeQuantum = 1;
	that.millisMaxRoundDuration = that.powerMaxValue * that.millisBetweenPowerTimeReductions / that.powerTimeQuantum;

	that.powerHitQuantum = 5;

	that.millisEndRoundBoardFreeze = 3000;
	that.millisEndRoundMessageTime = 3000;
	that.winRoundLimit = 3;
}
