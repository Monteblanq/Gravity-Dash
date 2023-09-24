/*
Creator Name #1 : Neo Zhi Ming
Creator Name #2 : Sia Jing Hui
*/

const gameState = {
  checkGravity: true //A flag to check the current state of gravity. True means gravity is going down, False means gravity is going up.
};

class GameScene extends Phaser.Scene {
    constructor() {
      super({ key: 'GameScene' });
      
    }
    

//Preloading necessary assets
preload() {

    //Sprites and images
      this.load.image('backgroundColour', 'images/BackgroundColour.png');
      this.load.image('mostBackProps', 'images/UNmovedBackgroundProps.png');
      this.load.image('backProps', 'images/BackgroundPropsBack.png');
      this.load.image('middleProps', 'images/BackgroundPropsMiddle.png');
      this.load.image('frontProps', 'images/BackgroundPropsFront.png');
      this.load.image('mostFrontProps', 'images/BackgroundPropsMostFront.png')
      this.load.spritesheet('player', 'images/BallSpriteSheet.png', { frameWidth: 100, frameHeight: 100});
      this.load.spritesheet('platform', 'images/Platform Spritesheet.png', { frameWidth: 500, frameHeight: 100});
      this.load.spritesheet('wall', 'images/Wall Spritesheet.png', { frameWidth: 100, frameHeight: 500});
      this.load.spritesheet('floorCeiling', 'images/FloorCeiling SpriteSheet.png', { frameWidth: 1920, frameHeight: 100} )
      this.load.spritesheet('dash', 'images/Dash.png', { frameWidth: 100, frameHeight: 100});
      this.load.spritesheet('doubleJump', 'images/Double Jump.png', { frameWidth: 100, frameHeight: 100});
      this.load.spritesheet('noCollide', 'images/Uncollidable.png', { frameWidth: 100, frameHeight: 100});
      this.load.image('noJump', 'images/noJump.png');
      this.load.image('opaque', 'images/opaque.png');
      this.load.image('speedUp', 'images/speedUp.png');

    //Audio
      //Background Music
      this.load.audio('backgGroundMusic', 'audio/Background_Music.mp3'); 

      //Sound effects
      this.load.audio('gameOver', 'audio/Game_Over.wav');
      this.load.audio('jump', 'audio/jump.wav');
      this.load.audio('buff', 'audio/buff.wav');
      this.load.audio('debuff','audio/debuff.wav');
  }



create() {

    gameState.self = this; //Gets a reference to the scene object.
    
    gameState.countDownTimeout; //Variable to store the timeout function. This reference is made so that it can be used to stop it.
    gameState.countDownNum = 3; //Number for the countdown. Starts from 3 and counts down.
    gameState.countedDown = false; //Flag to check if the countdown is done.

    gameState.activeBuffDebuff = []; //An array of active buffs and debuffs which will be displayed on the screen.

    gameState.angleDelta = 10; //Change of rotation of the player

    gameState.checkGravity = true;     //Variable to check the gravity, if true gravity down, if false gravity up
    
    gameState.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);    //Variable to detect input of spacebar
    gameState.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);    //Variable to detect input of up key
    gameState.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);    //Variable to detect input of down key
    gameState.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);    //Variable to detect input of Z key

    gameState.active = true;    //Variable to check game is playing or game over, if true game is playing, if false game over

    gameState.maxJump = 1;    //Variable to limit the player jump
    gameState.jumpcount = 1;    //Variable to count the times player has jumped

    gameState.wallSpawnTimer = 5000;    //Variable to specify wall spawn. Initally it is set to spawn every 5 seconds.

    gameState.speedUpBool = false;    //Variable to detect if speeding up debuff is active or not
    gameState.doubleJumpBool = false;   //Variable to detect if double jump buff is active or not
    gameState.noJumpBool = false;   //Variable to detect if no jump debuff is active or not
    gameState.opaqueBool = false;   //Variable to detect opaque debuff is working or not (opaque means unable to pass through platforms to go up or down)
    
    gameState.score = 0;    //Variable to calculate how much score player get

    /*AUDIO*/
      gameState.backgroundMusic = this.sound.add('backgGroundMusic', { loop: true });   //add background music

      gameState.jump = this.sound.add('jump', { loop: false });   //add sound to the jump action
      gameState.buff = this.sound.add('buff', { loop: false });   //add sound while player get a buff item
      gameState.debuff = this.sound.add('debuff', { loop: false });   //add sound while player get a debuff item
      gameState.gameOver = this.sound.add('gameOver', { loop: false });   //add sound while player game over
      
      gameState.backgroundMusic.setVolume(0.5);
      gameState.backgroundMusic.play();   //play the background music

    const style1 = { fontSize: "40px" , fill: "	#000000" , fontFamily: "FF"};   //style for the score text
    const style2 = { fontSize: "40px" , fill: "	#000000", align: "center", fontFamily: "FF"};   //style for the game over text
    const style3 = { fontSize: "200px" , fill: "	#000000" , fontFamily: "FF"};   //style for the countdown text


    /*ADDING SPRITES TO SCENE AND CREATING GROUPS*/
    /*Background image and parallax background*/
    gameState.background = this.add.image(0,0, 'backgroundColour').setDepth(0).setOrigin(0,0);
    gameState.background.setScale(window.innerWidth/gameState.background.width, window.innerHeight/gameState.background.height);

    gameState.backMostProps = this.add.image(0,90,'mostBackProps').setDepth(0).setOrigin(0,0);
    gameState.backMostProps.setScale(window.innerWidth/gameState.backMostProps.width, window.innerHeight/gameState.backMostProps.height);

    gameState.backProps = this.physics.add.sprite(0,90, 'backProps').setDepth(0).setOrigin(0,0).setGravityY(config.physics.arcade.gravity.y *-1);
    gameState.backProps.setScale(window.innerWidth/gameState.backProps.width, window.innerHeight/gameState.backProps.height);

    gameState.backBackProps = this.physics.add.sprite(window.innerWidth,90, 'backProps').setDepth(0).setOrigin(0,0).setGravityY(config.physics.arcade.gravity.y *-1); 
    gameState.backBackProps.setScale(window.innerWidth/gameState.backBackProps.width, window.innerHeight/gameState.backBackProps.height);

    gameState.middleProps = this.physics.add.sprite(0,90, 'middleProps').setDepth(0).setOrigin(0,0).setGravityY(config.physics.arcade.gravity.y *-1);
    gameState.middleProps.setScale(window.innerWidth/gameState.middleProps.width, window.innerHeight/gameState.middleProps.height);

    gameState.backMiddleProps = this.physics.add.sprite(window.innerWidth,90, 'middleProps').setDepth(0).setOrigin(0,0).setGravityY(config.physics.arcade.gravity.y *-1);
    gameState.backMiddleProps.setScale(window.innerWidth/gameState.backMiddleProps.width, window.innerHeight/gameState.backMiddleProps.height);

    gameState.frontProps = this.physics.add.sprite(0,90, 'frontProps').setDepth(0).setOrigin(0,0).setGravityY(config.physics.arcade.gravity.y *-1);
    gameState.frontProps.setScale(window.innerWidth/gameState.frontProps.width, window.innerHeight/gameState.frontProps.height);

    gameState.backFrontProps = this.physics.add.sprite(window.innerWidth,90, 'frontProps').setDepth(0).setOrigin(0,0).setGravityY(config.physics.arcade.gravity.y *-1);
    gameState.backFrontProps.setScale(window.innerWidth/gameState.backFrontProps.width, window.innerHeight/gameState.backFrontProps.height);

    gameState.mostFrontProps = this.physics.add.sprite(0,90, 'mostFrontProps').setDepth(0).setOrigin(0,0).setGravityY(config.physics.arcade.gravity.y *-1);;
    gameState.mostFrontProps.setScale(window.innerWidth/gameState.mostFrontProps.width, window.innerHeight/gameState.mostFrontProps.height);

    gameState.backMostFrontProps = this.physics.add.sprite(window.innerWidth,90, 'mostFrontProps').setDepth(0).setOrigin(0,0).setGravityY(config.physics.arcade.gravity.y *-1);
    gameState.backMostFrontProps.setScale(window.innerWidth/gameState.backMostFrontProps.width, window.innerHeight/gameState.backMostFrontProps.height);
    /*Background image and parallax background*/

    gameState.player = this.physics.add.sprite(200, 500, 'player').setDepth(1).setGravityY(config.physics.arcade.gravity.y *-1); //Player sprite
    
    gameState.text = this.add.text(60, 60, 'Score: 0', style1).setDepth(2); // Score text
    gameState.text.setStroke("#FFFFFF", 4); //Create a white outline on the text
    
    gameState.gameOverText = this.add.text(window.innerWidth/2, window.innerHeight/2, '', style2).setDepth(2).setOrigin(0.5,0.5); //Game over text which appears when the player loses
    gameState.gameOverText.setStroke("#FFFFFF", 4); //Create a white outline on the text

    gameState.countDownText = this.add.text(window.innerWidth/2, window.innerHeight/2, '', style3).setDepth(2).setOrigin(0.5,0.5); //Countdown text
    gameState.countDownText.setStroke("#FFFFFF", 6); //Create a white outline on the text

    gameState.floor = this.physics.add.sprite(0, window.innerHeight-100, 'floorCeiling').setGravityY(config.physics.arcade.gravity.y *-1).setImmovable(true).setDepth(1).setOrigin(0,0); //The floor at the front that will be moving to the left (for more information, please go to Point A at the bottom)
    gameState.backFloor = this.physics.add.sprite(window.innerWidth, window.innerHeight-100, 'floorCeiling').setGravityY(config.physics.arcade.gravity.y *-1).setImmovable(true).setDepth(1).setOrigin(0,0); //The floor at the back that will move with the floor at the front. (for more information, please go to Point A at the bottom)
    gameState.ceiling = this.physics.add.sprite(0,0, 'floorCeiling').setGravityY(config.physics.arcade.gravity.y * -1).setImmovable(true).setDepth(1).setFlipY(true).setOrigin(0,0); // The ceiling at the front that will be moving to the left (for more information, please go to Point A at the bottom)
    gameState.backCeiling = this.physics.add.sprite(window.innerWidth,0, 'floorCeiling').setGravityY(config.physics.arcade.gravity.y * -1).setImmovable(true).setDepth(1).setFlipY(true).setOrigin(0,0); //The ceiling at the back that will move with the floor at the front. (for more information, please go to Point A at the bottom)
    
    gameState.walls = this.physics.add.group(); //Group of walls
    gameState.platforms = this.physics.add.group(); //Group of platforms
    gameState.buffDebuffs = this.physics.add.group(); //Group of buffs and debuffs.
    /*ADDING SPRITES TO SCENE AND CREATING GROUPS*/

  

    //Setting floor and ceilings to be a little bit bigger than the screen so that gaps don't appear (for more information go to Point A at the bottom)
    gameState.floor.setScale(window.innerWidth/gameState.floor.width + 0.01, 1);
    gameState.backFloor.setScale(window.innerWidth/gameState.floor.width + 0.01, 1);
    gameState.ceiling.setScale(window.innerWidth/gameState.floor.width + 0.01, 1);
    gameState.backCeiling.setScale(window.innerWidth/gameState.floor.width + 0.01, 1);


    //Set friction of floor and ceiling so it doesn't drag the player along with it.
    gameState.floor.setFriction(0);
    gameState.backFloor.setFriction(0);
    gameState.ceiling.setFriction(0);
    gameState.backCeiling.setFriction(0);

    

    this.physics.add.collider(gameState.player, gameState.floor);   //Add collider for the player with the floor
    this.physics.add.collider(gameState.player, gameState.ceiling);   //Add collider for the player with the ceiling
    this.physics.add.collider(gameState.player, gameState.backFloor);   //Add collider for the player with the back ceiling
    this.physics.add.collider(gameState.player, gameState.backCeiling);   //Add collider for the player with the back floor
    this.physics.add.collider(gameState.player, gameState.walls, function()   //Add collider for the player with the walls
    {
        gameState.angleDelta = 0; //Player stops spinning when it collides with the wall.
        gameState.player.setVelocityX(0);   //Player would not bounce back after collide with wall
    });
    gameState.universalFrame = 0; //A universal animation frame so that all platforms and floors and ceilings change animations together. 

    gameState.self.createAllAnims(); //Initialise all animations.

    gameState.doubleJumpTimeout; //Reference for the Timeout function set for the double jump buff. Used for stopping the function if needed.

    gameState.noJumpTimeout; //Reference for the Timeout function set for the no jump debuff. Used for stopping the function if needed.
    
    gameState.dashTimeout; // Reference for the Timeout function set for the dash buff. Used for stopping the function if needed.
    
    gameState.noCollideTimeout; // Reference for the Timeout function set for the no collide buff. Used for stopping the function if needed.
    gameState.noCollideTimeout2; // Reference for the Timeout function in the no collide buff used for te delay for the player to blink. Used for stopping the function if needed. (For more information, go to Point B below)
    gameState.intervalRef; //Reference for the Interval function for the no collide buff that causes the player to blink. Used for stopping the function if needed
    
    gameState.speedUpTimeout; // Reference for the Timeout function set for the speed up debuff. Used for stopping the function if needed. 
    
    gameState.opaqueTimeout; // Reference for the Timeout function set for the opaque debuff. Used for stopping the function if needed.
     
    
    this.physics.add.collider(gameState.player, gameState.platforms);   //Add collider for the player with the platforms

    this.physics.add.overlap( gameState.buffDebuffs.getChildren(), gameState.player, function(buffDebuff)   //If player touch the buff or debuff item...
    {
      if (buffDebuff.type == 0) //Buff: dash
      {
          var dashBuff; //Reference for the dash buff
          if(!(gameState.activeBuffDebuff.some(bD=> bD.type === 0))) //Checks if the dash buff is already active. If it is already active, then do not generate an UI image to indicate that it is active to avoid duplicates.
          {
            //This puts a UI indicator of an active dash buff above the score.
            if(gameState.activeBuffDebuff.length <= 0)
            {
              dashBuff = gameState.self.add.image(90, 40, 'dash').setScale(0.5, 0.5).setDepth(2);
              dashBuff.type = 0; //To identify the image later
            }
            //If this is not the only active buff, stack it next to the right most active buff or debuff in the list of UI indicators.
            else
            {
              dashBuff = gameState.self.add.image(gameState.activeBuffDebuff[gameState.activeBuffDebuff.length-1].x + 50, 40, 'dash').setScale(0.5, 0.5).setDepth(2);
              dashBuff.type = 0; //To identify the image later
            }
            gameState.activeBuffDebuff.push(dashBuff); //add the variable into the array
          }

          gameState.player.setVelocityX(100);    //player move towards the right
          if(gameState.dashTimeout != null) //If a previous instance of the dash buff is already active, cancel the Timeout function so it can be reset.
          {
            clearTimeout(gameState.dashTimeout);
          }

          //Player stop moving toward after 2.5 seconds. Then the UI indicator for its activeness is removed.
          gameState.dashTimeout = setTimeout(function()
          {

              //Get the index of the dash buff in the list of UI indicators.
              var index = gameState.activeBuffDebuff.map(function(bD) { return bD.type; }).indexOf(0) // It turns the object list into a number list(type) and use that to find its index. (Example, if array is [DashImage, NoCollideImage] it maps it to an array of [0, 2]. Then we search for the index of a specific type.)
              
              //Shift everything behind the specific element to left. If the image is the last on the list, it does not shift anything.
              if(index < gameState.activeBuffDebuff.length-1)
              {
                for(var i = index+1; i < gameState.activeBuffDebuff.length; i++)
                {
                  gameState.activeBuffDebuff[i].x = (gameState.activeBuffDebuff[i].x - 50);
                }
              }
              gameState.activeBuffDebuff.splice(index, 1)[0].destroy();    //Remove from array of active buffs and debuffs and destroy it
              if(gameState.player.active)
              {
                gameState.player.setVelocityX(0); //Resets the velocity of the player.
              }
            }, 2500);

          
      }
      
      if (buffDebuff.type == 1) //Buff: double jump
      {
        if(gameState.doubleJumpBool === false)
        {
          gameState.maxJump++;    //If the buff is not active, then increase player jump limit.
        }
        gameState.doubleJumpBool = true;
          var doubleJumpBuff;//Reference for the double jump buff
          if(!(gameState.activeBuffDebuff.some(bD=> bD.type === 1))) //Checks if the double jump buff is already active. If it is already active, then do not generate an UI image to indicate that it is active to avoid duplicates.
          {
            //This puts a UI indicator of an active double jump buff above the score.
            if(gameState.activeBuffDebuff.length <= 0)
            {
              doubleJumpBuff = gameState.self.add.image(90, 40, 'doubleJump').setScale(0.5, 0.5).setDepth(2);
              doubleJumpBuff.type = 1; //To identify the image later
            }
            //If this is not the only active buff, stack it next to the active UI indicator.
            else
            {
              doubleJumpBuff = gameState.self.add.image(gameState.activeBuffDebuff[gameState.activeBuffDebuff.length-1].x + 50, 40, 'doubleJump').setScale(0.5, 0.5).setDepth(2);
              doubleJumpBuff.type = 1; //To identify the image later
            }
            gameState.activeBuffDebuff.push(doubleJumpBuff); //add the variable into the array
          }


        
        if(gameState.doubleJumpTimeout != null) //If a previous instance of the double jump buff is already active, cancel the Timeout function so it can be reset.
        {
          clearTimeout(gameState.doubleJumpTimeout);
        }

        //Reset the increment of the maximum jumps be decrease it after 5 seconds. Then the UI indicator for its activeness is removed.
        gameState.doubleJumpTimeout = setTimeout(function()
        {
          gameState.doubleJumpBool = false;
          gameState.maxJump--; //Resets the jump limit
           //Get the index of the double jump buff in the list of UI indicators.
           var index = gameState.activeBuffDebuff.map(function(bD) { return bD.type; }).indexOf(1) // It turns the object list into a number list(type) and use that to find its index. (Example, if array is [DashImage, NoCollideImage] it maps it to an array of [0, 2]. Then we search for the index of a specific type.)
           //Shift everything behind the specific element to left. If the image is the last on the list, it does not shift anything.
           if(index < gameState.activeBuffDebuff.length-1)
           {
             for(var i = index+1; i < gameState.activeBuffDebuff.length; i++)
             {
               gameState.activeBuffDebuff[i].x = (gameState.activeBuffDebuff[i].x - 50);
             }
           }
           gameState.activeBuffDebuff.splice(index, 1)[0].destroy();    //Remove from array of active buffs and debuffs and destroy it
        }, 5000)

      }
      
      if (buffDebuff.type == 2)  //Buff: no collide
      {
        var noCollideBuff; //Reference for the no collide buff
        if(!(gameState.activeBuffDebuff.some(bD=> bD.type === 2))) //Checks if the no collide buff is already active. If it is already active, then do not generate an UI image to indicate that it is active to avoid duplicates.
        {
          //This puts a UI indicator of an active no collide buff above the score.
          if(gameState.activeBuffDebuff.length <= 0)
          {
            noCollideBuff = gameState.self.add.image(90, 40, 'noCollide').setScale(0.5, 0.5).setDepth(2);
            noCollideBuff.type = 2; //To identify the image later
          }
          //If this is not the only active buff, stack it next to the active UI indicator.
          else
          {
            noCollideBuff = gameState.self.add.image(gameState.activeBuffDebuff[gameState.activeBuffDebuff.length-1].x + 50, 40, 'noCollide').setScale(0.5, 0.5).setDepth(2);
            noCollideBuff.type = 2; //To identify the image later
          }
          gameState.activeBuffDebuff.push(noCollideBuff); //add the variable into the array
        }

        gameState.player.setAlpha(0.5);   //Player become translucent

        //player would not collide from the left or right
        gameState.player.body.checkCollision.left = false;    
        gameState.player.body.checkCollision.right = false;

        /*POINT B*/
        if(gameState.noCollideTimeout != null) //If a previous instance of the no Collide buff is already active, cancel the Timeout function so it can be reset.
        {
          clearTimeout(gameState.noCollideTimeout);
        }
        if(gameState.intervalRef != null) //Remove the periodic blinking effect of the player so it can be reset.
        {
          clearInterval(gameState.intervalRef);
        }
        if(gameState.noCollideTimeout2 != null) // Remove the delay for the interval function, above so it can be reset.
        {
          clearInterval(gameState.noCollideTimeout2);
        }
        
        //Player would start to blink after 3 seconds the player gets the buff
        gameState.noCollideTimeout2 = setTimeout(function(){gameState.intervalRef = setInterval(function(){
          gameState.self.playerBlink();
        }, 250)}, 3000);   

        //Resets the collision for the walls after 5 seconds. Then the UI indicator for its activeness is removed.
        gameState.noCollideTimeout = setTimeout(function()
        {
          clearInterval(gameState.intervalRef); //Stops the blinking when the buff ends 
          if(gameState.player.active)
          {
            gameState.player.setAlpha(1); //The player becomes opaque when the buff ends;

            //Resets the collision with the wall.
            gameState.player.body.checkCollision.left = true;
            gameState.player.body.checkCollision.right = true;
          }
          //Get the index of the no collide buff in the list of UI indicators.
          var index = gameState.activeBuffDebuff.map(function(bD) { return bD.type; }).indexOf(2); // It turns the object list into a number list(type) and use that to find its index. (Example, if array is [DashImage, NoCollideImage] it maps it to an array of [0, 2]. Then we search for the index of a specific type.)
    
           //Shift everything behind the specific element to left. If the image is the last on the list, it does not shift anything.
          if(index < gameState.activeBuffDebuff.length-1)
          {
            for(var i = index+1; i < gameState.activeBuffDebuff.length; i++)
            {
              gameState.activeBuffDebuff[i].x = (gameState.activeBuffDebuff[i].x - 50);
            }
          }
          gameState.activeBuffDebuff.splice(index, 1)[0].destroy();   //Remove from array of active buffs and debuffs and destroy it
        }, 5000)
      }

      if (buffDebuff.type == 3) //Debuff: no jump
      {
        if(gameState.noJumpBool === false)
        {
          gameState.maxJump--; //If the debuff is not active, then reduce player jump limit.
        }

        gameState.noJumpBool = true;
        var noJumpDebuff; //Reference for the no jump debuff
        if(!(gameState.activeBuffDebuff.some(bD=> bD.type === 3))) //Checks if the no jump debuff is already active. If it is already active, then do not generate an UI image to indicate that it is active to avoid duplicates.
        {
           //This puts a UI indicator of an active no jump debuff above the score.
          if(gameState.activeBuffDebuff.length <= 0)
          {
            noJumpDebuff = gameState.self.add.image(90, 40, 'noJump').setScale(0.5, 0.5).setDepth(2);
            noJumpDebuff.type = 3; //To identify the image later
          }
          //If this is not the only active debuff, stack it next to the active UI indicator.
          else
          {
            noJumpDebuff = gameState.self.add.image(gameState.activeBuffDebuff[gameState.activeBuffDebuff.length-1].x + 50, 40, 'noJump').setScale(0.5, 0.5).setDepth(2);
            noJumpDebuff.type = 3; //To identify the image later
          }
          gameState.activeBuffDebuff.push(noJumpDebuff); //add the variable into the array
        }
          if(gameState.noJumpTimeout != null)//If a previous instance of the no jump debuff is already active, cancel the Timeout function so it can be reset.
          {
            clearTimeout(gameState.noJumpTimeout);
          }

          //Reset the jump limit after 5 seconds. Then the UI indicator for its activeness is removed.
          gameState.noJumpTimeout = setTimeout(function()
          {
            gameState.maxJump++; //Resets the jump limit
            gameState.noJumpBool = false;
            //Get the index of the no jump debuff in the list of UI indicators.
            var index = gameState.activeBuffDebuff.map(function(bD) { return bD.type; }).indexOf(3) // It turns the object list into a number list(type) and use that to find its index. (Example, if array is [DashImage, NoCollideImage] it maps it to an array of [0, 2]. Then we search for the index of a specific type.)
    
            //Shift everything behind the specific element to left. If the image is the last on the list, it does not shift anything.
            if(index < gameState.activeBuffDebuff.length-1)
            {
              for(var i = index+1; i < gameState.activeBuffDebuff.length; i++)
              {
                gameState.activeBuffDebuff[i].x = (gameState.activeBuffDebuff[i].x - 50);
              }
            }
            gameState.activeBuffDebuff.splice(index, 1)[0].destroy();    //Remove from array of active buffs and debuffs and destroy it
          }, 5000)
      }

      if (buffDebuff.type == 4) //Debuff: speed up
      {
        var speedUpDebuff; //Reference for the speed up debuff
        if(!(gameState.activeBuffDebuff.some(bD=> bD.type === 4))) //Checks if the speed up debuff is already active. If it is already active, then do not generate an UI image to indicate that it is active to avoid duplicates.
        {
          //This puts a UI indicator of an active speed up debuff above the score.
          if(gameState.activeBuffDebuff.length <= 0)
          {
            speedUpDebuff = gameState.self.add.image(90, 40, 'speedUp').setScale(0.5, 0.5).setDepth(2);
            speedUpDebuff.type = 4; //To identify the image later
          }
          //If this is not the only active buff, stack it next to the active UI indicator.
          else
          {
            speedUpDebuff = gameState.self.add.image(gameState.activeBuffDebuff[gameState.activeBuffDebuff.length-1].x + 50, 40, 'speedUp').setScale(0.5, 0.5).setDepth(2);
            speedUpDebuff.type = 4; //To identify the image later
          }
          gameState.activeBuffDebuff.push(speedUpDebuff); //add the variable into the array
        }

          if(gameState.speedUpTimeout != null)//If a previous instance of the speed up debuff is already active, cancel the Timeout function so it can be reset.
          {
            clearTimeout(gameState.speedUpTimeout);
          }
          gameState.speedUpBool = true; // Set the flag for the speed up debuff to true to show it's active.

          //The speed of walls, platforms, buff and debuff items, floor and ceiling toward player increase
          gameState.walls.getChildren().forEach(function(wall)
          {
            wall.setVelocityX(-700);
          });
          gameState.platforms.getChildren().forEach(function(platform)
          {
            platform.setVelocityX(-700);
          });
          gameState.buffDebuffs.getChildren().forEach(function(buffDebuff)
          {
            buffDebuff.setVelocityX(-700);
          });
          
          gameState.floor.setVelocityX(-700);
          gameState.backFloor.setVelocityX(-700);
          gameState.ceiling.setVelocityX(-700);
          gameState.backCeiling.setVelocityX(-700);

          /*Speed up the velocity for each layer of background*/
          gameState.backProps.setVelocityX(-50-200);
          gameState.backBackProps.setVelocityX(-50-200);
          gameState.middleProps.setVelocityX(-100-200);
          gameState.backMiddleProps.setVelocityX(-100-200);
          gameState.frontProps .setVelocityX(-200-200);
          gameState.backFrontProps.setVelocityX(-200-200);
          gameState.mostFrontProps.setVelocityX(-400-200);
          gameState.backMostFrontProps.setVelocityX(-400-200);
          /*Speed up the velocity for each layer of background*/
          
          //The speed of walls, platforms, buff and debuff items, floor and ceiling toward player back to normal after 5 seconds
          gameState.speedUpTimeout = setTimeout(function()
          {
            gameState.walls.getChildren().forEach(function(wall)
            {
              wall.setVelocityX(-500)
            });
            gameState.platforms.getChildren().forEach(function(platform)
            {
              platform.setVelocityX(-500)
            });
            gameState.buffDebuffs.getChildren().forEach(function(buffDebuff)
            {
              buffDebuff.setVelocityX(-500);
            });
            gameState.speedUpBool = false; // Set the flag for the speed up debuff to false to show it's inactive.
            gameState.floor.setVelocityX(-500);
            gameState.backFloor.setVelocityX(-500);
            gameState.ceiling.setVelocityX(-500);
            gameState.backCeiling.setVelocityX(-500);
            
            /*Set velocity for each layer of background back to normal*/
            gameState.backProps.setVelocityX(-50);
            gameState.backBackProps.setVelocityX(-50);
            gameState.middleProps.setVelocityX(-100);
            gameState.backMiddleProps.setVelocityX(-100);
            gameState.frontProps .setVelocityX(-200);
            gameState.backFrontProps.setVelocityX(-200);
            gameState.mostFrontProps.setVelocityX(-400);
            gameState.backMostFrontProps.setVelocityX(-400);
            /*Set velocity for each layer of background back to normal*/

            //Get the index of the speed up debuff in the list of UI indicators.
            var index = gameState.activeBuffDebuff.map(function(bD) { return bD.type; }).indexOf(4)
    
            //Shift everything behind the specific element to left. If the image is the last on the list, it does not shift anything.
            if(index < gameState.activeBuffDebuff.length-1)
            {
              for(var i = index+1; i < gameState.activeBuffDebuff.length; i++)
              {
                gameState.activeBuffDebuff[i].x = (gameState.activeBuffDebuff[i].x - 50);
              }
            }
            gameState.activeBuffDebuff.splice(index, 1)[0].destroy();     //Remove from array of active buffs and debuffs and destroy it
          }, 5000)
      }

      if (buffDebuff.type == 5) //Debuff: opaque
      {
        var opaqueDebuff; //Reference for the opaque debuff 
        if(!(gameState.activeBuffDebuff.some(bD=> bD.type === 5))) //Checks if the opaque debuff is already active. If it is already active, then do not generate an UI image to indicate that it is active to avoid duplicates.
        {
          //This puts a UI indicator of an active opaque debuff above the score.
          if(gameState.activeBuffDebuff.length <= 0)
          {
            opaqueDebuff = gameState.self.add.image(90, 40, 'opaque').setScale(0.5, 0.5).setDepth(2);
            opaqueDebuff.type = 5; //To identify the image later
          }
          //If this is not the only active buff, stack it next to the active UI indicator.
          else
          {
            opaqueDebuff = gameState.self.add.image(gameState.activeBuffDebuff[gameState.activeBuffDebuff.length-1].x + 50, 40, 'opaque').setScale(0.5, 0.5).setDepth(2);
            opaqueDebuff.type = 5; //To identify the image later
          }
          gameState.activeBuffDebuff.push(opaqueDebuff); //add the variable into the array
        }

          if(gameState.opaqueTimeout != null) //If a previous instance of the opaque debuff is already active, cancel the Timeout function so it can be reset.
          {
            clearTimeout(gameState.opaqueTimeout);
          }
          gameState.opaqueBool = true; //Set the flag so that the player can't go down or up from platforms.

          //Reenable the player to go down or up from platforms.
          gameState.opaqueTimeout = setTimeout(function()
          {
            gameState.opaqueBool = false; //Set the flag so that the player can go down or up from platforms again.

            //Get the index of the opaque debuff in the list of UI indicators.
            var index = gameState.activeBuffDebuff.map(function(bD) { return bD.type; }).indexOf(5)
    
            //Shift everything behind the specific element to left. If the image is the last on the list, it does not shift anything.
            if(index < gameState.activeBuffDebuff.length-1)
            {
              for(var i = index+1; i < gameState.activeBuffDebuff.length; i++)
              {
                gameState.activeBuffDebuff[i].x = (gameState.activeBuffDebuff[i].x - 50);
              }
            }
            gameState.activeBuffDebuff.splice(index, 1)[0].destroy();     //Remove from array of active buffs and debuffs and destroy it
          }, 5000)
      }

      if(buffDebuff.type <= 2)
      {
        gameState.buff.play();    //Play the sound if player get buff item
      }
      else
      {
        gameState.debuff.play();    //Play the sound if player get debuff item
      }

      buffDebuff.destroy();   //destroy the buff or debuff item after player touch it
    })
    
    gameState.countDownTimeout = setTimeout(function(){gameState.self.countDownFunction()}, 1000); //Set the countdown function. This function will reduce the number for the countdown by 1 every second.
    gameState.cursors = this.input.keyboard.createCursorKeys(); //Cursors for input.
    
    //when the window tab is not active stop the game (Timeouts and Intervals), if active resume the game
    document.addEventListener('visibilitychange', function() {
        if(document.hidden)
        {
          if(!gameState.countedDown)
          {
            clearTimeout(gameState.countDownTimeout);
          }
          else
          {
            clearTimeout(gameState.spawnIntervalFuncWallInternal);
            clearTimeout(gameState.spawnIntervalFuncWall);
            clearInterval(gameState.spawnIntervalFuncPlatform); 
            clearTimeout(gameState.spawnWallTimerDecreaseInternal);
            clearTimeout(gameState.spawnWallTimerDecrease);
            
        
          }
        }
        else
        {
          if(!gameState.countedDown)
          {
            gameState.countDownTimeout = setTimeout(function(){gameState.self.countDownFunction()}, 1000);

          }
          else
          {
            gameState.spawnIntervalFuncWallInternal;
            gameState.spawnIntervalFuncWall = setTimeout(function(){gameState.self.spawnWall()}, gameState.wallSpawnTimer);   //spawn wall based on the timer
            gameState.spawnIntervalFuncPlatform = setInterval(function() {gameState.self.spawnPlatform()}, 2000);   //spawn platform every 2 seconds
            gameState.spawnWallTimerDecreaseInternal;
            gameState.spawnWallTimerDecrease = setTimeout(function() {gameState.self.decreaseSpawnTimer()}, 1000);    //decrease the timer of the spawn wall every 1 second
        
          }
        }
      });

  }

  /**
  * CREATING ANIMATIONS
  */
  createAllAnims()
  {
    //Animation of platform glowing from green to red
    this.anims.create( {
      key: 'gravityChangePlatform',
      frames: this.anims.generateFrameNumbers( 'platform',{ start: 0, end: 3 }),
      frameRate: 10
    } );

    //Animation of wall
    this.anims.create( {
      key: 'wallAnim',
      frames: this.anims.generateFrameNumbers( 'wall',{frames: [0,1]}),
      frameRate: 10,
      repeat: -1
    } );

    //Animation of buff: no collide shining
    this.anims.create( 
      {
        key: 'noCollideShine',
        frames: this.anims.generateFrameNumbers( 'noCollide',{ start: 0, end: 6 }),
        frameRate: 10,
      });

    //Animation of buff: no collide not shining
    this.anims.create( 
      {
        key: 'noCollideStill',
        frames: this.anims.generateFrameNumbers( 'noCollide',{frames: [0]}),
        frameRate: 10,
      });

    //Animation of buff: double jump shining
    this.anims.create( 
      {
        key: 'doubleJumpShine',
        frames: this.anims.generateFrameNumbers( 'doubleJump',{ start: 0, end: 6 }),
        frameRate: 10,
      });

    //Animation of buff: double jump not shining
    this.anims.create( 
      {
        key: 'doubleJumpStill',
        frames: this.anims.generateFrameNumbers( 'doubleJump',{frames: [0]}),
        frameRate: 10,
      });

    //Animation of buff: dash shining
    this.anims.create( 
      {
        key: 'dashShine',
        frames: this.anims.generateFrameNumbers( 'dash',{ start: 0, end: 6 }),
        frameRate: 10,
      });

      //Animation of buff: dash not shining
      this.anims.create( 
        {
          key: 'dashStill',
          frames: this.anims.generateFrameNumbers( 'dash',{frames: [0]}),
          frameRate: 10,
        });

    //Animation of floor and ceiling glowing from green to red
    this.anims.create( 
      {
        key: 'floorCeilingChange',
        frames: this.anims.generateFrameNumbers( 'floorCeiling',{frames: [0, 1, 2, 3]}),
        frameRate: 10,
      });

    //Animation of the ball glowing from blue to red.
    this.anims.create( {
      key: 'playerAnim',
      frames: this.anims.generateFrameNumbers( 'player',{ start: 0, end: 3 }),
      frameRate: 10
    } );
  }

  /**
  * BALL BLINKING FUNCTION
  */
  //This will cause the player to blink by toggling the opacity from the Timeout function
  playerBlink()
  {
    if(gameState.player.alpha <= 0.5) //if translucent, turn to opaque
    {
      gameState.player.setAlpha(1);
    }
    else // if opaque, turn translucent
    {
      gameState.player.setAlpha(0.5);
    }

  }

  /**
  *  SPAWNING WALLS
  */
  spawnWall()
  {
    var self = this; //Get reference to the scene object
    var intersect = true;   //Variable to check is objects intersect.
    var counter = 0;    //Variable to count the loop has been done how many times

    // While the wall spawn and is intersect with any other obstacle, respawn the wall at different location for maximum 11 times (counter start from 0, a limit is set to prevent an infinite loop)
    while(intersect && counter <= 10)
    {
      intersect = false; //Initially there is no intersect
      var wall = gameState.walls.create(window.innerWidth + 50, Math.random()*window.innerHeight, 'wall').setScale(1, 0.99); //Create the wall first so the reference can be used.

      // If player did not get a speed up debuff, speed is normal; else the speed is higher
      if(!gameState.speedUpBool)
      {
        wall.setVelocityX(-500);
      }
      else
      {
        wall.setVelocityX(-700);
      }
      wall.setGravityY(config.physics.arcade.gravity.y * -1) //Wall is unaffected by gravity
      wall.setImmovable(true);    //Wall cannot be moved while collisions with other bodies
      gameState.platforms.getChildren().forEach(function(platform)
      {
        //To check whether this wall intersects with any platforms. If it intersects, destroy the wall and respawn the wall.
        if(Phaser.Geom.Intersects.RectangleToRectangle(platform.getBounds(), wall.getBounds()))
        {
          intersect = true;
          wall.destroy();
        }
      });
      counter++;
    }
    gameState.spawnIntervalFuncWallInternal = setTimeout(function() {self.spawnWall()}, gameState.wallSpawnTimer); //Reset the Timeout function so the next wall can spawned after the next time step.
    
  }

  /**
  * SPAWNING PLATFORMS
  */
  spawnPlatform()
  {
    var randomBuffDebuffSpawn = Math.random();    //Random generate a number between 0 <= x < 1 to determine if a buff or debuff is spawned
    var randomWhichBuffDebuff =  Math.floor(Math.random()*6);   //Random generate a number between 0 <= x < 6 to determine which buff or debuff is spawned
    var intersect = true; //Variable to check is objects intersect.
    var counter = 0; //Variable to count the loop has been done how many times

    // While the platform spawns and intersects with any other obstacle, respawn the platform at different location for maximum 11 times (counter start from 0, a limit is set to prevent an infinite loop)
    while(intersect && counter <= 10)
    {
      intersect = false; //Initially there is no intersect
      var random = Math.floor(Math.random()*(window.innerHeight-400));    //generate a random Y position for the platform
      var platform = gameState.platforms.create(window.innerWidth + 250, random+200, 'platform').setDepth(1); //Create the platform first so the reference can be used.

      // if gravity is down
      if(gameState.checkGravity === true)
      {
        platform.anims.playReverse('gravityChangePlatform', true);    //Reverse play the animation of the platform, from red to green
        platform.anims.setProgress(1-gameState.universalFrame);   //Set the progress of the animation to synchronize all the animation. Universal frame is used for all sprites who needs to change colours.
        platform.body.checkCollision.down = false;    //Player would not collide with the bottom part of the platform
      }
      // if gravity is up
      else
      {
        platform.anims.play('gravityChangePlatform', true);   //Play the animation of the platform, from green to red
        platform.anims.setProgress(gameState.universalFrame);     //Set the progress of the animation to synchronize all the animation. Universal frame is used for all sprites who needs to change colours.
        platform.body.checkCollision.up = false;     //Player would not collide with the top part of the platform
      }
        platform.body.checkCollision.left = false;    //Player would not collide with the left part of the platform
        platform.body.checkCollision.right = false;   //Player would not collide with the right part of the platform

        // If player did not get a speed up debuff, speed is normal; else the speed will be higher
        if(!gameState.speedUpBool)
        {
          platform.setVelocityX(-500);
        }
        else
        {
          platform.setVelocityX(-700);
        }
        platform.setGravityY(config.physics.arcade.gravity.y * -1) //Platform is unaffected by gravity
        platform.setImmovable(true);    //Platform cannot be move while collisions with other bodies
        gameState.walls.getChildren().forEach(function(wall)
        {
          //To check whether platform is intersect with wall or not. If it does, destroy the platform and respawn it.
          if(Phaser.Geom.Intersects.RectangleToRectangle(platform.getBounds(), wall.getBounds()))
          {
            intersect = true;
            platform.destroy();
          }
        });
        counter++;
        
    }
    
      intersect = true; //Set to true to enter the loop
      var varianceNum; //Variable to determine the left and right position of the buff or debuff on the platform.
      var varianceNum2; // Variable to determine whether the buff or debuff spawns above or below the plaform.

      // The rate to spawn the buff or debuff is 33%. Only spawn if there IS a platform.
      if(randomBuffDebuffSpawn < 0.33 && platform != null)
      {
        //The buff and debuff will keep respawning on the platform as long as it intersects with a wall.
        while(intersect) 
        {
          intersect = false; //Variable to check is objects intersect.
          varianceNum = Math.floor(Math.random()*250) + 1; //Determine the left and right postion of the buff and debuff above or below the platform.
          varianceNum *= Math.round(Math.random()) ? 1 : -1; // Whether the position is to the left or to the right.
          varianceNum2  = Math.round(Math.random()) ? 1 : -1; //Whether the position is above or below the platform.

          //If buff: dash
          if(randomWhichBuffDebuff === 0)
          {
            //spawn the buff item
            var buffDebuff = gameState.buffDebuffs.create(platform.x + varianceNum, platform.y + 90 * varianceNum2, 'dash').setScale(0.5,0.5);
            buffDebuff.setVelocityX(-500);
            buffDebuff.setGravityY(config.physics.arcade.gravity.y * -1)
            buffDebuff.setImmovable(true);
            buffDebuff.type = 0;
          }
          //If buff: double jump
          else if(randomWhichBuffDebuff === 1)
          {
            //spawn the buff item
            var buffDebuff = gameState.buffDebuffs.create(platform.x + varianceNum, platform.y + 90 * varianceNum2, 'doubleJump').setScale(0.5,0.5);
            buffDebuff.type = 1; //Used to determine which buff or debuff was invoked when collided.
          }
          //If buff: no collide
          else if(randomWhichBuffDebuff === 2)
          {
            //spawn the buff item
            var buffDebuff = gameState.buffDebuffs.create(platform.x + varianceNum, platform.y + 90 * varianceNum2, 'noCollide').setScale(0.5,0.5);
            buffDebuff.type = 2; //Used to determine which buff or debuff was invoked when collided.
          }
          //If debuff: no jump
          else if(randomWhichBuffDebuff === 3)
          {
            //spawn the buff item
            var buffDebuff = gameState.buffDebuffs.create(platform.x + varianceNum, platform.y + 90 * varianceNum2, 'noJump').setScale(0.5,0.5);
            buffDebuff.type = 3; //Used to determine which buff or debuff was invoked when collided.
          }
          //If debuff: speed up
          else if(randomWhichBuffDebuff === 4)
          {
            //spawn the buff item
            var buffDebuff = gameState.buffDebuffs.create(platform.x + varianceNum, platform.y + 90 * varianceNum2, 'speedUp').setScale(0.5,0.5);
            buffDebuff.type = 4; //Used to determine which buff or debuff was invoked when collided.
          }
          //If debuff: opaque
          else if(randomWhichBuffDebuff === 5)
          {
            //spawn the buff item
            var buffDebuff = gameState.buffDebuffs.create(platform.x + varianceNum, platform.y + 90 * varianceNum2, 'opaque').setScale(0.5,0.5);
            buffDebuff.type = 5; //Used to determine which buff or debuff was invoked when collided.
          }

          // If player did not get a speed up debuff, speed is normal; else the speed will be higher
          if(!gameState.speedUpBool)
          {
            buffDebuff.setVelocityX(-500);
          }
          else
          {
            buffDebuff.setVelocityX(-700);
          }

          // play the animation of dash item
          if(buffDebuff.type == 0)
          {
            buffDebuff.anims.play('dashShine',true); //Make the buff shine
            //After shining
            buffDebuff.on(Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE + 'dashShine', function()
            {
              //Play a still image of the buff if the buff is not consumed or despawned
              if(buffDebuff != null && buffDebuff.active != false)
              {
                buffDebuff.anims.play('dashStill',true);
                //After a random time, shine again.
                setTimeout(function()
                {
                  if(buffDebuff != null && buffDebuff.active != false)
                  {
                    buffDebuff.play('dashShine');

                  }
                }, Math.random() * 1000 + 500);
              }
            }, this);
          }
          // play the animation of double jump item
          else if(buffDebuff.type == 1)
          {
            buffDebuff.anims.play('doubleJumpShine',true) //Make the buff shine
            //After shining
            buffDebuff.on(Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE + 'doubleJumpShine', function()
            {
              //Play a still image of the buff if the buff is not consumed or despawned
              if(buffDebuff != null && buffDebuff.active != false)
              {
                buffDebuff.anims.play('doubleJumpStill',true);
                //After a random time, shine again.
                setTimeout(function()
                {
                  
                  if(buffDebuff != null && buffDebuff.active != false)
                  {
                    buffDebuff.play('doubleJumpShine');

                  }
                }, Math.random() * 1000 + 500);
              }
            }, this);
          }
          // play the animation of double jump item
          else if(buffDebuff.type == 2)
          {
            buffDebuff.anims.play('noCollideShine',true) //Make the buff shine
            //After shining
            buffDebuff.on(Phaser.Animations.Events.SPRITE_ANIMATION_KEY_COMPLETE + 'noCollideShine', function()
            {
              //Play a still image of the buff if the buff is not consumed or despawned
              if(buffDebuff != null && buffDebuff.active != false)
              {
                buffDebuff.anims.play('noCollideStill',true);
                //After a random time, shine again.
                setTimeout(function()
                {
                  
                  if(buffDebuff != null && buffDebuff.active != false)
                  {
                    buffDebuff.play('noCollideShine');

                  }
                }, Math.random() * 1000 + 500);
              }
            }, this);
          }

          buffDebuff.setGravityY(config.physics.arcade.gravity.y * -1)
          buffDebuff.setImmovable(true);
          gameState.walls.getChildren().forEach(function(wall)
          {
            //To check whether buff or debuff item is intersect with wall or not, if they intersect, destroy the buff or debuff and respawn it in another location.
            if(Phaser.Geom.Intersects.RectangleToRectangle(buffDebuff.getBounds(), wall.getBounds()))
            {
              intersect = true;
              buffDebuff.destroy();
            }
          })
        }
      }
      
  }

  /**
  * FUNCTION TO DO COUNTDOWN
  */
  countDownFunction()
  {
      var self = this; //Establish reference to scene object.
      if(gameState.countDownNum > 0) //As long as the countdown number is more than 0, continue decreasing by 1 every second.
      {
        gameState.countDownNum -= 1;
        setTimeout(function(){self.countDownFunction()}, 1000)
      }
  }


