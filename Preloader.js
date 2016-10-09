
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
		this.load.image('titlepage', 'starstruck/bgDecom.png');
		//this.load.image('playButton', 'starstruck/button_texture_atlas.png');
		this.load.atlas('singleBtn', 'starstruck/btn_single.png', 'starstruck/btn_single.json');
		this.load.atlas('multiBtn', 'starstruck/btn_multi.png', 'starstruck/btn_single.json');
		this.load.atlas('cfgButton', 'starstruck/btn_cfg.png', 'starstruck/btn_single.json');
		//this.load.audio('titleMusic', ['audio/main_menu.mp3']);
		//this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		//	+ lots of other required assets here
		this.load.tilemap('level1', 'starstruck/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles-1', 'starstruck/teste.png');
    this.load.spritesheet('dude', 'starstruck/dude.png', 32, 48);
    this.load.spritesheet('dudeInv', 'starstruck/cefetoso.png', 32, 48);
    this.load.spritesheet('droid', 'starstruck/droid.png', 32, 32);
    this.load.image('starSmall', 'starstruck/star.png');
    this.load.image('starBig', 'starstruck/star2.png');
    this.load.image('background', 'starstruck/26.jpg');
    this.load.image('cafe', 'starstruck/coffe.png');
    this.load.image('computador', 'starstruck/computer.png');
    this.load.image('pinguim', 'starstruck/pinguim.png');
    this.load.image('som', 'starstruck/som.png');
    this.load.image('roteador', 'starstruck/router.png');
    this.load.image('pgBar1', 'starstruck/progress_bar.png');
  	//this.load.image('star', 'start/star.png');
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.

		if (this.ready == false) {
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
