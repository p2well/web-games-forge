import { Scene } from 'phaser';

export class GameOver extends Scene {

    private finalScore = 0;
    private highScore = 0;
    private isNewHighScore = false;

    constructor() {
        super('GameOver');
    }

    init(data: { score: number; highScore: number }) {
        this.finalScore = data.score || 0;
        this.highScore = data.highScore || 0;
        this.isNewHighScore = this.finalScore >= this.highScore && this.finalScore > 0;
    }

    create() {
        const gfx = this.add.graphics();

        // Arcade border frame
        gfx.lineStyle(2, 0xff0000, 0.6);
        gfx.strokeRect(50, 50, 924, 668);

        this.add.text(512, 140, 'GAME  OVER', {
            fontSize: '120px',
            fontFamily: 'Pixeltype',
            color: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Separator
        gfx.lineStyle(1, 0xff0055, 0.3);
        gfx.lineBetween(200, 210, 824, 210);

        this.add.text(512, 290, `SCORE  ${this.finalScore.toString().padStart(5, '0')}`, {
            fontSize: '72px',
            fontFamily: 'Pixeltype',
            color: '#ffffff'
        }).setOrigin(0.5);

        const highScoreColor = this.isNewHighScore ? '#ffff00' : '#00ccff';
        this.add.text(512, 370, `BEST   ${this.highScore.toString().padStart(5, '0')}`, {
            fontSize: '56px',
            fontFamily: 'Pixeltype',
            color: highScoreColor
        }).setOrigin(0.5);

        if (this.isNewHighScore) {
            const newRecord = this.add.text(512, 450, '** NEW RECORD **', {
                fontSize: '56px',
                fontFamily: 'Pixeltype',
                color: '#ffff00',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: newRecord,
                alpha: 0.3,
                duration: 400,
                yoyo: true,
                loop: -1,
                ease: 'Stepped'
            });
        }

        // Separator
        gfx.lineStyle(1, 0x00ff00, 0.3);
        gfx.lineBetween(200, 520, 824, 520);

        const restartText = this.add.text(512, 580, 'PRESS SPACE OR ENTER', {
            fontSize: '52px',
            fontFamily: 'Pixeltype',
            color: '#00ff00'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: restartText,
            alpha: 0.2,
            duration: 600,
            yoyo: true,
            loop: -1,
            ease: 'Sine.easeInOut'
        });

        this.add.text(512, 670, 'ESC FOR MENU', {
            fontSize: '32px',
            fontFamily: 'Pixeltype',
            color: '#00ff00'
        }).setOrigin(0.5).setAlpha(0.4);

        this.input.keyboard!.on('keydown-SPACE', () => {
            this.scene.start('Game');
        });
        this.input.keyboard!.on('keydown-ENTER', () => {
            this.scene.start('Game');
        });
        this.input.keyboard!.on('keydown-ESC', () => {
            this.scene.start('Boot');
        });
    }
}
