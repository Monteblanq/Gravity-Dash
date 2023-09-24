/*
Creator Name #1 : Neo Zhi Ming
Creator Name #2 : Sia Jing Hui
*/

//This is where the global settings are written.
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,   //set width of the game so that it fills the whole browser window
    height: window.innerHeight,   //set height of the game so that it fills the whole browser window
    fps: {target: 60},
    backgroundColor: "#000000", //black background
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 1000 },   //set global gravity to 1000
        enableBody: true,  
      }
    },

    scene: [TitleScene, GameScene]
  };
  
  const game = new Phaser.Game(config);