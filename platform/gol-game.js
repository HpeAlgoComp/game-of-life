(function() {

    function GolGame() {

        var that = this;
        that.round = 0;
        that.winners = {};
        that.lastWinner = "";

        that.init = function init(settings) {
            _dbg('init()');
            that.firstGame = true;
            that.settings = settings;
            that.htmlHelper = new GolHtmlHelper();
            that.htmlHelper.init(settings);
            that.armies = [];
            window.loadSources = that.loadSources;
            window.registerArmy = that.registerArmy;
            window.startGame = that.startGame;
        };

        that.loadSources = function loadSources() {
            document.getElementById('load-src-panel').style.display = 'none';
            that.loadSource(0);
            setTimeout(function() {
                that.loadSource(1);
            }, 1000);
        };

        that.loadSource = function loadSource(i) {
            var srcText, srcElm;
            srcText = document.getElementById('src-' + i).value;
            _log('loading source: ' + srcText);
            if (srcText) {
                srcElm = document.createElement('script');
                srcElm.setAttribute('type', 'text/javascript');
                srcElm.setAttribute('src', srcText);
                document.getElementsByTagName('head')[0].appendChild(srcElm);
            }
        };

        that.registerArmy = function registerArmy(data) {
            var army = new GolArmy(that.armies.length, data.name, data.icon, data.cb, that.settings.colorsRGB[that.armies.length], that.settings.powerMaxValue, 0);
            _dbg('registerArmy()');
            _log('army name: ' + data.name + ', icon: ' + data.icon);
            that.armies.push(army);
            _dbg('number of armies: ' + that.armies.length);
        };

        that.startGame = function startGame() {
            var i;
            _dbg('startGame()');
            if (that.armies.length < 2) {
                _log('waiting for armies...');
                setTimeout(that.startGame, 1000);
            } else {
                for (i = 0; i < 2; i++) {
                    that.armies[i].power = that.settings.powerMaxValue;
                    that.armies[i].budget = 0;
                }
                that.board = new GolBoard();
                that.board.init(that.settings);
                that.newPixels = [[], []];
                that.newPixelsAge = [0, 0];
                that.generation = 0;
                if (that.firstGame) {
                    that.htmlHelper.drawUserInterface(that.armies);
                }
                if (that.firstGame) {
                    that.nextPowerReduction = (new Date()).getTime() + 1000;
                    setTimeout(that.onGeneration, 0);
                } else {
                    that.CheckReachWinRoundLimit(that.onGeneration);
                }
            }
        };

        that.CheckReachWinRoundLimit = function(startNextRound) {
            that.nextPowerReduction = (new Date()).getTime() + that.settings.secondsBetweenGames * 1000;
            setTimeout(function () {
                if (that.winners[that.lastWinner] >= that.settings.winRoundLimit) that.htmlHelper.endAllRounds(that.lastWinner);
                else startNextRound();
            }, that.settings.secondsBetweenGames * 1000);
        };

        that.onGeneration = function onGeneration() {
            var curArray, nxtArray, newPixels, scoringPixelCount, gameEnded;
            //_dbg('onGeneration()');
            that.generation++;
            curArray = that.board.arrays[(that.generation % 2) * (-1) + 1];
            nxtArray = that.board.arrays[that.generation % 2];
            that.board.computeNextState(curArray, nxtArray);
            scoringPixelCount = that.board.countScoringPixels(nxtArray);
            that.handleScore(scoringPixelCount);
            gameEnded = that.armies[0].power <= 0 || that.armies[1].power <= 0;
            newPixels = that.getNewPixels();
            that.board.placeNewPixelsOnBoard(nxtArray, newPixels);
            if (!gameEnded) {
                that.htmlHelper.drawArrayToCanvas(nxtArray, that.newPixels, that.newPixelsAge, scoringPixelCount, that.armies, gameEnded);
                that.board.deleteScoringPixels(nxtArray);
                setTimeout(that.onGeneration, 0);
            } else {
                that.htmlHelper.drawArrayToCanvas(nxtArray, that.newPixels, that.newPixelsAge, scoringPixelCount, that.armies, gameEnded);
                that.endGame();
                that.firstGame = false;
                that.startGame();
            }
        };

        that.getNewPixels = function getNewPixels() {
            var i, pixels, adjustedPixels;
            pixels = [];
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
            }
            if (pixels[0].length > 0 || pixels[1].length > 0) {
                adjustedPixels = that.board.adjustNewPixels(pixels);
            }
            for (i = 0; i < 2; i++) {
                if (adjustedPixels[i].length > 0) {
                    that.newPixels[i] = adjustedPixels[i];
                    that.newPixelsAge[i] = 1;
                } else {
                    that.newPixelsAge[i]++;
                }
            }
            return adjustedPixels;
        };

        that.handleScore = function handleScore(scoringPixelsCount) {
            if ((new Date()).getTime() > that.nextPowerReduction) {
                that.armies[0].power -= that.settings.powerTimeQuantum;
                that.armies[1].power -= that.settings.powerTimeQuantum;
                that.nextPowerReduction = (new Date()).getTime() + 1000;
            }
            if (scoringPixelsCount[0] !== 0 || scoringPixelsCount[1] !== 0) {
                that.armies[1].power -= scoringPixelsCount[0] * that.settings.powerPixelQuantum;
                that.armies[0].power -= scoringPixelsCount[1] * that.settings.powerPixelQuantum;
                if (scoringPixelsCount[0] !== 0) {
                    _log(that.armies[0].name + ' scores');
                    that.playHitSound(scoringPixelsCount[0]);
                }
                if (scoringPixelsCount[1] !== 0) {
                    _log(that.armies[1].name + ' scores');
                    that.playHitSound(scoringPixelsCount[1]);
                }
            }
            that.armies[0].power = Math.max(that.armies[0].power, 0);
            that.armies[1].power = Math.max(that.armies[1].power, 0);
            that.htmlHelper.updateScore(that.armies[0].index, that.armies[0].power, scoringPixelsCount[1]);
            that.htmlHelper.updateScore(that.armies[1].index, that.armies[1].power, scoringPixelsCount[0]);
        };

        that.endGame = function endGame() {
            if (that.armies[0].power <= 0 && that.armies[1].power <= 0) {
                _log('draw');
            } else if (that.armies[1].power <= 0) {
                _log(that.armies[0].name + ' wins');
                that.registerResualt(that.armies[0].name);
                that.htmlHelper.endGame(that.round, that.armies[0].name, that.armies[0].color, that.winners[that.armies[0].name]);
            } else if (that.armies[0].power <= 0) {
                _log(that.armies[1].name + ' wins');
                that.registerResualt(that.armies[1].name);
                that.htmlHelper.endGame(that.round, that.armies[1].name, that.armies[1].color, that.winners[that.armies[1].name]);
            }
        };

        that.registerResualt = function registerResualt(winName) {
            if (that.winners[winName] == undefined || that.winners[winName] == null) that.winners[winName] = 0;
            that.winners[winName] = that.winners[winName] + 1;

            that.round = that.round + 1;
            that.lastWinner = winName;
        };

        that.SoundArr = ['punch_or_whack_-Vladimir-403040765.mp3', '335152_apenguin73_explosion-test.mp3', '250712_aiwha_explosion.mp3', '182429_qubodup_explosion.mp3', '84521_destro-94_explosion-flangered.mp3', '86026_harpoyume_explosion-3.mp3', '95058_plamdi1_explosion.mp3', '156031__iwiploppenisse__explosion.mp3'];
        that.ShakeArr = ['shake', 'shake-little', 'shake-horizontal', 'shake-rotate'];
        that.playHitSound = function(hits) {
            var i = Math.floor(Math.random() * (that.SoundArr.length - 1));
            var j = Math.floor(Math.random() * (that.ShakeArr.length - 1));
            var audio = new Audio('platform/sounds/' + that.SoundArr[i]);
            audio.play();
            document.getElementById("gol-canvas").className = that.ShakeArr[j] + " shake-constant";
            setTimeout(function () {
                document.getElementById("gol-canvas").className = "";
            }, 1000);
        };
    }

    var game = new GolGame();
	game.init(new GolSettings());
	
})();

