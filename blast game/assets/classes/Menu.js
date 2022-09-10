import Button from './Button.js'

export default class Menu extends Phaser.Scene
{
    
    constructor ()
    {
        super('Menu');
    }

    init ()
    {
    }

    preload ()
    {
        this.load.spritesheet('tile', 'assets/sprites/tileSpritesheet.png', {frameWidth: 171, frameHeight: 192});
        
        this.load.image('grid', 'assets/sprites/grid.png');
        this.load.image('panel', 'assets/sprites/panel.png');
        this.load.image('button', 'assets/sprites/button.png');
        this.load.image('menu', 'assets/sprites/menu.png');
        this.load.image('info', 'assets/sprites/info.png');
        this.load.image('startBg', 'assets/sprites/startBg.png');

        this.load.audio('click', 'assets/sounds/click1.mp3');
        this.load.audio('click2', 'assets/sounds/click2.mp3');
        this.load.audio('click3', 'assets/sounds/click3.mp3');
        this.load.audio('win', 'assets/sounds/win.ogg');
        this.load.audio('lost', 'assets/sounds/lost.ogg');
        this.load.audio('tilesCollected', 'assets/sounds/tilesCollected.ogg');
        this.load.audio('manyTilesCollected', 'assets/sounds/manyTilesCollected.ogg');
        this.load.audio('muse', 'assets/sounds/muse.ogg');
        this.load.audio('blast', 'assets/sounds/blast.wav');
    }

    create ()
    {
        //центрируем камеру в центре
        this.cameras.main.centerOn(0, 0);

        //текст Blast Game
        this.add.image(0, -300, 'startBg');

        //создаем звуки в этой сцене
        this.sounds={
            click:this.sound.add("click",{volume:1,}),
            music : this.sound.add('muse', {volume:1, loop:true}),
        };
        
        //останавливаем звуковой баг(когда прыгаем из сцены в сцену, звуки не останавливаются)
        this.game.sound.stopAll();
        
        //музыка в игре
        this.sounds.music.play();

        //кнопка play
        this.shuffleButton = new Button(this, 0, 300, () => {
            this.scene.start('PlayScene');
        }, 'button', 'Играть!');
    }

    update ()
    {

    }
}


