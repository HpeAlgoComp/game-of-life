(function() {

	function GolGame() {

		var that = this;

		that.init = function init(settings) {
			var m;
			_dbg('init()');
			that.settings = settings;
			that.htmlHelper = new GolHtmlHelper();
			that.htmlHelper.init(settings);
			that.srcIndices = [-1, -1];
			that.armies = [];
			that.gameMode = settings.gameModes.EXTERNAL;
			that.round = 0;
			that.roundWins = [0, 0];
			that.lastWinner = '';
			that.hitSounds = [
				{file: 'explosion1.mp3', volume: 1},
				{file: 'explosion2.mp3', volume: 1},
				{file: 'explosion3.mp3', volume: 1},
				{file: 'explosion4.mp3', volume: 1},
				{file: 'explosion5.mp3', volume: 1},
				{file: 'explosion6.mp3', volume: 1},
				{file: 'explosion7.mp3', volume: 1},
				{file: 'explosion8.mp3', volume: 1},
				{file: 'explosion9.mp3', volume: 1}
			];
			that.selectSourceSound = {file: 'explosion1.mp3', volume: 1};
			that.armyVsArmySound = {file: 'explosion1.mp3', volume: 1};
			that.startRoundSound = {file: 'explosion1.mp3', volume: 1};
			that.endRoundSound = {file: 'explosion1.mp3', volume: 1};
			that.endGameSound = {file: 'explosion1.mp3', volume: 1};
			that.musicFiles = [
				{file: 'terminator_genisys.mp3', volume: 1},
				{file: 'dark_knight_rises.mp3', volume: 1},
				{file: 'wonder_woman.mp3', volume: 1},
				{file: 'transformers.mp3', volume: 1},
				{file: 'fury_road.mp3', volume: 1},
				{file: 'battleship.mp3', volume: 1},
				{file: 'blade_runner.mp3', volume: 1},
				{file: 'battlestar_galactica.mp3', volume: 1}
			];
			m = (localStorage.getItem('game-of-life-music-index') || 0) % that.musicFiles.length;
			that.music = that.musicFiles[m];
			that.playMusic(that.music);
			m = (m + 1) % that.musicFiles.length;
			localStorage.setItem('game-of-life-music-index', m);
			window.startGame = that.startGame;
			window.startPlayoff = that.startPlayoff;
			window.startTournament = that.startTournament;
			window.registerArmy = that.registerArmy;
			window.toggleSrc = that.toggleSrc;
			window.loadSources = that.loadSources;
		};

		that.startGame = function startGame() {
			_dbg('startGame()');
			that.settings.gameMode = that.gameModes.EXTERNAL;
			that.waitForArmies();
		};

		that.startPlayoff = function startPlayoff() {
			_dbg('startPlayoff()');
			that.settings.gameMode = that.settings.gameModes.PLAYOFF;
			that.htmlHelper.fadeInLoadSourcesPanel();
			that.htmlHelper.markSrcLines(that.srcIndices);
		};

		that.startTournament = function startTournament() {
			_dbg('startTournament()');
			that.settings.gameMode = that.settings.gameModes.ALL_VS_ALL;
	    that.tournament = {};
	    that.tournament.size = that.srcIndices.length;
	    that.tournament.size = 16;
	    if (that.tournament.size > 2) {
		    that.tournament.rounds = {};
		    that.tournament.runningTournament = true;
		    that.tournament.firstArmyIndex = 0;
		    that.tournament.secoundArmyIndex = 0;
		    that.startTournamentRound();
	    }
		};

		that.startTournamentRound = function startTournamentRound() {
	    console.log(JSON.stringify(that.tournament));
	    localStorage.setItem("TournamentRoundResualt", JSON.stringify(that.tournament));
	    if (that.tournament.secoundArmyIndex < (that.tournament.size-1)) {
        that.tournament.secoundArmyIndex++
	    }
	    else {
        that.tournament.firstArmyIndex++;
        that.tournament.secoundArmyIndex = that.tournament.firstArmyIndex + 1;
        if (that.tournament.secoundArmyIndex >= that.tournament.size) {
            that.tournament.runningTournament = false;
            return;
        }
	    }
	    that.srcIndices[0] = that.tournament.firstArmyIndex;
	    that.srcIndices[1] = that.tournament.secoundArmyIndex;
	    loadSources();
		};

		that.toggleSrc = function toggleSrc(srcInput) {
			var senderInd = srcInput.attributes['src-ind'].value;
			if (that.srcIndices[1] === senderInd) {
				that.srcIndices[1] = -1;
			} else if (that.srcIndices[0] === senderInd) {
				that.srcIndices[0] = -1;
			} else if (that.srcIndices[1] === -1) {
				that.srcIndices[1] = senderInd;
			} else if (that.srcIndices[0] === -1) {
				that.srcIndices[0] = senderInd;
			}
			that.htmlHelper.markSrcLines(that.srcIndices);
			that.playSound(that.selectSourceSound);
		};

		that.loadSources = function loadSources() {
			that.playSound(that.startRoundSound);
			that.htmlHelper.hideLoadSourcesPanel();
			that.htmlHelper.loadSource(that.srcIndices[0]);
			setTimeout(function() {
				that.htmlHelper.loadSource(that.srcIndices[1]);
				that.waitForArmies();
			}, 1000);
		};

		that.registerArmy = function registerArmy(data) {
			var army = new GolArmy(that.armies.length, data.name, data.icon, data.cb, that.settings.colorsRGB[that.armies.length], that.settings.powerMaxValue, 0);
			_dbg('registerArmy()');
			_log('army name: ' + data.name + ', icon: ' + data.icon);
			that.armies.push(army);
			_dbg('number of armies: ' + that.armies.length);
		};

		that.waitForArmies = function waitForArmies() {
			_dbg('waitForArmies()');
			if (that.armies.length < 2) {
				_log('waiting for armies...');
				setTimeout(that.waitForArmies, 500);
			} else {
				if (that.tournament && that.tournament.runningTournament) {
					that.tournament.rounds[that.armies[0].name + '-' + that.armies[1].name] = {};
				}
				if (that.settings.gameMode === that.settings.gameModes.EXTERNAL) {
					that.startRound();
				} else {
					that.showArmyVsArmyIntro();
				}
			}
		};

		that.showArmyVsArmyIntro = function showArmyVsArmyIntro() {
			that.htmlHelper.showArmyVsArmyPanel(that.armies);
			setTimeout(function() {
				that.playSound(that.armyVsArmySound);
			}, 1000);
			setTimeout(that.hideArmyVsArmyIntro, that.settings.millisArmyVsArmyMessageDuration);
		};

		that.hideArmyVsArmyIntro = function hideArmyVsArmyIntro() {
			that.playSound(that.startRoundSound);
			that.htmlHelper.hideArmyVsArmyPanel();
			setTimeout(that.startRound, 1000);
		};

		that.startRound = function startRound() {
			var i;
			_dbg('startRound()');
			that.playSound(that.startRoundSound);
			that.round++;
			for (i = 0; i < 2; i++) {
				that.armies[i].power = that.settings.powerMaxValue;
				that.armies[i].budget = that.settings.initialBudget;
			}
			that.board = new GolBoard();
			that.board.init(that.settings);
			that.newPixels = [[], []];
			that.newPixelsAge = [0, 0];
			that.generation = 0;
			if (that.round === 1) {
				that.htmlHelper.drawUserInterface(that.armies);
			}
			that.htmlHelper.updateArmyNamesAndWins(that.armies, that.roundWins);
			that.roundStartTime = (new Date()).getTime();
			that.secondsLeft = that.settings.secondsMaxRoundDuration;
			that.htmlHelper.updateTimeDisplay(that.secondsLeft);
			that.htmlHelper.clearExplosions();
			setTimeout(that.onGeneration, 0);
		};

		that.onGeneration = function onGeneration() {
			var curArray, nxtArray, newPixels, scoringPixelIndices, roundEnded;
			that.generation++;
			curArray = that.board.arrays[(that.generation % 2) * (-1) + 1];
			nxtArray = that.board.arrays[that.generation % 2];
			that.board.computeNextState(curArray, nxtArray);
			scoringPixelIndices = that.board.getScoringPixelIndices(nxtArray);
      		that.handleScore(scoringPixelIndices);
			that.updateTime();
			roundEnded = that.armies[0].power <= 0 || that.armies[1].power <= 0 || that.secondsLeft <= 0;
			newPixels = that.getNewPixels();
			that.newPixelsAge[0]++;
			that.newPixelsAge[1]++;
			that.board.placeNewPixelsOnBoard(nxtArray, newPixels);
			if (!roundEnded) {
				that.htmlHelper.drawArrayToCanvas(nxtArray, that.newPixels, that.newPixelsAge, scoringPixelIndices);
				that.board.deleteScoringPixels(nxtArray);
				setTimeout(that.onGeneration, 0);
				//requestAnimationFrame(that.onGeneration);
			} else {
				that.htmlHelper.drawArrayToCanvas(nxtArray, that.newPixels, that.newPixelsAge, scoringPixelIndices);
				setTimeout(that.endRound, that.settings.millisEndRoundBoardFreezeDuration);
			}
		};

		that.updateTime = function updateTime() {
			var millisPassed, secondsPassed, secondsLeft;
			millisPassed = (new Date()).getTime() - that.roundStartTime;
			secondsPassed = Math.floor(millisPassed / 1000);
			secondsLeft = Math.max(0, that.settings.secondsMaxRoundDuration - secondsPassed);
			if (secondsLeft !== that.secondsLeft) {
				that.secondsLeft = secondsLeft;
				that.htmlHelper.updateTimeDisplay(that.secondsLeft);
			}
			return secondsLeft;
		};

		that.endRound = function endRound() {
			var winnerIndex;
			_dbg('endRound()');
			that.playSound(that.endRoundSound);
			if (that.armies[0].power === that.armies[1].power) {
				_log('draw');
				that.htmlHelper.endRoundByDraw();
			} else {
				winnerIndex = (that.armies[0].power > that.armies[1].power) ? 0 : 1;
				_log(that.armies[winnerIndex].name + ' wins');
				that.lastWinner = that.armies[winnerIndex].name;
				that.roundWins[winnerIndex]++;
				that.htmlHelper.endRound(that.round, that.roundWins, that.armies, winnerIndex);
			}
			if (that.roundWins[0] < that.settings.winRoundLimit && that.roundWins[1] < that.settings.winRoundLimit) {
				setTimeout(that.restartRound, that.settings.millisEndRoundMessageDuration);
			} else {
				setTimeout(that.endGame, that.settings.millisEndRoundMessageDuration);
			}
		};

		that.restartRound = function restartRound() {
			that.round++;
			that.startRound();
		};

		that.endGame= function endGame() {
			var winnerIndex;
			_dbg('endGame()');
			that.playSound(that.endGameSound);
			winnerIndex = (that.armies[0].power > that.armies[1].power) ? 0 : 1;
			that.htmlHelper.endGame(that.armies, winnerIndex /*that.roundWins*/);
			if (that.tournament != null && that.tournament!=undefined && that.tournament.runningTournament) {
				that.tournament.rounds[that.armies[0].name + '-' + that.armies[1].name].winner = that.armies[winnerIndex].name;
			  that.tournament.rounds[that.armies[0].name + '-' + that.armies[1].name]['roundWins '+that.armies[0].name] = that.roundWins[0];
			  that.tournament.rounds[that.armies[0].name + '-' + that.armies[1].name]['roundWins ' + that.armies[1].name] = that.roundWins[1];
			  if (that.tournament[that.armies[winnerIndex].name] == null || that.tournament[that.armies[winnerIndex].name] == undefined) {
				  that.tournament[that.armies[winnerIndex].name] = 0;
			  }
			  that.tournament[that.armies[winnerIndex].name]++;
			  that.init(that.settings);
			  that.startGame(true);
			  that.startTournamentRound();
			}
		};

		that.getNewPixels = function getNewPixels() {
			var i, pixels, adjustedPixels;
			pixels = [[], []];
			adjustedPixels = [[], []];
			for (i = 0; i < 2; i++) {
				that.armies[i].budget += that.settings.budgetTickQuantum;
				pixels[i] = that.armies[i].cb(
					{
						generation: that.generation,
						cols: that.board.cols,
						rows: that.board.rows / 2,
						budget: that.armies[i].budget
					});
				if (that.armies[i].budget >= pixels[i].length) {
					that.armies[i].budget -= pixels[i].length;
				} else {
					_err('Budget exceeded. ArmyName: ' + that.armies[i].name);
					pixels[i] = [];
				}
				if (pixels[0].length > 0 || pixels[1].length > 0) {
					adjustedPixels = that.board.adjustNewPixels(pixels);
				}
			}
			for (i = 0; i < 2; i++) {
				if (adjustedPixels[i].length > 0) {
					that.newPixels[i] = adjustedPixels[i];
					that.newPixelsAge[i] = 0;
				}
			}
			return adjustedPixels;
		};

		that.playMusic = function playMusic(music) {
			var audio = new Audio(that.settings.remotePlatformLocationRawGit + '/music/' + music.file);
			audio.volume = music.volume;
			audio.loop = true;
			audio.play();
		};

		that.playSound = function playSound(sound) {
			var audio = new Audio(that.settings.remotePlatformLocationRawGit + '/sound/' + sound.file);
			audio.volume = sound.volume;
			audio.play();
		};

		that.handleScore = function handleScore(scoringPixelIndices) {
			var scoringPixelCount = [scoringPixelIndices[0].length, scoringPixelIndices[1].length];
			if (scoringPixelCount[0] !== 0 || scoringPixelCount[1] !== 0) {
				that.playSound(that.hitSounds[Math.floor(Math.random() * that.hitSounds.length)]);
				that.htmlHelper.shake();
				that.armies[1].power -= scoringPixelCount[0] * that.settings.powerHitQuantum;
				that.armies[0].power -= scoringPixelCount[1] * that.settings.powerHitQuantum;
				if (scoringPixelCount[0] !== 0) {
					_log(that.armies[0].name + ' scores');
				}
				if (scoringPixelCount[1] !== 0) {
					_log(that.armies[1].name + ' scores');
				}
			}
			that.armies[0].power = Math.max(that.armies[0].power, 0);
			that.armies[1].power = Math.max(that.armies[1].power, 0);
			that.htmlHelper.updateScore(that.armies[0].index, that.armies[0].power, scoringPixelCount[1]);
			that.htmlHelper.updateScore(that.armies[1].index, that.armies[1].power, scoringPixelCount[0]);
		};

	}

	var game = new GolGame();
	game.init(new GolSettings());

})();

