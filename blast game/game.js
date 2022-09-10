import Menu from './assets/classes/Menu.js'
import PlayScene from './assets/classes/PlayScene.js'

let config = {
    type : Phaser.AUTO,
    width : 1280*3,
    height : 720*3,
    scale : {
        mode : Phaser.Scale.FIT,
        autoCenter : Phaser.Scale.CENTER_BOTH
    },
    backgroundColor : 0x2b1c70,
    scene : [Menu, PlayScene],
}


let storageData = localStorage.getItem("blast");
    
if(storageData) storageData = JSON.parse(storageData);
else storageData = {};

const Game = new Phaser.Game(config);
Game.data = storageData;
      
Game.saveUserData = function(){
localStorage.setItem(
    "blast",
    JSON.stringify(Game.data)
    );
};
