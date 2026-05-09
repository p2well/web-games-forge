import { Scene } from 'phaser';
import { TitleMusic } from '../TitleMusic';

export class Boot extends Scene {

    private music!: TitleMusic;

    constructor() {
        super('Boot');
    }

    create() {
        this.add.text(320, 120, '🐍 SNAKE', {
            fontSize: '64px',
            fontFamily: 'monospace',
            color: '#50fa7b',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(320, 220, 'Use Arrow Keys to Move', {
            fontSize: '20px',
            fontFamily: 'monospace',
            color: '#f8f8f2'
        }).setOrigin(0.5);

        this.add.text(320, 260, 'Eat food to grow', {
            fontSize: '18px',
            fontFamily: 'monospace',
            color: '#bd93f9'
        }).setOrigin(0.5);

        this.add.text(320, 300, 'Avoid walls and yourself', {
            fontSize: '18px',
            fontFamily: 'monospace',
            color: '#bd93f9'
        }).setOrigin(0.5);

        const startText = this.add.text(320, 400, 'Press SPACE or ENTER to Start', {
            fontSize: '22px',
            fontFamily: 'monospace',
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
