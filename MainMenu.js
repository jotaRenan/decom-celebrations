BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;
	this.selectCharButton = null;
	this.isAudioOn;
	this.isMusicOn;
};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)
		this.music = this.add.audio('menuSong');
		this.click = this.add.audio('btn-click');
		this.start();
		//this.music.fadeIn(800);
		this.add.sprite(0, 0, 'titlepage');

		//this.btnMusica = this.add.button();
		this.btnMusica = this.game.add.button(520,  170, 'btns', this.toggleSong, this, 0, 0, 0);
		if (!this.isMusicOn) {
			this.btnMusica.tint = 0xff0000;
		}
		this.btnAudio = this.game.add.button(550,  170, 'btns', this.toggleAudio, this, 2, 2, 2);
		if (!this.isAudioOn) {
			this.btnAudio.tint = 0xff0000;
		}
		//this.playButton = this.add.button(400, 600, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
		this.playSingleButton = this.add.button(175, 350, 'singleBtn', () => {this.startGame(false);}, this, 2, 1, 0);
		this.playMultiButton = this.add.button(175, 430, 'multiBtn', () => {this.startGame(true);}, this, 2, 1, 0);
		//this.selectCharButton = this.add.button(175, 480, 'cfgButton', this.selectChar, this, 2, 1, 0);
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	toggleSong: function() {
		if (!this.music.isPlaying) {
			this.music.play('', 0.4);
			this.btnMusica.tint = 0xffffff;
			this.isMusicOn = true;
		}
		else {
			this.music.stop();
			this.btnMusica.tint = 0xff0000;
			this.isMusicOn = false;
		}
	},

	toggleAudio: function() {
		if (this.isAudioOn) {
			this.isAudioOn = false;
			this.btnAudio.tint = 0xff0000;
			
		}
		else {
			this.isAudioOn = true;
			this.btnAudio.tint = 0xffffff;
		}
	},

	start: function() {
		//this.music.fadeIn(50, true);
		if (this.isMusicOn) {
			this.music.play( '', 0, 0.4, true);
			this.music.onLoop.add(this.playMusic, this);
		}
	},

	playMusic: function() {
		this.music.play('', 0, 0.4, true);
	},

	startGame: function (isMP) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		if (this.isAudioOn) {
			this.click.play();
		}
		if (this.music.isPlaying) {
			this.music.stop();
		}

		//	And start the actual game
		var jogoAIniciar = isMP ? 'GameMP' : 'GameSP';
		this.state.start( jogoAIniciar, true, false, this.isAudioOn, this.isMusicOn);
	

	},

	init: function(isAudioOn = true, isMusicOn = true) {
		this.isAudioOn = isAudioOn;
		this.isMusicOn = isMusicOn;
	},

	selectChar: function (pointer) {
		this.state.start('SelectChar');
	}

};
