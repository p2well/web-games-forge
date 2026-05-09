import { Scene } from 'phaser';

export class GameOver extends Scene {

    constructor() {
        super('GameOver');
    }

    create() {
        this.add.text(512, 384, 'Game Over', {
            fontFamily: 'Arial',
            fontSize: 38,
            color: '#ffffff'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
