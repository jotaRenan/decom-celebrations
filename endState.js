BasicGame.EndState = function (game) {
  this.background = null;
  this.music = null;
  this.playButton = null;
  this.selectCharButton = null;
  this.isAudioOn = true;
  this.isMusicOn = true;
};

BasicGame.EndState.prototype = {

  init: function() {},

  preload: function() {
    this.background = this.add.sprite(0, 0, 'endBG');
    this.na
    this.music = this.add.audio('winSong');

  },

  create: function() {
    if (this.isMusicOn) {
      this.music.play();
    }
  },

  update: function() {}

};