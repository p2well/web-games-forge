import { Scene } from 'phaser';

export class Splash extends Scene {

    constructor() {
        super('Splash');
    }

    create() {
        this.add.text(320, 180, '🐍 SNAKE', {
            fontSize: '72px',
            fontFamily: 'monospace',
            color: '#50fa7b',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const prompt = this.add.text(320, 320, 'Click to play', {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#ffb86c'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: prompt,
            alpha: 0.3,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });

        this.input.once('pointerdown', () => {
            this.scene.start('Boot');
        });
    }
}
