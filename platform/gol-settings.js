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
	that.millisMaxRoundDuration = 60000;

	that.powerHitQuantum = 5;

	that.millisArmyVsArmyMessageDuration = 5000;
	that.millisEndRoundBoardFreezeDuration = 3000;
	that.millisEndRoundMessageDuration = 3000;
	that.winRoundLimit = 3;
}
