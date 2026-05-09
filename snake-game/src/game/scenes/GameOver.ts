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
        this.add.text(320, 100, 'GAME OVER', {
            fontSize: '52px',
            fontFamily: 'monospace',
            color: '#ff5555',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(320, 200, `Score: ${this.finalScore}`, {
            fontSize: '32px',
            fontFamily: 'monospace',
            color: '#f8f8f2'
        }).setOrigin(0.5);

        const highScoreColor = this.isNewHighScore ? '#f1fa8c' : '#ffb86c';
        this.add.text(320, 250, `Best: ${this.highScore}`, {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: highScoreColor
        }).setOrigin(0.5);

        if (this.isNewHighScore) {
            const newRecord = this.add.text(320, 295, '★ NEW RECORD! ★', {
                fontSize: '24px',
                fontFamily: 'monospace',
                color: '#f1fa8c',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: newRecord,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 600,
                yoyo: true,
                loop: -1,
                ease: 'Sine.easeInOut'
            });
        }

        const restartText = this.add.text(320, 380, 'Press SPACE or ENTER to Play Again', {
            fontSize: '20px',
            fontFamily: 'monospace',
            color: '#50fa7b'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: restartText,
            alpha: 0.4,
            duration: 700,
            yoyo: true,
            loop: -1,
            ease: 'Sine.easeInOut'
        });

        this.add.text(320, 430, 'Press ESC for Menu', {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#6272a4'
        }).setOrigin(0.5);

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
