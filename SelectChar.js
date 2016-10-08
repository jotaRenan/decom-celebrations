BasicGame.SelectChar = function (game) {

};

BasicGame.SelectChar.prototype = {

  create: function () {

    //  We've already preloaded our assets, so let's kick right into the Main Menu itself.
    //  Here all we're doing is playing some music and adding a picture and button
    //  Naturally I expect you to do something significantly better :)
    console.log("entrou selectChar");
    //this.music = this.add.audio('titleMusic');
    //this.music.play();

    this.add.sprite(0, 0, 'titlepage');

    //this.playButton = this.add.button(400, 600, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');
    this.playButton = this.add.button(this.world.centerX, 400, 'playButton', this.voltarMenu, this, 2, 1, 0);

  },

  voltarMenu: function() {
    this.state.start('MainMenu');
  }

}