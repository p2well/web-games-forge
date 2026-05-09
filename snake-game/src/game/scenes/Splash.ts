import { Scene } from 'phaser';

const FONT_FAMILY = 'Pixeltype';

export class Splash extends Scene {

    constructor() {
        super('Splash');
    }

    async create() {
        await document.fonts.load(`16px ${FONT_FAMILY}`);

        // Decorative top/bottom border lines
        const gfx = this.add.graphics();
        gfx.lineStyle(2, 0x00ff00, 0.6);
        gfx.lineBetween(80, 100, 944, 100);
        gfx.lineBetween(80, 668, 944, 668);

        this.add.text(512, 200, 'SNAKE', {
            fontSize: '180px',
            fontFamily: FONT_FAMILY,
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(512, 320, '* ARCADE *', {
            fontSize: '56px',
            fontFamily: FONT_FAMILY,
            color: '#ffff00'
        }).setOrigin(0.5);

        const prompt = this.add.text(512, 500, '- CLICK TO PLAY -', {
            fontSize: '56px',
            fontFamily: FONT_FAMILY,
            color: '#ff0055'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: prompt,
            alpha: 0.2,
            duration: 600,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });

        this.add.text(512, 710, '\u00A9 2026 WEB GAMES FORGE', {
            fontSize: '28px',
            fontFamily: FONT_FAMILY,
            color: '#00ff00'
        }).setOrigin(0.5).setAlpha(0.4);

        this.input.once('pointerdown', () => {
            this.scene.start('Boot');
        });
    }
}
