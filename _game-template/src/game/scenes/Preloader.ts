import { Scene } from 'phaser';

export class Preloader extends Scene {

    constructor() {
        super('Preloader');
    }

    preload() {
        // Load all game assets here
        // this.load.image('key', 'assets/image.png');
    }

    create() {
        this.scene.start('Game');
    }
}
