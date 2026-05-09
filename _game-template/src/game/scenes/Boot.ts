import { Scene } from 'phaser';

export class Boot extends Scene {

    constructor() {
        super('Boot');
    }

    preload() {
        // Load assets needed for the Preloader scene (e.g. a logo or loading bar)
    }

    create() {
        this.scene.start('Preloader');
    }
}
