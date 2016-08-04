(function() {

    function GolGame() {

        var that = this;     

        that.init = function init(settings) {
            _dbg('init()');
            that.settings = settings;
            that.htmlHelper = new GolHtmlHelper();
            that.htmlHelper.init(settings);
            that.armies = [];
            that.round = 0;
            that.roundWins = [0, 0];
            that.lastWinner = '';
            that.hitSounds = [
                '335152_apenguin73_explosion-test.mp3', 
                '182429_qubodup_explosion.mp3', 
                '84521_destro-94_explosion-flangered.mp3', 
                '86026_harpoyume_explosion-3.mp3', 
                '95058_plamdi1_explosion.mp3'
            ];
            that.quietSound = '250712_aiwha_explosion.mp3';
            that.music = 'prelude_to_war.mp3';
            that.playSound(that.music);
            window.loadSources = that.loadSources;
            window.registerArmy = that.registerArmy;
            window.startGame = that.startGame;
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

        that.loadSources = function loadSources() {
            document.getElementById('load-src-panel').style.display = 'none';
            that.loadSource(0);
            setTimeout(function() {
                that.loadSource(1);
            }, 1000);
        };        

        that.registerArmy = function registerArmy(data) {
            var army = new GolArmy(that.armies.length, data.name, data.icon, data.cb, that.settings.colorsRGB[that.armies.length], that.settings.powerMaxValue, 0);
            _dbg('registerArmy()');
            _log('army name: ' + data.name + ', icon: ' + data.icon);
            that.armies.push(army);
            _dbg('number of armies: ' + that.armies.length);
        };

        that.startGame = function startGame() {
            _dbg('startGame()');
            if (that.armies.length < 2) {
                _log('waiting for armies...');
                setTimeout(that.startGame, 1000);
            } else {
                that.startRound();
            }
        };

        that.startRound = function startRound() {
            var i;
            _dbg('startRound()');
            that.playSound(that.quietSound);
            that.round++;
            for (i = 0; i < 2; i++) {
                that.armies[i].power = that.settings.powerMaxValue;
                that.armies[i].budget = 0;
            }
            that.board = new GolBoard();
            that.board.init(that.settings);
            that.newPixels = [[], []];
            that.newPixelsAge = [0, 0];
            that.generation = 0;
            if (that.round === 1) {
                that.htmlHelper.drawUserInterface(that.armies);
            }
            that.nextPowerReduction = (new Date()).getTime() + 1000;            
            setTimeout(that.onGeneration, 0); 
        }        

        that.onGeneration = function onGeneration() {
            var curArray, nxtArray, newPixels, scoringPixelCount, roundEnded;
            //_dbg('onGeneration()');
            that.generation++;
            curArray = that.board.arrays[(that.generation % 2) * (-1) + 1];
            nxtArray = that.board.arrays[that.generation % 2];
            that.board.computeNextState(curArray, nxtArray);
            scoringPixelCount = that.board.countScoringPixels(nxtArray);
            that.handleScore(scoringPixelCount);
            roundEnded = that.armies[0].power <= 0 || that.armies[1].power <= 0;
            newPixels = that.getNewPixels();
            that.newPixelsAge[0]++;
            that.newPixelsAge[1]++;
            that.board.placeNewPixelsOnBoard(nxtArray, newPixels);
            if (!roundEnded) {
                that.htmlHelper.drawArrayToCanvas(nxtArray, that.newPixels, that.newPixelsAge, scoringPixelCount, that.armies, roundEnded);
                that.board.deleteScoringPixels(nxtArray);
                setTimeout(that.onGeneration, 0);
            } else {
                that.htmlHelper.drawArrayToCanvas(nxtArray, that.newPixels, that.newPixelsAge, scoringPixelCount, that.armies, roundEnded);
                setTimeout(that.endRound, 3000);                
            }
        };

        that.endRound = function endRound() {
            var winnerIndex;
            _dbg('endRound()');
            that.playSound(that.quietSound);
            if (that.armies[0].power <= 0 && that.armies[1].power <= 0) {
                _log('draw');
            } else {
                winnerIndex = (that.armies[1].power <= 0) ? 0 : 1;
                _log(that.armies[winnerIndex].name + ' wins');
                that.lastWinner = that.armies[winnerIndex].name;
                that.roundWins[winnerIndex]++;
                that.htmlHelper.endRound(that.round, that.roundWins, that.armies, winnerIndex);
            }
            if (that.roundWins[0] < that.settings.winRoundLimit && that.roundWins[1] < that.settings.winRoundLimit) {
                setTimeout(function () {
                    that.round++;
                    that.startRound();
                }, that.settings.secondsBetweenGames * 1000);
            } else {
                that.endGame();    
            }
        };

        that.endGame= function endGame() {
            var winnerIndex;
            _dbg('endGame()');
            winnerIndex = (that.armies[1].power <= 0) ? 0 : 1;
            that.htmlHelper.endGame(that.armies, winnerIndex);
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
                    that.newPixelsAge[i] = 0;
                }
            }
            return adjustedPixels;
        };

        that.playSound = function playSound(soundPath) {
            (new Audio('https://rawgit.com/HpeAlgoComp/game-of-life/master/platform/sounds/' + soundPath)).play();
        };

        that.handleScore = function handleScore(scoringPixelsCount) {
            if ((new Date()).getTime() > that.nextPowerReduction) {
                that.armies[0].power -= that.settings.powerTimeQuantum;
                that.armies[1].power -= that.settings.powerTimeQuantum;
                that.nextPowerReduction = (new Date()).getTime() + 1000;
            }
            if (scoringPixelsCount[0] !== 0 || scoringPixelsCount[1] !== 0) {
                that.playSound(that.hitSounds[Math.floor(Math.random() * that.hitSounds.length)]);
                that.htmlHelper.shake();
                that.armies[1].power -= scoringPixelsCount[0] * that.settings.powerHitQuantum;
                that.armies[0].power -= scoringPixelsCount[1] * that.settings.powerHitQuantum;
                if (scoringPixelsCount[0] !== 0) {
                    _log(that.armies[0].name + ' scores');
                }
                if (scoringPixelsCount[1] !== 0) {
                    _log(that.armies[1].name + ' scores');
                }                
            }
            that.armies[0].power = Math.max(that.armies[0].power, 0);
            that.armies[1].power = Math.max(that.armies[1].power, 0);
            that.htmlHelper.updateScore(that.armies[0].index, that.armies[0].power, scoringPixelsCount[1]);
            that.htmlHelper.updateScore(that.armies[1].index, that.armies[1].power, scoringPixelsCount[0]);
        };        
        
    }

    var game = new GolGame();
	game.init(new GolSettings());
	
})();

