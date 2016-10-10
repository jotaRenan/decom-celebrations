BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;
	this.selectCharButton = null;
	this.isAudioOn = true;
	this.isMusicOn = true;
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
		this.btnMusica = this.game.add.button(700,  100, 'btns', this.toggleSong, this, 0, 0, 0);
		this.btnAudio = this.game.add.button(730,  100, 'btns', this.toggleAudio, this, 2, 2, 2);

		//this.playButton = this.add.button(400, 600, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
		this.playSingleButton = this.add.button(175, 320, 'singleBtn', () => {this.click.play(); this.startGame(false, this.isAudioOn, this.isMusicOn);}, this, 2, 1, 0);
		this.playMultiButton = this.add.button(175, 400, 'multiBtn', () => {this.click.play(); this.startGame(true, this.isAudioOn, this.isMusicOn);}, this, 2, 1, 0);
		this.selectCharButton = this.add.button(175, 480, 'cfgButton', this.selectChar, this, 2, 1, 0);
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	toggleSong: function() {
		
		this.music.isPlaying ? this.music.stop() : this.music.play();
		this.isMusicOn = !this.isMusicOn;
		this.btnMusica.frame = 1;
	},

	toggleAudio: function() {
		this.isAudioOn = !this.isAudioOn;
		this.btnAudio.frame = 3;
	},

	start: function() {
		//this.music.fadeIn(50, true);
		this.music.play( '', 0, 0.4, true);
		this.music.onLoop.add(this.playMusic, this);
	},

	playMusic: function() {
		this.music.play('', 0, 0.4, true);
	},

	startGame: function (pointer, isAudioOn, isMusicOn) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		if (this.isAudioOn) {
			this.click.play();
		}
		if (this.music.isPlaying) {
			this.music.stop();
		}

		//	And start the actual game
		this.state.start('Game', true, false, pointer, isAudioOn, isMusicOn);

	},


	selectChar: function (pointer) {
		this.state.start('SelectChar');
	}

};
