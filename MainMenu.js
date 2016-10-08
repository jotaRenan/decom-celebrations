BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;
	this.selectCharButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)
		console.log("entrou mainMenu");
		//this.music = this.add.audio('titleMusic');
		//this.music.play();

		this.add.sprite(0, 0, 'titlepage');

		//this.playButton = this.add.button(400, 600, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
		this.playButton = this.add.button(this.world.centerX -225, 320, 'singleBtn', function() {this.startGame(false)}, this, 2, 1, 0);
		this.cfgButton = this.add.button(this.world.centerX -225, 400, 'multiBtn', function() {this.startGame(true);}, this, 2, 1, 0);
		this.selectCharButton = this.add.button(this.world.centerX - 225, 480, 'cfgButton', this.selectChar, this, 2, 1, 0);
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();
		console.log("entrou startGame");
		//	And start the actual game
		this.state.start('Game', true, false, pointer);

	},


	selectChar: function (pointer) {
		this.state.start('SelectChar');
	}

};
