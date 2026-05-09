import { Scene } from 'phaser';

const FONT_FAMILY = 'Pixeltype';

export class Splash extends Scene {

    constructor() {
        super('Splash');
    }

    async create() {
        // Ensure font is loaded before rendering any text
        await document.fonts.load(`16px ${FONT_FAMILY}`);

        this.add.text(320, 180, '🐍 SNAKE', {
            fontSize: '128px',
            fontFamily: FONT_FAMILY,
            color: '#50fa7b',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const prompt = this.add.text(320, 320, 'Click to play', {
            fontSize: '44px',
            fontFamily: FONT_FAMILY,
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
