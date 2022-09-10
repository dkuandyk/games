import Grid from './Grid.js'
import Panel from './Panel.js'
import Button from './Button.js'
import Info from './Info.js'
import {shuffle} from './functions.js'

export default class PlayScene extends Phaser.Scene
{
    
    constructor ()
    {
        super("PlayScene");
    }

    init ()
    {
        //параметры внутри игры, очки, количество ходов, количество перемешиваний
        this.score = 0;
        this.stepsLeft = 10;
        this.shufflesLeft = 3;
    }

    preload ()
    {
       
    }

    create ()
    {
        //центрируем камеру в центре
        this.cameras.main.centerOn(0, 0);
        
        //создаём звуки
        this.createSounds();

        //создаем игровое поле и панельку с информацией
        this.grid = new Grid(this, -700, 0, 8, 8);
        this.panel = new Panel(this, 1000, -300, this.stepsLeft, this.score);

        //создаем кнопки выхода в меню и перемешивания
        this.createButtons();
    }

    createSounds()
    {
        //звуки клика на кнопку, музыка и прочее
        this.sounds={
            click : this.sound.add('click', {volume:1,}),
            tilesCollected : this.sound.add("tilesCollected",{volume:1,}),
            manyTilesCollected : this.sound.add("manyTilesCollected",{volume:1,}),
            win : this.sound.add("win",{volume:1,}),
            lost : this.sound.add("lost",{volume:1,}),
            blast : this.sound.add("blast",{volume:1,}),
        };
    }

    createButtons()
    {
        
        //кнопка выхода в меню
        this.menuButton = new Button(this, -1280*3/2+170, -720*3/2+170, () => {
            this.scene.start('Menu');
        }, 'menu');

        

        //кнопка перемешивания. всего перемешиваний 3, как только все попытки использованы, кнопка улетает вправо
        this.shuffleButton = new Button(this, 1000, 550, () => {
            
            //функция кнопки, если есть перемешивания, перемешиваем
            if(this.shufflesLeft > 0)
            {
                //перемешиваем тайлы на поле

                //временный массив, в который будем складывать все наши тайлы
                let temporaryTileStorage = [];
                for(let i = 0; i<this.grid.grid.length; i++)
                {
                    for(let j = 0; j<this.grid.grid[i].length; j++)
                    {
                        temporaryTileStorage.push(this.grid.grid[i][j]);
                    }
                }
                
                //перемешиваем тайлы
                temporaryTileStorage = shuffle(temporaryTileStorage);

                //обновляем поле из временного массива
                for(let i = 0; i<this.grid.grid.length; i++)
                {
                    for(let j = 0; j<this.grid.grid[i].length; j++)
                    {
                        this.grid.grid[i][j]=temporaryTileStorage.pop();
                        this.grid.grid[i][j].setGridPos(i, j);
                        this.grid.grid[i][j].moveTo(this.grid.x-(171+this.grid.padding)*(this.grid.gridXLen/2-1/2)+(171+this.grid.padding)*i,
                        this.grid.y-(192+this.grid.padding)*(this.grid.gridYLen/2-1/2)+(192+this.grid.padding)*j);
                    }
                }

                //отнимаем перемешивания, обновляем текст кнопки
                this.shufflesLeft -= 1;
                this.shuffleButton.setButtonText('Перемешать! x'+String(this.shufflesLeft));

                //если больше не осталось перемешиваний, кнопка улетает
                if(this.shufflesLeft === 0)
                {
                    this.tweens.add({
                        targets:this.shuffleButton.container,
                        x:this.shuffleButton.container.x+3000,
                        duration:700,
                        ease:'Back.In',
                        onComplete:() => {
                            this.shuffleButton.destroy();
                        }
                    });
                }
            }
            }, 'button', 'Перемешать! x'+String(this.shufflesLeft));
    }

    update ()
    {

    }
}


