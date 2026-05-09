import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.finalScore = data.score || 0;
        this.highScore = data.highScore || 0;
        this.isNewHighScore = this.finalScore >= this.highScore && this.finalScore > 0;
    }

    create() {
        // Game Over title
        this.add.text(320, 100, 'GAME OVER', {
            fontSize: '52px',
            fontFamily: 'monospace',
            color: '#ff5555',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Score
        this.add.text(320, 200, `Score: ${this.finalScore}`, {
            fontSize: '32px',
            fontFamily: 'monospace',
            color: '#f8f8f2'
        }).setOrigin(0.5);

        // High score
        const highScoreColor = this.isNewHighScore ? '#f1fa8c' : '#ffb86c';
        this.add.text(320, 250, `Best: ${this.highScore}`, {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: highScoreColor
        }).setOrigin(0.5);

        // New high score indicator
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

        // Restart prompt
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

        // Menu prompt
        this.add.text(320, 430, 'Press ESC for Menu', {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#6272a4'
        }).setOrigin(0.5);

        // Input handlers
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('GameScene');
        });
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('BootScene');
        });
    }
}