/**
* WALL SPAWN INTERVAL TIME STEP DECREASE
*/
decreaseSpawnTimer()
{
  var self = this; //Establish reference to scene object.

  //If the value is below 1200, fix the value to 1200. The shortest time between wall spawn is 1.2 seconds.
  if(gameState.wallSpawnTimer <= 1200)
  {
    gameState.wallSpawnTimer = 1200;
  }
  else//Decrease the value every 1 second
  {
    gameState.wallSpawnTimer = gameState.wallSpawnTimer - 25; //As time goes, walls will be spawned quicker.
    //After decrement, set a timeout function so it decreases again after 1 second.
    gameState.spawnWallTimerDecreaseInternal = setTimeout(function(){
      self.decreaseSpawnTimer(); 
    }, 1000); 
  }
}

update() {

    //Part of the update if the game hasn't finished the countdown.
    if(!gameState.countedDown)
    {
      gameState.countDownText.setText('' + gameState.countDownNum); //Update the countdown text every time step.
    }
    //if the game is playing and after the countdown
    if(gameState.active && gameState.countedDown){
      gameState.text.setText('Score: ' + gameState.score);    //diaplay the score of the player
      gameState.player.angle += gameState.angleDelta; //Rotate the player
      gameState.angleDelta = 10; //Reset the amount by which the player is rotated.
      if(gameState.platforms.getLength() > 0) //Get the first reference of a platform and that will be a point of reference for which all objects that change lights will be synchronised.
      {
        gameState.universalFrame = gameState.platforms.getFirstAlive().anims.currentFrame.progress;
      }
      gameState.score++; //Increase the score every timestep.
      gameState.walls.getChildren().forEach(function(wall)
        {
          //play the animation of the wall
          wall.anims.play('wallAnim', true);
        });
      
      //Limit the player so that it cannot move over half of the screen
      if(gameState.player.x >= 700)
      {
        gameState.player.setX(700);
        gameState.player.setVelocityX(0);
      }

      //If player press spacebar
      if(Phaser.Input.Keyboard.JustDown(gameState.spacebar)){
        //If gravity down and times of player jump is less than maximum jump times limit, player jumps up
        if(gameState.checkGravity &&  gameState.jumpcount < gameState.maxJump)
        {
          gameState.player.setVelocityY(-900); //Jump speed
          gameState.jumpcount += 1; //Player jumped once
          gameState.jump.play();    //play the jump sound effect
        }
        //If gravity up and times of player jump is less than maximum jump times limit, player jumps down
        else if (!gameState.checkGravity && gameState.jumpcount < gameState.maxJump)
        {
          gameState.player.setVelocityY(900); //Jump speed
          gameState.jumpcount += 1; //Player jumped once
          gameState.jump.play(); //play the jump sound effect
        }
      }

      //To detect player is in the mid air or not
      if(gameState.player.body.velocity.y > 0 || gameState.player.body.velocity.y < 0)
      {
        if(gameState.jumpcount < 2)
        {
          gameState.jumpcount = 1;    //Diasble the jump feature while player is in the mid air unless player has double jump
        }
      }

      //If gravity is down and down part of player body touching something and player not in the mid air
      if(gameState.checkGravity && gameState.player.body.touching.down && gameState.player.body.velocity.y >= 0){
        gameState.jumpcount = 0;    //Reset the jump count so that player can jump again
      }
      //If gravity is up and top part of player body touching something and player not in the mid air
      else if(!gameState.checkGravity && gameState.player.body.touching.up && gameState.player.body.velocity.y <= 0 )
      {
        gameState.jumpcount = 0; //Reset the jump count so that player can jump again
      }

      //If player press up key and gravity is down, change gravity so that it goes up
      if(Phaser.Input.Keyboard.JustDown(gameState.upKey) && gameState.checkGravity){
        /**stop the previous animation and play the new animation */
        gameState.player.anims.stop(); 
        gameState.player.anims.play('playerAnim', true); //Player turns from blue to red
        gameState.floor.anims.stop();
        gameState.floor.anims.play('floorCeilingChange', true);  //Floor turns from green to red
        gameState.floor.anims.setProgress(gameState.universalFrame); //Set the progress of the animation to synchronize all the animation. Universal frame is used for all spirtes who needs to change colours.

        gameState.backFloor.anims.stop();
        gameState.backFloor.anims.play('floorCeilingChange', true); //Floor turns from green to red
        gameState.backFloor.anims.setProgress(gameState.universalFrame);//Set the progress of the animation to synchronize all the animation. Universal frame is used for all spirtes who needs to change colours.
 
        gameState.ceiling.anims.stop();
        gameState.ceiling.anims.play('floorCeilingChange', true); //Ceiling turns from green to red
        gameState.ceiling.anims.setProgress(gameState.universalFrame); //Set the progress of the animation to synchronize all the animation. Universal frame is used for all spirtes who needs to change colours.

        gameState.backCeiling.anims.stop();
        gameState.backCeiling.anims.play('floorCeilingChange', true); //Ceiling turns from green to red
        gameState.backCeiling.anims.setProgress(gameState.universalFrame); //Set the progress of the animation to synchronize all the animation. Universal frame is used for all spirtes who needs to change colours.

        gameState.player.anims.setProgress(gameState.universalFrame);
        /**stop the previous animation and play the new animation */

        gameState.jumpcount += 1;   //while player change gravity, player cannot jump
        gameState.checkGravity = false; //Gravity is now going up
        gameState.player.setGravityY(config.physics.arcade.gravity.y * -2);   //Change the player gravity to up
        gameState.platforms.getChildren().forEach(function(platform)
        {
          platform.anims.stop();    //Stop the previous animation of the platform
          platform.anims.play('gravityChangePlatform', true);   //Platforms turn from green to red.
          platform.anims.setProgress(gameState.universalFrame); //Set the progress of the animation to synchronize all the animation. Universal frame is used for all spirtes who needs to change colours.
          //platforms become collidable from the bottom instead of the top.
          platform.body.checkCollision.up = false;
          platform.body.checkCollision.down = true;
          
        });
      }

      //if player press down key and gravity is up
      if(Phaser.Input.Keyboard.JustDown(gameState.downKey) && !gameState.checkGravity){
        /**stop the previous animation and play the new animation */
        gameState.player.anims.stop();
        gameState.player.anims.playReverse('playerAnim', true); //Player turns from red to green
        gameState.player.anims.setProgress(1-gameState.universalFrame); //Set the progress of the animation to synchronize all the animation. Universal frame is used for all spirtes who needs to change colours.

        gameState.floor.anims.stop();
        gameState.floor.anims.playReverse('floorCeilingChange', true); //Floor turns from red to green
        gameState.floor.anims.setProgress(1-gameState.universalFrame); //Set the progress of the animation to synchronize all the animation. Universal frame is used for all spirtes who needs to change colours.

        gameState.backFloor.anims.stop();
        gameState.backFloor.anims.playReverse('floorCeilingChange', true); //Floor turns from red to green
        gameState.backFloor.anims.setProgress(1-gameState.universalFrame); //Set the progress of the animation to synchronize all the animation. Universal frame is used for all spirtes who needs to change colours.

        gameState.ceiling.anims.stop();
        gameState.ceiling.anims.playReverse('floorCeilingChange', true); //Ceiling turns from red to green
        gameState.ceiling.anims.setProgress(1-gameState.universalFrame); //Set the progress of the animation to synchronize all the animation. Universal frame is used for all spirtes who needs to change colours.

        gameState.backCeiling.anims.stop();
        gameState.backCeiling.anims.playReverse('floorCeilingChange', true); //Ceiling turns from red to green
        gameState.backCeiling.anims.setProgress(1-gameState.universalFrame); //Set the progress of the animation to synchronize all the animation. Universal frame is used for all spirtes who needs to change colours.
        /**stop the previous animation and play the new animation */

        gameState.jumpcount += 1;
        gameState.player.setGravityY(0);    //Change the player gravity to down
        gameState.checkGravity = true; //Gravity is now going down
        gameState.platforms.getChildren().forEach(function(platform)
        {
          platform.anims.stop();    //stop the previous animation of the platform
          platform.anims.playReverse('gravityChangePlatform', true);   //Platforms turn from red to green.
          platform.anims.setProgress(1-gameState.universalFrame); //Set the progress of the animation to synchronize all the animation. Universal frame is used for all spirtes who needs to change colours.
          //platforms become collidable from the top instead of the bottom.
          platform.body.checkCollision.up = true;
          platform.body.checkCollision.down = false;
        });
      }

      //if player hold Z key
      if(gameState.zKey.isDown && !gameState.opaqueBool)
      {
        gameState.platforms.getChildren().forEach(function(platform)
        {
          //player can pass through the platform
          platform.body.checkCollision.up = false;
          platform.body.checkCollision.down = false;
          
        });
      }
      //if player release Z key
      if(Phaser.Input.Keyboard.JustUp(gameState.zKey))
      {
        gameState.platforms.getChildren().forEach(function(platform)
        {
          //Platform turn back to normal and can be collidable again.
          if(gameState.checkGravity)
          {
            platform.body.checkCollision.up = true;
            platform.body.checkCollision.down = false;
          }
          else
          {
            platform.body.checkCollision.up = false;
            platform.body.checkCollision.down = true;
          }
        });
      }
      
      // if player disappears into the left side of the screen
      if(gameState.player.x < -50)
      {
        gameState.player.destroy();
        gameState.active = false;   //Game over
        gameState.backgroundMusic.stop();   //Stop the background music
        gameState.gameOver.play();    //Play the game over music
        gameState.gameOverText.setText('GAME OVER \n Please click SPACEBAR to \n restart the game');    //Set the game over text
      }

    }

    gameState.platforms.getChildren().forEach(function(platform)
    { 
      //If platform disappear from the screen, destroy the platform
      if(platform.x < -250)
      {
        platform.destroy();
      }
    });

    
    gameState.walls.getChildren().forEach(function(wall)
    { 
      //If wall disappear from the screen, destroy the wall
      if(wall.x < -50)
      {
        wall.destroy();
      }
    });


    /*POINT A*/
    //Checks if the floor, ceiling and each layer of background reaches the end of the screen to the left. 
    //If they reach the end, it will loop to the end of the screen to the right, creating a loop and infinite floor, ceiling and each layer of background
    if(gameState.floor.x <= -window.innerWidth)
    {
      gameState.floor.x = window.innerWidth;
    }
    if(gameState.backFloor.x <= -window.innerWidth)
    {
      gameState.backFloor.x = window.innerWidth;
    }
    if(gameState.ceiling.x <= -window.innerWidth)
    {
      gameState.ceiling.x = window.innerWidth;
    }
    if(gameState.backCeiling.x <= -window.innerWidth)
    {
      gameState.backCeiling.x = window.innerWidth;
    }
    if(gameState.backProps.x <= -window.innerWidth)
    {
      gameState.backProps.x = window.innerWidth;
    }
    if(gameState.backBackProps.x <= -window.innerWidth)
    {
      gameState.backBackProps.x = window.innerWidth;
    }
    if(gameState.middleProps.x <= -window.innerWidth)
    {
      gameState.middleProps.x = window.innerWidth;
    }
    if(gameState.backMiddleProps.x <= -window.innerWidth)
    {
      gameState.backMiddleProps.x = window.innerWidth;
    }
    if(gameState.frontProps.x <= -window.innerWidth)
    {
      gameState.frontProps.x = window.innerWidth;
    }
    if(gameState.backFrontProps.x <= -window.innerWidth)
    {
      gameState.backFrontProps.x = window.innerWidth;
    }
    if(gameState.mostFrontProps.x <= -window.innerWidth)
    {
      gameState.mostFrontProps.x = window.innerWidth;
    }
    if(gameState.backMostFrontProps.x <= -window.innerWidth)
    {
      gameState.backMostFrontProps.x = window.innerWidth;
    }
    

    //If game over
    if(!gameState.active)
    {
      //if player press spacebar, restart the game and clear out all Timeout and Interval functions.
      if(Phaser.Input.Keyboard.JustDown(gameState.spacebar))
      {
        clearTimeout(gameState.spawnIntervalFuncWall);
        clearTimeout(gameState.spawnIntervalFuncWallInternal);
        clearInterval(gameState.spawnIntervalFuncPlatform);
        clearTimeout(gameState.spawnWallTimerDecrease);
        clearTimeout(gameState.spawnWallTimerDecreaseInternal);
        clearTimeout(gameState.dashTimeout);
        clearTimeout(gameState.doubleJumpTimeout);
        clearTimeout(gameState.noCollideTimeout);
        clearTimeout(gameState.noCollideTimeout2);
        clearInterval(gameState.intervalRef);
        clearTimeout(gameState.speedUpTimeout);
        clearTimeout(gameState.noJumpTimeout);
        clearTimeout(gameState.opaqueTimeout);
        gameState.active = true;
        this.scene.restart(this);
      }
    }


    //Only invoked once after the countdown is done
    if(gameState.countDownNum <= 0 && !gameState.countedDown)
    {
      //All the Timeout and Interval functions are set here to spawn the wall, platforms and to make the spawning of the wall faster.
      gameState.spawnIntervalFuncWallInternal;
      gameState.spawnIntervalFuncWall = setTimeout(function(){gameState.self.spawnWall()}, gameState.wallSpawnTimer);   //spawn wall based on the timer
      gameState.spawnIntervalFuncPlatform = setInterval(function() {gameState.self.spawnPlatform()}, 2000);   //spawn platform every 2 seconds
      gameState.spawnWallTimerDecreaseInternal;
      gameState.spawnWallTimerDecrease = setTimeout(function() {gameState.self.decreaseSpawnTimer()}, 1000);    //decrease the timer of the spawn wall every 1 second
      

      /*Set different velocity for each layer of background to achieve parallax background*/
      gameState.backProps.setVelocityX(-50);
      gameState.backBackProps.setVelocityX(-50)
      gameState.middleProps.setVelocityX(-100)
      gameState.backMiddleProps.setVelocityX(-100)
      gameState.frontProps .setVelocityX(-200)
      gameState.backFrontProps.setVelocityX(-200) 
      gameState.mostFrontProps.setVelocityX(-400);
      gameState.backMostFrontProps.setVelocityX(-400);
      /*Set different velocity for each layer of background to achieve parallax background*/

      //Player now reacts to gravity and the floor and ceiling moves.
      gameState.player.setGravityY(0);
      gameState.floor.setVelocityX(-500);
      gameState.backFloor.setVelocityX(-500);
      gameState.ceiling.setVelocityX(-500);
      gameState.backCeiling.setVelocityX(-500);

      

      clearTimeout(gameState.countDownTimeout); //The countdown stops and the number isn't decreased further.
      gameState.countDownText.destroy(); //The countdown text disappears
      gameState.countedDown = true; //Flag to ensure this section of the code does not run anymore.
    }
  }
}

