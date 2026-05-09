import { Scene } from 'phaser';
import { TitleMusic } from '../TitleMusic';

export class Boot extends Scene {

    private music!: TitleMusic;

    constructor() {
        super('Boot');
    }

    create() {
        const gfx = this.add.graphics();

        // Decorative border frame
        gfx.lineStyle(2, 0x00ff00, 0.5);
        gfx.strokeRect(50, 50, 924, 668);
        gfx.lineStyle(1, 0x00ff00, 0.2);
        gfx.strokeRect(56, 56, 912, 656);

        this.add.text(512, 130, 'SNAKE', {
            fontSize: '140px',
            fontFamily: 'Pixeltype',
            color: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Separator line
        gfx.lineStyle(1, 0x00ccff, 0.4);
        gfx.lineBetween(160, 200, 864, 200);

        this.add.text(512, 270, 'HOW TO PLAY', {
            fontSize: '52px',
            fontFamily: 'Pixeltype',
            color: '#ffff00'
        }).setOrigin(0.5);

        this.add.text(512, 340, 'ARROW KEYS OR WASD TO MOVE', {
            fontSize: '40px',
            fontFamily: 'Pixeltype',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(512, 400, 'EAT FOOD TO GROW + SCORE', {
            fontSize: '40px',
            fontFamily: 'Pixeltype',
            color: '#00ccff'
        }).setOrigin(0.5);

        this.add.text(512, 460, 'AVOID WALLS AND YOURSELF!', {
            fontSize: '40px',
            fontFamily: 'Pixeltype',
            color: '#ff0055'
        }).setOrigin(0.5);

        // Separator line
        gfx.lineStyle(1, 0x00ccff, 0.4);
        gfx.lineBetween(160, 520, 864, 520);

        const startText = this.add.text(512, 600, 'PRESS SPACE OR ENTER', {
            fontSize: '56px',
            fontFamily: 'Pixeltype',
            color: '#ffff00'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: startText,
            alpha: 0.2,
            duration: 600,
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
