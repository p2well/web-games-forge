import { Scene } from 'phaser';

export class Game extends Scene {

    constructor() {
        super('Game');
    }

    create() {
        this.add.text(512, 384, 'Game Scene', {
            fontFamily: 'Arial',
            fontSize: 38,
            color: '#ffffff'
        }).setOrigin(0.5);
    }
}
