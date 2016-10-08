
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

    this.p1facing = 'left';
    this.p2facing = 'left';
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
  };

BasicGame.Game.prototype = {

  init: function(isMultiPlayer, dificuldade) {
    this.isMP = isMultiPlayer;
    this.dif = dificuldade;
  },

  create: function () {
    console.log('entrou game');
    //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.stage.backgroundColor = '#000000';
    bg = this.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;
    map = this.add.tilemap('level1');
    map.addTilesetImage('tiles-1');
    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
    layer = map.createLayer('Tile Layer 1');
    //  Un-comment this on to see the collision tiles
    //layer.debug = true;
    layer.resizeWorld();
    this.physics.arcade.gravity.y = 250;

    player = this.add.sprite(32, 32, 'dude');
    this.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    player.pontuaçao = 0;

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
      player2.animations.add('turn', [4], 20, true);
      player2.animations.add('right', [5, 6, 7, 8], 10, true);
      // Define teclas de comando pro p2
      upButton = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
      downButton = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
      leftButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
      rightButton = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

      player2.pontuaçao = 0;
    }
    this.camera.follow(player);

    cursors = this.input.keyboard.createCursorKeys();
    
    //  Finally some stars to collect
    stars = this.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++) {
      //  Create a star inside of the 'stars' group
      var star = stars.create(i * 70, 0, 'starBig');

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

    // variavel inicio ajuda a contar tempo
    this.inicio = this.time.now;
    },

    update: function () {

////  
      // medianX = (player.body.x > player2.body.x) ? (player.body.x - player2.body.x) : (player2.body.x - player.body.x);
      // medianY =  (player.body.y > player2.body.y) ? (player.body.y - player2.body.y) : (player2.body.y - player.body.y);
      // this.game.camera.focusOnXY(medianX, medianY);

////

///
      // if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
      //       map.setScale(0.5, 0.5);
      //   }
      //   else if (this.game.input.keyboard.isDown(Phaser.Keyboard.F)) {
      //       this.worldScale -= 0.05;
      //   }
        
      //   // set a minimum and maximum scale value
      //   this.worldScale = Phaser.Math.clamp(this.worldScale, 0.5, 1);
        
      //   // set our world scale as needed
      //   this.game.world.scale.set(this.worldScale);
      
///

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

    //  Then let's go back to the main menu.
    
    this.state.start('MainMenu');

  },

  collectStar: function(player, star) {
    star.kill();
    if (stars.total === 0) {
      this.quitGame();
      
    }
  },


};
