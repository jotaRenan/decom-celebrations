
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    this.map;
    this.tileset;
    this.layer;
    this.player;

    this.p1facing = 'idle';
    this.p2facing = 'idle';
    this.p1jumpTimer = 0;
    this.p2jumpTimer = 0;
    this.cursors;
    this.bg;
    this.stars;
    this.score = 0;
    //Minhas var
    this.isMP;
    this.player2;
    this.medianX;
    this.medianY;
    this.worldScale = 1;
    this.textoTempo;
    this.listaObjetos;
    this.distanciaColetados;
    this.somColeta;
    this.music = null;
    this.isAudioOn;
    this.isMusicOn;
  };

BasicGame.Game.prototype = {

  init: function(isMultiPlayer, isAudioOn, isMusicOn, dificuldade) {
    this.isMP = isMultiPlayer;
    this.isAudioOn = isAudioOn;
    this.isMusicOn = isMusicOn;
    this.dif = dificuldade;
  },

  create: function () {
    console.log('entrou game');
    this.distanciaColetados = 1;
    //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.stage.backgroundColor = '#000000';

    bg = this.add.tileSprite(-100, 0, 900, 600, 'background');
    bg.fixedToCamera = true;
    bg.tilePosition.x = -(this.camera.x * 0.7);

    map = this.add.tilemap('level1');
    map.addTilesetImage('tiles-1');
    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    layer = map.createLayer('Tile Layer 1');
    //  Un-comment this on to see the collision tiles
    //layer.debug = true;
    layer.resizeWorld();
    this.physics.arcade.gravity.y = 600;

    player = this.add.sprite(32, 32, 'dude');
    this.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('idle', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.pontuaçao = 0;
    player.frame = 4;

    listaObjetos = ['cafe', 'computador', 'pinguim', 'som', 'roteador'];
    // -- Organiza itens ja coletados. Necessario adicionar mais.
    player.coletados = {};
    player.coletados['starBig'] = false;
    player.coletados['cafe'] = false;
    player.coletados['computador'] = false;
    player.coletados['pinguim'] = false;
    player.coletados['som'] = false;
    player.coletados['roteador'] = false;

    if (this.isMusicOn) {
      music = this.add.audio('game-Song', 0.3, true);
      music.play( '', 0, 0.3, true);
      music.onLoop.add(this.playMusic, this);
    }

    if (!this.isMP) {
      this.camera.follow(player);
    } 
    else {
      player2 = this.add.sprite(32, 32, 'dudeInv');
      this.physics.enable(player2, Phaser.Physics.ARCADE);
      player2.body.bounce.y = 0.2;
      player2.body.collideWorldBounds = true;
      player2.body.setSize(20, 32, 5, 16);
      player2.animations.add('left', [0, 1, 2, 3], 10, true);
      player2.animations.add('idle', [4], 20, true);
      player2.animations.add('right', [5, 6, 7, 8], 10, true);
      player2.frame = 4;
      // Define teclas de comando pro p2
      upButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
      downButton = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
      leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
      rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

      player2.pontuaçao = 0;
      player2.coletados = {};
      player2.coletados['starBig'] = false;
      player.coletados['cafe'] = false;
      player.coletados['computador'] = false;
      player.coletados['pinguim'] = false;
      player.coletados['som'] = false;
      player.coletados['roteador'] = false;
    }
    this.camera.follow(player);

    cursors = this.input.keyboard.createCursorKeys();
    
    //  Finally some stars to collect
    stars = this.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    var f=0;
    for (var i = 0; i < 12; i++, f++) {
      //  Create a star inside of the 'stars' group
      if(f==5)
        f=0;
      var star = stars.create( i * 70, 0, listaObjetos[f]);
      //  Let gravity do its thing
      star.body.gravity.y = 300;
      star.body.collideWorldBounds = true;
      //  This just gives each star a slightly random bounce value
      star.body.bounce.y = 0.8 + Math.random() * 0.2;
    
    } 

    //  Indicador de tempo
    textoTempo = this.game.add.text(320, 15);
    textoTempo.font = 'Arial Black';
    textoTempo.fontSize = 50;
    textoTempo.fontWeight = 'bold';
    textoTempo.stroke = '#000000';
    textoTempo.strokeThickness = 6;
    textoTempo.fill = '#43d637';
    textoTempo.fixedToCamera = true;

    var barraProgresso = this.add.sprite(10, 26, 'pgBar1');
    barraProgresso.fixedToCamera = true;

    this.somColeta = this.game.add.audio('coletou');

    // variavel inicio ajuda a contar tempo
    this.inicio = this.time.now;
    },

    update: function () {

      textoTempo.text = this.time.elapsedSecondsSince(this.inicio).toFixed(3) ;
      this.physics.arcade.collide(stars, layer);
      //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
      this.physics.arcade.collide(player, layer);
      if (this.isMP) {
        this.physics.arcade.collide(player2, layer);
        player2.body.velocity.x = 0;
        this.physics.arcade.overlap(player2, stars, this.collectStar, null, this);
      }
      //this.physics.arcade.collide(player, stars);
      
      player.body.velocity.x = 0;

      this.physics.arcade.overlap(player, stars, this.collectStar, null, this);
      if (cursors.left.isDown) {
        player.body.velocity.x = -150;

        if (this.facing != 'left') {
          player.animations.play('left');
          this.facing = 'left';
        }
      }
      else if (cursors.right.isDown) {
        player.body.velocity.x = 150;

        if (this.facing != 'right') {
          player.animations.play('right');
          this.facing = 'right';
        }
      }
      else {
        if (this.facing != 'idle') {
          player.animations.stop();

          if (this.facing == 'left') {
            player.frame = 0;
          }
          else {
            player.frame = 5;
          }
          player.frame = 4;
          this.facing = 'idle';
        }
      }
      
      if (cursors.up.isDown && player.body.onFloor() && this.time.now > this.p1jumpTimer) {
        player.body.velocity.y = -250;
        this.jumpTimer = this.time.now + 750;
      }
      // Comandos caso seja MP
      if (this.isMP) {
        if (leftButton.isDown) {
          player2.body.velocity.x = -150;

          if (this.facing != 'left') {
            player2.animations.play('left');
            this.p2facing = 'left';
          }
        }
        else if (rightButton.isDown) {
          player2.body.velocity.x = 150;

          if (this.p2facing != 'right') {
            player2.animations.play('right');
            this.p2facing = 'right';
          }
        }
        else {
          if (this.p2facing != 'idle') {
            player2.animations.stop();

            if (this.p2facing == 'left') {
              player2.frame = 0;
            }
            else {
              player2.frame = 5;
            }
            player2.frame = 4;
            this.p2facing = 'idle';
          }
        }

        if (upButton.isDown && player2.body.onFloor() && this.time.now > this.p2jumpTimer) {
          player2.body.velocity.y = -250;
          this.p2jumpTimer = this.time.now + 750;
        }
      }
      // Fim comandos MP
    },

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
    console.log('jogo terminou');
    let tempoFinal = this.time.elapsedSecondsSince(this.inicio).toFixed(3);
    console.log(tempoFinal + ' ');
    music.stop();
    //  Then let's go back to the main menu.
    
    this.state.start('MainMenu');

  },

  playMusic: function() {
    music.play('', 0, 0.4, true);
  },

  collectStar: function(player, star) {
    if (!player.coletados[star.key]) {
      player.coletados[star.key] = true;
      star.kill();
      if (this.isAudioOn) {
        this.somColeta.play();
      }
      var img = this.add.sprite(26 + (this.distanciaColetados*50), 32, star.key);
      this.distanciaColetados++;
      img.fixedToCamera = true;
      if (++player.pontuaçao === 5) {
        this.quitGame();
      }
    }
  },


};
