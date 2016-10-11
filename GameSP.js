
BasicGame.GameSP = function (game) {

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
    this.p1jumpTimer = 0;
    this.cursors;
    this.bg;
    this.itens;
    this.score = 0;
    //Minhas var
    this.textoTempo;
    this.somColeta;
    this.music = null;
    this.isAudioOn;
    this.isMusicOn;
    this.boost = null;
  };

function Coordenada(x, y) {
  this.x = x;
  this.y = y;
}

BasicGame.GameSP.prototype = {

  init: function(isAudioOn, isMusicOn, dificuldade) {
    this.isAudioOn = isAudioOn;
    this.isMusicOn = isMusicOn;
    this.dif = dificuldade;
  },

  create: function () {
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
    // -- Organiza itens ja coletados
    player.coletados = [];

    music = this.add.audio('game-Song', 0.3, true);
    if (this.isMusicOn) {
      music.play( '', 0, 0.3, true);
      music.onLoop.add(this.playMusic, this);
    }
    
    boost = this.add.group();
    boost.enableBody = true;
    this.boost = boost.create(665, 265,'pula');
    //gamby
    this.boost.body.gravity = 0;

    this.camera.follow(player);
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
    hud = this.add.sprite(0, 0, 'hudSP');
    hud.fixedToCamera = true;
    //  Indicador de tempo
    textoTempo = this.game.add.text(320, 5);
    textoTempo.font = 'Arial Black';
    textoTempo.align = 'center';
    textoTempo.fontSize = 40;
    textoTempo.fontWeight = 'bold';
    textoTempo.stroke = '#000000';
    textoTempo.strokeThickness = 4;
    textoTempo.fill = '#43d637';
    textoTempo.fixedToCamera = true;

    this.somColeta = this.game.add.audio('coletou');

    // variavel inicio ajuda a contar tempo
    this.inicio = this.time.now;


    },

    update: function () {

      this.physics.arcade.overlap(player, this.boost, this.boostEstrela, null, this);

      textoTempo.text = this.time.elapsedSecondsSince(this.inicio).toFixed(3) ;
      this.physics.arcade.collide(itens, layer);
      this.physics.arcade.collide(player, layer);
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

    var topo = 19,
        esquerda =  index < 5 ? 51 : 510;
        f = index < 5 ? index : index - 5;
    var img = this.add.sprite(esquerda + (f*52), topo, star.key, index);
    img.tint = 0x00ff00;
    img.fixedToCamera = true;
  },

  boostEstrela: function(player) {
    player.body.velocity.y -= 160;
    
  }

};
