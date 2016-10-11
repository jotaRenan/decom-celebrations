BasicGame.EndState = function (game) {
  this.background = null;
  this.music = null;
  this.playButton = null;
  this.selectCharButton = null;
  this.isAudioOn = null;
  this.isMusicOn = null;
  this.score = null;
  this.btnRank = null;
  this.btnMenu = null;
  this.textoScore = null;
  this.endOfGameMsg = null;
  this.click = null;
};

BasicGame.EndState.prototype = {

  init: function(score, isAudioOn, isMusicOn) {
    this.score = score;
    this.isAudioOn = isAudioOn;
    this.isMusicOn = isMusicOn;
  },

  preload: function() {
    this.background = this.add.sprite(0, 0, 'endBG');
    this.music = this.add.audio('winSong');
    this.click = this.add.audio('btn-click');
  },

  create: function() {
    if (this.isMusicOn) {
      this.music.play('', 0, 0.4);
    }

    this.endOfGameMsg = this.game.add.text(210, 130);
    this.endOfGameMsg.text = 'Fim de Jogo! \nSeu tempo foi:';
    this.endOfGameMsg.align = 'center';
    this.endOfGameMsg.lineSpacing = -10;
    this.endOfGameMsg.font = 'Arial Black';
    this.endOfGameMsg.fontSize = 45;
    this.endOfGameMsg.fontWeight = 'bold';
    this.endOfGameMsg.stroke = '#000000';
    this.endOfGameMsg.strokeThickness = 4;
    this.endOfGameMsg.fill = 'tomato';
    this.endOfGameMsg.fixedToCamera = true;

    this.textoScore = this.game.add.text(250, 235);
    this.textoScore.font = 'Arial Black';
    this.textoScore.fontSize = 80;
    this.textoScore.fontWeight = 'bold';
    this.textoScore.stroke = '#000000';
    this.textoScore.strokeThickness = 6;
    this.textoScore.fill = '#43d637';
    this.textoScore.fixedToCamera = true;
    this.textoScore.text = `${this.score}s`;

    this.btnRank =  this.add.button(240, 400, 'rankButton', this.exibirRank , this, 2, 1, 0);
    this.btnMenu =  this.add.button(420, 400, 'menuButton', this.irMenu, this, 2, 1, 0);
    console.log(localStorage.getItem('data'));
    if (localStorage.getItem('data') === null) {
      localStorage.setItem('data', JSON.stringify(new Date()));
      localStorage.removeItem('score');
    }

    if (localStorage.getItem('score') === null ) {
      scores = [];
      scores[0] = this.score;
      localStorage.setItem('score', JSON.stringify(scores));
    } 
    else {
      let pontuacoes = JSON.parse(localStorage.getItem('score')),
          tamanho = pontuacoes.length;
      if (this.score < parseFloat(pontuacoes[tamanho-1])) {
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
        if (tamanho < 4) {
          pontuacoes.push(this.score);
          pontuacoes.sort();
          localStorage.setItem('score', JSON.stringify(pontuacoes));
        }
      }
    }


  },

  exibirRank: function() {
    this.textoScore.destroy();
    this.endOfGameMsg.destroy();
    if (this.isAudioOn) {
      this.click.play();
    }
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
    if (this.isAudioOn) {
      this.click.play();
    }
    this.state.start('MainMenu', true, false, this.isAudioOn, this.isMusicOn);
  },

  update: function() {}

};