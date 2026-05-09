import { Splash } from './scenes/Splash';
import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { AUTO, Game, Scale } from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#000000',
    scene: [
        Splash,
        Boot,
        MainGame,
        GameOver
    ],
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    }
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
