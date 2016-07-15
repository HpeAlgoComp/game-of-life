function GolPlatform() {

	var i elm;

	var PREFIX ='https://rawgit.com/HpeAlgoComp/game-of-life/master/';

	var sources = [
		'gol-funcs.js',
		'gol-html-helper.js',
		'gol-settings.js',
		'gol-army.js',
		'gol-board.js',
		'gol-game.js'		
	];

	for (i = 0; i < sources.length; i++) {
		elm = document.createElement('script');
		elm.src = PREFIX + sources[i];
		document.getElementsByTagName('head')[0].appendChild(elm);
	}

}();