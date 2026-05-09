import Phaser from 'phaser';
import { TitleMusic } from '../TitleMusic.js';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        // Title
        this.add.text(320, 120, '🐍 SNAKE', {
            fontSize: '64px',
            fontFamily: 'monospace',
            color: '#50fa7b',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions
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

        // Start prompt
        this.startText = this.add.text(320, 400, 'Press SPACE or ENTER to Start', {
            fontSize: '22px',
            fontFamily: 'monospace',
            color: '#ffb86c'
        }).setOrigin(0.5);

        // Blink effect
        this.tweens.add({
            targets: this.startText,
            alpha: 0.3,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });

        // Audio is already unlocked by SplashScene's click
        this.music = new TitleMusic(this);
        this.music.start();

        // Listen for game start
        this.input.keyboard.on('keydown-SPACE', this.startGame, this);
        this.input.keyboard.on('keydown-ENTER', this.startGame, this);
    }

    startGame() {
        this.music.stop();
        this.scene.start('GameScene');
    }
}
