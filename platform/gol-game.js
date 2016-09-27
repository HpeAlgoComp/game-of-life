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
			that.allArmies=[];
			that.gameMode = settings.gameModes.AUTO_START;
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
			window.startGame = that.startGame;
			window.startSingleGame = that.startSingleGame;						
			window.startStrategyDemo = that.startStrategyDemo;
			window.startAllVsAll = that.startAllVsAll;
			window.registerArmy = that.registerArmy;
			window.toggleSrc = that.toggleSrc;
			window.loadSources = that.loadSources;
			window.loadDemo = that.loadDemo;
			window.loadAll = that.loadAll;
		};

		that.startMusic = function startMusic() {
			var m = (localStorage.getItem('game-of-life-music-index') || 0) % that.musicFiles.length;
			that.music = that.musicFiles[m];
			that.playMusic(that.music);
			m = (m + 1) % that.musicFiles.length;
			localStorage.setItem('game-of-life-music-index', m);
		};

		that.startGame = function startGame() {
			_dbg('startGame()');
			that.settings.gameMode = that.settings.gameModes.AUTO_START;
			that.startMusic();
			that.waitForArmies();
		};

		that.startSingleGame = function startSingleGame() {
			_dbg('startSingleGame()');
			that.settings.gameMode = that.settings.gameModes.SINGLE_GAME;
			that.htmlHelper.fadeInLoadSourcesPanel();
			that.htmlHelper.markSrcLines(that.srcIndices);
			that.startMusic();
		};

		that.startAllVsAll = function startAllVsAll() {
			_dbg('startAllVsAll()');
			that.settings.gameMode = that.settings.gameModes.ALL_VS_ALL;
			that.htmlHelper.fadeInLoadSourcesPanel();
			that.htmlHelper.markSrcLines(that.srcIndices);
		};

		that.startTournament = function startTournament() {
		_dbg('startTournament()');
		that.settings.gameMode = that.settings.gameModes.ALL_VS_ALL;
		var prevTournament= localStorage.getItem("TournamentRoundResualt");
	    that.tournament = {};
	    that.tournament.size = that.srcIndices.length;
	    that.tournament.size = 16;
	    if (that.tournament.size > 2) {
		    that.tournament.rounds = {};
		    that.tournament.runningTournament = true;
		    that.tournament.firstArmyIndex = 0;
		    that.tournament.secoundArmyIndex = 0;
		    if (prevTournament != null && prevTournament != undefined) that.tournament = JSON.parse(prevTournament);
		    that.startTournamentRound();
	    }
		};

		that.startStrategyDemo = function startStrategyDemo() {
			_dbg('startStrategyDemo()');
			that.settings.gameMode = that.settings.gameModes.STRATEGY_DEMO;
			that.htmlHelper.fadeInLoadSourcesPanel();
			that.htmlHelper.markSrcLines(that.srcIndices);
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

		that.loadDemo = function loadDemo(armyIndex) {
			that.playSound(that.startRoundSound);
			that.htmlHelper.hideLoadSourcesPanel();
			if (armyIndex === 0) {
				that.htmlHelper.loadSource(that.srcIndices[1]);
				setTimeout(function() {
					that.registerDummyArmy();
				}, 2000);
			} else {
				that.registerDummyArmy();
				that.htmlHelper.loadSource(that.srcIndices[1]);
			}
			setTimeout(function() {
				that.waitForArmies();
			}, 1000);
		};

		that.loadAll = function loadAll() {
			var i;
			that.playSound(that.startRoundSound);
			that.htmlHelper.hideLoadSourcesPanel();
			window.registerArmy = that.registerArmyForAllVsAll;
			for (i = 0; i < 16; i++) {
				that.htmlHelper.loadSource(i);	
			}
			setTimeout(function() {
				that.waitForAllArmies();
			}, 1000);
		};

		that.registerDummyArmy = function registerDummyArmy() {
			that.registerArmy({
				name: '',
				icon: '',
				cb: function() {
					return [];
				}
			});
		};

		that.registerArmy = function registerArmy(data) {
			var army;
			_dbg('registerArmy()');
			_log('army name: ' + data.name + ', icon: ' + data.icon);
			army = new GolArmy(that.armies.length, data.name, data.icon, data.cb, that.settings.colorsRGB[that.armies.length], that.settings.powerMaxValue, 0);
			that.armies.push(army);
			_dbg('number of armies: ' + that.armies.length);
		};

		that.registerArmyForAllVsAll = function registerArmyForAllVsAll(data) {
			var army;
			_dbg('registerArmyForAllVsAll()');
			_log('army name: ' + data.name + ', icon: ' + data.icon);
			army = new GolArmy(-1, data.name, data.icon, data.cb, null, that.settings.powerMaxValue, 0);
			that.allArmies.push(army);
			_dbg('number of armies: ' + that.allArmies.length);
		};

		that.waitForArmies = function waitForArmies() {
			var expectedNumberOfArmies;
			_dbg('waitForArmies()');
			expectedNumberOfArmies = 2;			
			if (that.armies.length < expectedNumberOfArmies) {
				_log('waiting for armies...');
				setTimeout(that.waitForArmies, 500);
			} else {
				if (that.settings.gameMode === that.settings.gameModes.AUTO_START) {
					that.startRound();
				} else if (that.settings.gameMode === that.settings.gameModes.SINGLE_GAME) {
					that.showArmyVsArmyIntro();
				} else if (that.settings.gameMode === that.settings.gameModes.STRATEGY_DEMO) {
					that.prepareForStrategyDemo();
				}				
			}
		};

		that.waitForAllArmies = function waitForArmies() {
			var expectedNumberOfArmies;
			_dbg('waitForArmies()');
			expectedNumberOfArmies = 16;			
			if (that.allArmies.length < expectedNumberOfArmies) {
				_log('waiting for all armies...');
				setTimeout(that.waitForAllArmies, 500);
			} else {
				that.startAllVsAllRound();
			}
		};

		that.startAllVsAllRound = function startAllVsAllRound() {
			var i, indices = [];
			_dbg('startAllVsAllRound()');
			that.htmlHelper.hidePreGameContainer();
			indices[0] = Math.floor(Math.random()* 16);
			do {
				indices[1] = Math.floor(Math.random()* 16);	
			} while (indices[0] === indices[1]);
			for (i = 0; i < 2; i++) {
				that.armies[i] = that.allArmies[indices[i]];
				that.armies[i].index = i;
				that.armies[i].color = that.settings.colorsRGB[i];
			}
			that.round = 0;
			that.roundWins = [0, 0];
			that.lastWinner = '';
			setTimeout(that.startRound, 1000);
		};

		that.prepareForStrategyDemo = function prepareForStrategyDemo() {
			that.htmlHelper.hidePreGameContainer();
			that.settings.powerHitQuantum = 0;
			that.settings.secondsMaxRoundDuration = 3600;
			that.startRound();
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
			that.htmlHelper.hidePreGameContainer();
			setTimeout(that.startRound, 1000);
		};

		that.startRound = function startRound() {
			var i, realArmyIndex;
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
				if (that.settings.gameMode === that.settings.gameModes.STRATEGY_DEMO) {
					realArmyIndex = (that.armies[0].name ? 0 : 1);
					that.htmlHelper.prepareForStrategyDemo(realArmyIndex);
				}
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
			if (that.settings.gameMode !== that.settings.gameModes.ALL_VS_ALL) {
				if (that.roundWins[0] < that.settings.winRoundLimit && that.roundWins[1] < that.settings.winRoundLimit) {
					setTimeout(that.restartRound, that.settings.millisEndRoundMessageDuration);
				} else {
					setTimeout(that.endGame, that.settings.millisEndRoundMessageDuration);
				}
			} else {
				that.endRoundAllVsAll();	
			}
		};

		that.restartRound = function restartRound() {
			that.round++;
			that.startRound();
		};

		that.endRoundAllVsAll = function endRoundAllVsAll() {
			var storageKey, statsStorageStr, stats, i, item, winnerIndex, loserIndex;
			_dbg('endRoundAllVsAll()');
			storageKey = that.settings.statsLocalStorageKey;
			statsStorageStr = localStorage.getItem(storageKey);
			if (statsStorageStr) {
				stats = JSON.parse(statsStorageStr);
			} else {
				stats = {
					total: {
						r: 0,
						d: 0
					},
					armies: {},
					draws: []
				};
				for (i = 0; i < that.allArmies.length; i++) {
					stats.armies[that.allArmies[i].icon] = {
						r: 0,
						w: 0,
						l: 0,
						d: 0
					};
				}
			}
			stats.total.r++;
			if (that.armies[0].power === that.armies[1].power) {
				stats.total.d++;
				item = stats.armies[that.armies[0].icon];
				item.r++;
				item.d++;
				item = stats.armies[that.armies[1].icon];
				item.r++;
				item.d++;
				stats.draws.push(that.armies[0].icon + ':' + that.armies[1].icon);
			} else {
				winnerIndex = (that.armies[0].power > that.armies[1].power) ? 0 : 1;
				loserIndex = winnerIndex * -1 + 1;
				item = stats.armies[that.armies[winnerIndex].icon];
				item.r++;
				item.w++;
				item = stats.armies[that.armies[loserIndex].icon];
				item.r++;
				item.l++;
			}
			localStorage.setItem(storageKey, JSON.stringify(stats));
			setTimeout(that.restartRoundAllVsAll, that.settings.millisEndRoundMessageDuration);			
		};		

		that.restartRoundAllVsAll = function restartRoundAllVsAll() {
			that.startAllVsAllRound();
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
			return audio;
		};

		that.playSound = function playSound(sound) {
			var audio = new Audio(that.settings.remotePlatformLocationRawGit + '/sound/' + sound.file);
			audio.volume = sound.volume;
			audio.play();
		};

		that.handleScore = function handleScore(scoringPixelIndices) {
			var scoringPixelCount = [scoringPixelIndices[0].length, scoringPixelIndices[1].length];
			if (scoringPixelCount[0] !== 0 || scoringPixelCount[1] !== 0) {
				if (that.settings.gameMode !== that.settings.gameModes.STRATEGY_DEMO) {
					that.playSound(that.hitSounds[Math.floor(Math.random() * that.hitSounds.length)]);
					that.htmlHelper.shake();
				}
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

