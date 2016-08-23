(function() {

    function GolGame() {

        var that = this;     

        that.init = function init(settings) {
            var i, m;
            _dbg('init()');
            that.settings = settings;
            that.htmlHelper = new GolHtmlHelper();
            that.htmlHelper.init(settings);
            that.armies = [];
            that.round = 0;
            that.roundWins = [0, 0];
            that.lastWinner = '';
            that.hitSounds = [];
            for (i = 1; i <= 9; i++) {
                that.hitSounds.push('explosion' + i + '.mp3');
            }
            that.quietSound = 'explosion1.mp3';
            that.musicFiles = [
                'terminator_genisys.mp3',
                'dark_knight_rises.mp3',
                'wonder_woman.mp3',                
                'its_our_fight.mp3',
                'starship_troopers.mp3',                
                'fury_road.mp3',
                'prelude_to_war.mp3'
            ];
            m = (localStorage.getItem('game-of-life-music-index') || 0) % that.musicFiles.length;
            that.music = that.musicFiles[m];
            that.playMusic(that.music);
            m = (m + 1) % that.musicFiles.length;
            localStorage.setItem('game-of-life-music-index', m);
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
            that.nextPowerReduction = (new Date()).getTime() + that.settings.millisBetweenPowerTimeReductions;            
            //setTimeout(that.onGeneration, 0);
            requestAnimationFrame(that.onGeneration);
        };

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
                //setTimeout(that.onGeneration, 0);
                requestAnimationFrame(that.onGeneration);
            } else {
                that.htmlHelper.drawArrayToCanvas(nxtArray, that.newPixels, that.newPixelsAge, scoringPixelCount, that.armies, roundEnded);
                setTimeout(that.endRound, that.settings.millisEndRoundBoardFreeze);                
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
                setTimeout(that.restartRound, that.settings.millisEndRoundMessageTime);  
            } else {
                setTimeout(that.endGame, that.settings.millisEndRoundMessageTime);    
            }
        };

        that.restartRound = function restartRound() {
            that.round++;
            that.startRound();            
        };

        that.endGame= function endGame() {
            var winnerIndex;
            _dbg('endGame()');
            that.playSound(that.quietSound);
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

        that.playMusic = function playMusic(musicFile) {
            var audio = (new Audio('https://rawgit.com/HpeAlgoComp/game-of-life/master/platform/music/' + musicFile));
            audio.loop = true;
            audio.play();
        };

        that.playSound = function playSound(soundFile) {
            (new Audio('https://rawgit.com/HpeAlgoComp/game-of-life/master/platform/sounds/' + soundFile)).play();
        };

        that.handleScore = function handleScore(scoringPixelsCount) {
            if ((new Date()).getTime() > that.nextPowerReduction) {
                that.armies[0].power -= that.settings.powerTimeQuantum;
                that.armies[1].power -= that.settings.powerTimeQuantum;
                that.nextPowerReduction = (new Date()).getTime() + that.settings.millisBetweenPowerTimeReductions;
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

