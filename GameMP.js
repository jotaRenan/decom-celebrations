
BasicGame.GameMP = function (game) {

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
    this.itens;
    this.score = 0;
    //Minhas var
    this.player2;
    this.medianX;
    this.medianY;
    this.worldScale = 1;
    this.textoTempo;
    this.somColeta;
    this.music = null;
    this.isAudioOn;
    this.isMusicOn;
    this.medianX = null;
    this.medianY = null;
    this.boost = null;
  };

BasicGame.GameMP.prototype = {

  init: function(isAudioOn, isMusicOn, dificuldade) {
    this.isAudioOn = isAudioOn;
    this.isMusicOn = isMusicOn;
    this.dif = dificuldade;
  },

  create: function () {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.stage.backgroundColor = '#000000';

    bg = this.add.tileSprite(-100, 0, 900, 600, 'background');
    //bg = this.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;
    bg.tilePosition.x = -(this.camera.x * 0.7);

    map = this.add.tilemap('level1');
    map.addTilesetImage('tiles-1');
    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    layer = map.createLayer('Tile Layer 1');

    //  Un-comment this on to see the collision tiles
    //layer.debug = true;
    layer.resizeWorld();
    this.physics.arcade.gravity.y = 450;

    player = this.add.sprite(32, 130, 'dude');
    this.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('idle', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.pontuaçao = 0;
    player.frame = 4;
    player.data = {nmr: 0};

    // -- Organiza itens ja coletados
    player.coletados = [];

    music = this.add.audio('game-Song', 0.3, true);
    if (this.isMusicOn) {
      music.play( '', 0, 0.3, true);
      music.onLoop.add(this.playMusic, this);
    }


    player2 = this.add.sprite(32, 130, 'dudeInv');
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
    player2.coletados = [];
    player2.data = {nmr: 1};
    
    boost = this.add.group();
    boost.enableBody = true;
    this.boost = boost.create(665, 265,'pula');
    //gamby
    this.boost.body.gravity = 0;

    cursors = this.input.keyboard.createCursorKeys();
    
    //  Finally some itens to collect
    itens = this.add.group();
    //  We will enable physics for any star that is created in this group
    itens.enableBody = true;

    //Coordernadas dos itens
    let C = Coordenada;
    coordenadas = [ new C( 114, 890 ),
                    new C( 325, 970 ),
                    new C( 780, 790 ),
                    new C( 863, 555 ),
                    new C( 445, 378 ),
                    new C( 567, 330 ),
                    new C( 350, 176 ),
                    new C( 940, 131 ),
                    new C( 613, 800),
                    new C(  13, 400),
                    new C( 922, 800)
                  ] ;
    //  Cria itens para coletar
    var f=0;
    for (var i = 0; i < 10; i++, f++) {
      if(f==10)
        f=0;
      var _item = itens.create( coordenadas[i].x,  coordenadas[i].y, 'items', f);
      _item.data = {item: f};
      _item.body.gravity.y = 300;
      _item.body.collideWorldBounds = true;
      _item.body.bounce.y = 0.8 + Math.random() * 0.2;
    
    } 

    //  HUD pra mostrar itens ja coletados
    var hud;
    hud = this.add.sprite(0, 0, 'hudMP');
    hud.fixedToCamera = true;

    //  Indicador de tempo
    textoTempo = this.game.add.text(340, 0);
    textoTempo.font = 'Arial Black';
    textoTempo.fontSize = 30;
    textoTempo.fontWeight = 'bold';
    textoTempo.stroke = '#000000';
    textoTempo.strokeThickness = 6;
    textoTempo.fill = '#43d637';
    textoTempo.fixedToCamera = true;
    textoTempo.align = 'center';

    this.somColeta = this.game.add.audio('coletou');



    // variavel inicio ajuda a contar tempo
    this.inicio = this.time.now;
    },

    update: function () {
      // Movimento de camera para multiplayer

      var posicaoP1X = player.body.x,
          posicaoP1Y = player.body.y,
          posicaoP2X = player2.body.x,
          posicaoP2Y = player2.body.y,
          distanciaX = (posicaoP1X > posicaoP2X ? (posicaoP1X - posicaoP2X) : (posicaoP2X - posicaoP1X) ),
          distanciaY = (posicaoP1Y > posicaoP2Y ? (posicaoP1Y - posicaoP2Y) : (posicaoP2Y - posicaoP1Y) );

      this.medianX = (player.body.x + player2.body.x) / 2;
      this.medianY = (player.body.y + player2.body.y) / 2;
      this.game.camera.focusOnXY(this.medianX, this.medianY);

      this.physics.arcade.overlap(player2, this.boost, this.boostEstrela, null, this);

      if (distanciaX >= 790) {
        player.body.velocity.x = 0;
        player2.body.velocity.x = 0;
      }
      if (distanciaY >= 590) {
        player.body.velocity.y = 0;
        player2.body.velocity.y = 0;
      } 
      
      this.physics.arcade.overlap(player, this.boost, this.boostEstrela, null, this);

      textoTempo.text = this.time.elapsedSecondsSince(this.inicio).toFixed(3) ;
      this.physics.arcade.collide(itens, layer);
      this.physics.arcade.collide(player, layer);
      this.physics.arcade.collide(player2, layer);
      player2.body.velocity.x = 0;
      this.physics.arcade.overlap(player2, itens, this.collectStar, null, this);

      //Limita movimento ao controle do usuario
      player.body.velocity.x = 0;

      this.physics.arcade.overlap(player, itens, this.collectStar, null, this);
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
      // Comandos player2
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
      // Fim comandos p2
    },

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
    let tempoFinal = this.time.elapsedSecondsSince(this.inicio).toFixed(3);
    
    if (this.isMusicOn) {
      music.stop();
    }
    //  Then let's go back to the main menu.    
    this.state.start('endState', true, false, tempoFinal, this.isAudioOn, this.isMusicOn);

  },

  playMusic: function() {
    music.play('', 0, 0.4, true);
  },

  collectStar: function(player, star) {
    let indexItem = star.data['item'];
    if (player.coletados.indexOf(indexItem) === -1) {
      player.coletados.push(indexItem);
      star.kill();
      if (this.isAudioOn) {
        this.somColeta.play();
      }
      this.atualizaHud(player, star, indexItem);
      if (++player.pontuaçao === 10) {
        this.quitGame();
      }
    }
  },

  atualizaHud: function(player, star, index) {

    var topo = 18,
        esquerda = player.data['nmr'] === 0 ? 6 : 475;

    var img = this.add.sprite(esquerda + (index*32), topo, star.key, index);
    img.tint = 0x00ff00;
    img.fixedToCamera = true;
  },

  boostEstrela: function(player) {
    player.body.velocity.y -= 160;
    
  }

};
