function GolSettings() {

	var that = this;

	that.gameModes = {
		AUTO_START: 0,
		SINGLE_GAME: 1,
		STRATEGY_DEMO: 2,
		ALL_VS_ALL: 3
	};

	that.gameMode = that.gameModes.AUTO_START;

	that.colorsRGB = [ [0x11, 0xFF, 0xCC], [0xFF, 0x33, 0x33] ];

	that.cols = 400;
	that.rows = 200;

	that.powerMaxValue = 100;
	that.powerHitQuantum = 5;

	that.initialBudget = 0;
	that.budgetTickQuantum = 1;

	that.secondsMaxRoundDuration = 45;

	that.millisArmyVsArmyMessageDuration = 10000;
	that.millisEndRoundBoardFreezeDuration = 3000;
	that.millisEndRoundMessageDuration = 3000;

	that.winRoundLimit = 3;

	//that.alternativePlatformLocation = 'https://rawgit.com/HpeAlgoComp/game-of-life/master/platform';
	that.alternativePlatformLocation = 'platform';

	that.statsLocalStorageKey = 'game-of-life-stats';
}
