
export default class Button
{
    
    constructor (scene, x, y, pressFunction, texture, text)
    {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.container = scene.add.container(x, y);
        this.image = scene.add.image(0, 0, texture);

        //контейнер всех элементов кнопки, чтобы можно было всю кнопку двигать разом
        this.container.add(this.image);

        //добавляем текст, делаем его интерактивным
        this.text = scene.add.text(0, 0, text, { font: "120px ComicHelvetic" })
            .setOrigin(0.5);
        this.container.add(this.text);
        
        //обновляем глубину кнопки, чтобы она была поверх всего
        this.container.setDepth(100);

        this.image
            .setInteractive()
            .on('pointerover', () => {
                this.container.setScale(1.03);
            }, this)
            .on('pointerout', () => {
                this.container.setScale(1);
            }, this)
            .on('pointerdown', () => {
                if(this.container.scaleX ===1.03)
                {
                    this.container.setScale(0.97);
                    this.scene.sounds.click.play();
                }
            }, this)
            .on('pointerup', () => {
                if(this.container.scaleX ===0.97)
                {
                    //реализуем функцию кнопки
                    pressFunction();
                }
            }, this);
    }

    setButtonText(text)
    {
        this.text.setText(text);
    }

    destroy()
    {
        this.container.destroy();
    }

}