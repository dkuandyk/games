
export default class Tile
{
    
    constructor (scene, x, y)
    {
        this.scene = scene;

        //позиция тайла на поле
        this.gridPosX=x;
        this.gridPosY=y;

        //тип тайла, нормальный или бласт
        this.type='normal';

        //все возможные цвета
        let colors = [0xff0000, 0xf6ff00, 0x00ff3c, 0x1500ff, 0xff00dd];

        //выбираем цвет для этого тайла, случайно
        this.color = colors[Math.floor(colors.length*Math.random())];
        
        //добавляем спрайт в сцену
        this.sprite=scene.add.sprite(x, y, 'tile')
            .setTint(this.color)
            .on('animationcomplete', () => {
                //убираем спрайт из сцены, когда анимация сжтгания завершилась
                this.sprite.destroy();
            })
            .setScale(0);

        //анимация появления тайла
        this.scene.tweens.add({
            targets:this.sprite,
            scaleX:1,
            scaleY:1,
            duration:300,
            ease:'Linear'
        });

        //создаем анимаию сжигания тайла
        scene.anims.create({
            key: "burn",
            frameRate: 20,
            frames: scene.anims.generateFrameNumbers("tile", { start: 0, end: 5 }),
        });
    }

    makeTileBlast()
    {
        //делаем из обычного тайла бласт тайл
        this.type = 'blast';
        this.color = 0x6effee;
        this.sprite
            .setTint(this.color)
            .setScale(0);
        
        //эффект уип уип для бласт тайла
        this.scene.tweens.add({
            targets:this.sprite,
            scaleX:1,
            scaleY:1,
            duration:300,
            ease:'Linear',
            onComplete:() =>{
                this.scene.tweens.add({
                    targets:this.sprite,
                    scaleX:1.1,
                    scaleY:1.1,
                    duration:3000,
                    ease:'Elastic.Out',
                    yoyo:true,
                    repeat:-1,
                });
            }
        });  
    }

    setGridPos(x, y)
    {
        //обновляем позицию тайла на поле
        this.gridPosX=x;
        this.gridPosY=y;
    }


    burn ()
    {
        //запускаем анимацию сжигания тайла
        this.sprite
            .play('burn')
            .setTint(20)
            .setDepth(10)
            .disableInteractive();
        //слегка увеличиваем размер тайла
        this.scene.tweens.add({
            targets:this.sprite,
            alpha:0,
            scaleX:1.4,
            scaleY:1.4,
            duration:500,
            ease:'Linear'
        });
    }

    moveTo(x, y)
    {
        //двигаем тайл в x, y
        this.scene.tweens.add({
            targets:this.sprite,
            x:x,
            y:y,
            duration:300,
            ease:'Quart.Out'
        });
    }

}