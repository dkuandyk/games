
export default class Panel
{
    
    constructor (scene, x, y, stepsLeft, score)
    {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.stepsLeft=stepsLeft;
        this.score=score;

        //добавляем картинку панельки, текст счетчика ходов, текст счетчика очков
        this.image = scene.add.image(x, y, 'panel');
        this.stepsLeftText = scene.add.text(x, y-210, String(this.stepsLeft), { font: "250px ComicHelvetic" })
            .setOrigin(0.5);
        this.scoreText = scene.add.text(x, y+250, 'очки : '+String(this.score) + '/100', { font: "100px ComicHelvetic" })
            .setOrigin(0.5);
    }

    moveMade()
    {
        //ход сделан, отнимаем счетчик ходов, обновляем текст
        if(this.stepsLeft > 0)
        {
            this.stepsLeft -= 1;
            this.stepsLeftText.setText(String(this.stepsLeft));
        }
    }

    addScore(value)
    {
        //добавляем очки, меняем текст плашки
        this.score += value;
        this.scoreText
        .setText('очки : '+String(this.score) + '/100')
        .setScale(1);
        if(this.bounceTween)
        {
            this.bounceTween.remove();
        }

        //анимация уип уип, когда очки увеличиваются
        this.bounceTween = this.scene.tweens.add({
            targets:this.scoreText,
            scaleX:1.2,
            scaleY:1.2,
            yoyo:true,
            duration:200,
            ease:'Circ.Out'
        });
    }
}