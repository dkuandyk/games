import Info from './Info.js';
import Tile from './Tile.js'

export default class Grid
{
    
    constructor (scene, x, y, gridXLen, gridYLen)
    {
        this.scene=scene;
        this.x=x;
        this.y=y;
        this.gridXLen=gridXLen;
        this.gridYLen=gridYLen;

        //расстояние между тайлами по горизонтали и вертикали
        this.padding = 23;

        //добавляем картинку поля(прямоугольник) в сцену
        this.image = scene.add.image(x, y, 'grid');

        //двумерный массив, в который кладем тайлы
        this.grid = [...Array(gridXLen)].map(e => Array(gridYLen).fill(null));

        for(let i = 0; i < gridXLen; i++)
        {
            for(let j = 0; j < gridYLen; j++)
            {
                this.addTile(i, j);
            }
        }
    }

    findNeighbors (i, j, color)
    {
        //рекурсивно ищем соседние тайлы, такие, чтобы их цвет совпадал с заданным
        if(this.grid[i][j] !== null)
        {
            if(this.grid[i][j].color === color)
            {
                //добавляем текущи тайл в массив
                let t = this.grid[i][j];
                this.tilesToBurn.push(t);
                this.grid[i][j] = null;

                //если тайл подходит, продлолжаем рекурсивно в 4-х направлениях
                if(i > 0) 
                {
                   this.findNeighbors(i-1, j, color);
                }
                if(i < this.grid.length-1)
                {
                    this.findNeighbors(i+1, j, color);
                }
                if(j > 0)
                {
                    this.findNeighbors(i, j-1, color);
                }
                if(j < this.grid[i].length-1)
                {
                    this.findNeighbors(i, j+1, color);
                }
            }
        }
    }

    fillGrid()
    {
        //заполняем верхний ряд, если он пустой
        for(let i = 0; i < this.grid.length; i++)
        {
            if(this.grid[i][0] === null)
            {
                let t = this.addTile(i, 0);
            }
        }
    }

    makeTilesFall()
    {
        //функция падения тайлов

        //проходимся по двумерному массиву поля слева направо, снизу вверх
        for(let i = 0; i < this.grid.length; i++)
        {
            for(let j = this.grid[i].length-2; j >= 0 ; j--)
            {

                //если в этом место есть тайл, а под ним ничего нет, запускаем процесс падения
                if(this.grid[i][j]!==null && this.grid[i][j+1] === null)
                {

                    //длина падения в клетках. сначала 1, если и дальше будет свободно, увеличим эту длину
                    let fallingLen=1;

                    while(true)
                    {
                        if(j+fallingLen < this.grid[i].length-1)
                        {
                            //если на длине fallingLength под текущим местом свободно,
                            //увеличиваем длину и проверяем дальше

                            if(this.grid[i][j+fallingLen+1]===null)
                            {
                                fallingLen+=1;
                            }
                            //если несвободно, останавливаем цикл
                            else
                            {
                                break;
                            }
                        }
                        //если вышли за пределы поля, останавливаем цикл
                        else
                        {
                            break;
                        }
                    }

                    //перемещаем тайл на длину fallingLength под собой, обновляем значения в массиве поля
                    this.grid[i][j+fallingLen]=this.grid[i][j];
                    this.grid[i][j+fallingLen].setGridPos(i, j+fallingLen);
                    this.grid[i][j]=null;
                    this.grid[i][j+fallingLen].moveTo(this.grid[i][j+fallingLen].sprite.x,
                        this.y-(192+this.padding)*(this.grid[i].length/2-1/2)+(192+this.padding)*(j+fallingLen));
                    
                }
            }
        }
    }

    blast(t)
    {
        //удаляем тайлы в квадрате 5 на 5
        this.scene.sounds.blast.play();

        for(let q = t.gridPosX-2; q < t.gridPosX+3 ; q++)
        {
            for(let w = t.gridPosY-2; w < t.gridPosY+3 ; w++)
            {
                if(q >= 0 && q <this.gridXLen && w >= 0 && w <this.gridYLen)
                {
                    //добавляем тайлы во временное хранилище, откуда затем удалим их
                    let t = this.grid[q][w];
                    this.tilesToBurn.push(t);
                    this.grid[q][w] = null;
                }
            }
        }
        //добавляем очки, обновляем текст информационной панельки
        this.scene.score += this.tilesToBurn.length;
        this.scene.panel.addScore(this.tilesToBurn.length);

        //шаг сделан, отнимаем 1 ход у игрока
        this.scene.stepsLeft -= 1;
        this.scene.panel.moveMade();

        // сжигаем тайлы
        for(let k of this.tilesToBurn)
        {
            k.burn();
        }
    }

