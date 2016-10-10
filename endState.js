BasicGame.EndState = function (game) {
  this.background = null;
  this.music = null;
  this.playButton = null;
  this.selectCharButton = null;
  this.isAudioOn = true;
  this.isMusicOn = true;
  this.score = null;
  this.btnRank = null;
  this.btnMenu = null;
  this.textoScore = null;
};

BasicGame.EndState.prototype = {

  init: function(score) {
    this.score = score;
  },

  preload: function() {
    this.background = this.add.sprite(0, 0, 'endBG');
    this.music = this.add.audio('winSong');
    
  },

  create: function() {
    if (this.isMusicOn) {
      this.music.play('', 0, 0.4);
    }

    this.textoScore = this.game.add.text(250, 200);
    this.textoScore.font = 'Arial Black';
    this.textoScore.fontSize = 80;
    this.textoScore.fontWeight = 'bold';
    this.textoScore.stroke = '#000000';
    this.textoScore.strokeThickness = 6;
    this.textoScore.fill = '#43d637';
    this.textoScore.fixedToCamera = true;
    this.textoScore.text = `${this.score}s`;

    this.btnRank =  this.add.button(200, 400, 'rankButton', this.exibirRank , this, 2, 1, 0);
    this.btnMenu =  this.add.button(400, 400, 'menuButton', this.irMenu, this, 2, 1, 0);

    if (localStorage.getItem('score') === null ) {
      scores = [];
      scores[0] = this.score;
      localStorage.setItem('score', JSON.stringify(scores));
    } 
    else {
      let pontuacoes = JSON.parse(localStorage.getItem('score')),
          tamanho = pontuacoes.length;
      if (this.score < pontuacoes[tamanho-1]) {
        if (tamanho < 5) {
          pontuacoes.push(this.score);
        }
        else {
          pontuacoes[4] = this.score;
        } 
        pontuacoes.sort();
        localStorage.setItem('score', JSON.stringify(pontuacoes));
      }
      else {
        if (tamanho < 5) {
          pontuacoes.push(this.score);
          pontuacoes.sort();
          localStorage.setItem('score', JSON.stringify(pontuacoes));
        }
      }
    }


  },

  exibirRank: function() {
    //Precisa destruir isso, so q n funfa
    this.textoScore.destroy();
    let pontuacoes = JSON.parse(localStorage.getItem('score')),
        tamanho = pontuacoes.length,
        textos = Array(tamanho);

    for (let i=0; i<tamanho; i++) {
      textos[i] = this.game.add.text(250, 100+ (49*i));
      textos[i].font = 'Arial Black';
      textos[i].fontSize = 45;
      textos[i].fontWeight = 'bold';
      textos[i].stroke = '#000000';
      textos[i].strokeThickness = 4;
      textos[i].fill = '#43d637';
      textos[i].fixedToCamera = true;
      textos[i].text = `${i+1} -  ${pontuacoes[i]}s`;
    }
  },

  irMenu: function() {
    this.music.stop();
    this.state.start('MainMenu');
  },

  update: function() {}

};