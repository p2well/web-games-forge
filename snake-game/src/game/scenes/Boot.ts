import { Scene } from 'phaser';
import { TitleMusic } from '../TitleMusic';

export class Boot extends Scene {

    private music!: TitleMusic;

    constructor() {
        super('Boot');
    }

    create() {
        this.add.text(320, 100, '🐍 SNAKE', {
            fontSize: '120px',
            fontFamily: 'Pixeltype',
            color: '#50fa7b',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(320, 220, 'Use Arrow Keys to Move', {
            fontSize: '36px',
            fontFamily: 'Pixeltype',
            color: '#f8f8f2'
        }).setOrigin(0.5);

        this.add.text(320, 265, 'Eat food to grow', {
            fontSize: '32px',
            fontFamily: 'Pixeltype',
            color: '#bd93f9'
        }).setOrigin(0.5);

        this.add.text(320, 305, 'Avoid walls and yourself', {
            fontSize: '32px',
            fontFamily: 'Pixeltype',
            color: '#bd93f9'
        }).setOrigin(0.5);

        const startText = this.add.text(320, 400, 'Press SPACE or ENTER to Start', {
            fontSize: '40px',
            fontFamily: 'Pixeltype',
            color: '#ffb86c'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: startText,
            alpha: 0.3,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });

        this.music = new TitleMusic(this);
        this.music.start();

        this.input.keyboard!.on('keydown-SPACE', this.startGame, this);
        this.input.keyboard!.on('keydown-ENTER', this.startGame, this);
    }

    private startGame(): void {
        this.music.stop();
        this.scene.start('Game');
    }
}