    addTile(i, j)
    {
        //добавить тайл на позицию i, j на поле grid
        let t = new Tile(this.scene, this.x-(171+this.padding)*(this.gridXLen/2-1/2)+(171+this.padding)*i,
            this.y-(192+this.padding)*(this.gridYLen/2-1/2)+(192+this.padding)*j);
        t.setGridPos(i, j);
        t.sprite
            .setInteractive() //делаем тайлы интерактивными
            .on('pointerdown', () => {
                //функция, вызываемая при нажатии на тайл срабатывает только если остались ходы
                if(this.scene.stepsLeft > 0)
                {
                    if(t.type === 'blast')
                    {
                        //если у этого тайла цвет бласт тайла, тогда взрываем всё в радиусе 5 на 5

                        //массив, в который будем добавлять претендентов на удаление
                        this.tilesToBurn = [];

                        //взрываем
                        this.blast(t);
                    }
                    else
                    {
                        //если тайл обычный

                        //массив, в который будем добавлять претендентов на удаление
                        this.tilesToBurn = [];

                        //сама рекурсивная функция, в которой и будем добавлять претендентов
                        this.findNeighbors(t.gridPosX, t.gridPosY, t.color);

                        if(this.tilesToBurn.length > 1)
                        {
                            //если соседей одного цвета больше или равно двум, добавляем заработанные очки в score
                            let scoreToAdd = this.tilesToBurn.length;
                            this.scene.score += scoreToAdd;
                            this.scene.panel.addScore(scoreToAdd);

                            //шаг сделан, отнимаем 1 ход у игрока
                            this.scene.stepsLeft -= 1;
                            this.scene.panel.moveMade();

                            // сжигаем тайлы
                            for(let k of this.tilesToBurn)
                            {
                                if(k != t)//если тайл не равен текущему, поа что оставляем его несожженным
                                {
                                    k.burn();
                                }
                                else
                                {
                                    //если этот тайл принес больше 4 очков, превращаем его в бласт тайл
                                    if(this.tilesToBurn.length >= 5)
                                    {
                                        k.makeTileBlast();
                                        this.grid[t.gridPosX][t.gridPosY]=k;
                                    }
                                    //если этот тайл не принес больше 4 очков, сжигаем его
                                    else
                                    {
                                        k.burn();
                                    }
                                }   
                            }
                        }
                        else
                        {
                            //если меньше, то возвращаем всех претендентов на свои места
                            for(let k of this.tilesToBurn)
                            {
                                this.grid[k.gridPosX][k.gridPosY]= k;
                            }
                        }

                        if(this.tilesToBurn.length > 1 && this.tilesToBurn.length < 5)
                        {
                            //если собрано от 1 до 4 тайлов, играем звук сбора тайлов
                            this.scene.sounds.tilesCollected.play();
                        }
                        else if(this.tilesToBurn.length >= 5)
                        {
                            //если собрано более 5 тайлов
                            this.scene.sounds.manyTilesCollected.play();
                        }
                    }
                   

                    //далее делаем так, чтобы тайлы без опоры падали. Заполняем верхний ряд
                    //повторяем до тех пор, пока все поле не будет заполнено
                    this.fillGridTillFull();
                }

                //логика выигрыша или проигрыша. По дефолту, нужно за 10 ходов набрать 50 очков
                if(this.scene.stepsLeft <= 0)
                {
                    //отключаем все тайлы, делаем их неинтерактивными
                    for(let q = 0; q < this.gridXLen; q++)
                    {
                        for(let w = 0; w < this.gridYLen; w++)
                        {
                            this.grid[q][w].sprite.disableInteractive();
                        }
                    }
                    
                    //логика выигрыша / проигрыша
                    if(this.scene.score < 100)
                    {
                        //создаем плашку о проигрыше
                        new Info(this.scene, 0, 0, 'эх, ходы закончились...');
                        this.scene.sounds.lost.play();
                    }
                    else
                    {
                        //создаем плашку о выигрыше
                        new Info(this.scene, 0, 0, 'Победа!');
                        this.scene.sounds.win.play();
                    }
                }
                
            }, this);

        //присваиваем двумерному массиву на данной позиции текущий тайл
        this.grid[i][j]=t;
    }

    fillGridTillFull()
    {
        //заполняем всё поле
        while(true)
        {
            //роняем тайлы без опоры
            this.makeTilesFall();

            //заполняем верхни ряд
            this.fillGrid();

            //далее проверяем, вдруг поле заполнено
            let continueFilling = false;
            for(let i = 0; i < this.gridXLen; i++)
            {
                for(let j = 0; j < this.gridYLen; j++)
                {
                    if(this.grid[i][j] === null)
                    {
                        continueFilling=true;
                    }
                }
            }
            //если не заполнено, повторяем
            if(!continueFilling)
            {
                break;
            }
        }
    }


}