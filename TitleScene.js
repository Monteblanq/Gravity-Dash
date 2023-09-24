/*
Creator Name #1 : Neo Zhi Ming
Creator Name #2 : Sia Jing Hui
*/

//This scene consists of the game title and a prompt to press any key to continue.
class TitleScene extends Phaser.Scene {
    constructor() {
      super({ key: 'TitleScene' })
    }
  
    //preload necessary assets
    preload() {
      this.load.image('titleScreen', 'images/Titlescreen.png');
    }
  
    create() {
      
      var textBlinkInterval; //Interval variable to store the text blinking interval. This reference is created to stop the interval when needed.
      var fadeInComplete = false; //Flag to check if the fade-in has been completed.
      var gameStart = false; //Flag to check if a key has been pressed to start the game.
      var self = this; //Reference to the scene.
      const style1 = { fontSize: "40px" , fill: "	#FFFFFF" , fontFamily: "FF"};   //style for the text prompt
      var text = this.add.text(window.innerWidth/2, window.innerHeight/2 + 200, 'Press any key to start', style1).setDepth(2).setOrigin(0.5,0.5); //Text object for the prompt. It is placed in the middle of the screen.
    
      this.cameras.main.once('camerafadeoutcomplete', function(camera) //Change scenes after fading out
      {
        self.scene.stop('TitleScene'); //Stop current scene and
        self.scene.start('GameScene'); //Starts the game scene.
      });
      
      this.cameras.main.once('camerafadeincomplete', function(camera) //Sets the fade in flad to true if it has finished fading in.
      {
          fadeInComplete = true;
      });
      const screen = this.add.image(window.innerWidth/2, window.innerHeight/2-50, 'titleScreen').setOrigin(0.5,0.5).setScale(0.7,0.7); //Image object for the title logo. It is placed in the center of the screen, above the text.
      this.cameras.main.fadeIn(3000); // Fade in when the game starts.

      
      // on keypress any, transition to GameScene
      this.input.keyboard.on('keydown', () => {
        if(!gameStart && fadeInComplete) //Only allow key press if the game is not starting and if the fade in has been completed.
        {
          clearInterval(textBlinkInterval); //Clears the blinking interval function so that the text stops blinking
          text.setAlpha(1); //Set the text to opaque after text is pressed.
          this.cameras.main.fadeOut(3000) //Fade out to change scenes
          gameStart = true; //Set the game starting flag to true so the player can't constantly press keys.
        }
      });

      textBlinkInterval = setInterval(function(){self.textBlink(text)}, 500); //A function that periodically runs the blinking function every 0.5 seconds on the text.
    }
    
    
    //Function to make the text blink.
    textBlink(text)
    {
      if(text.alpha < 1) //If invisible, turn to opaque
      {
        text.setAlpha(1);
      }
      else // If opaque, turn invisible
      {
        text.setAlpha(0);
      }

    }
}

  
  
  