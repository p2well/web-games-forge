import { Splash } from './scenes/Splash';
import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { AUTO, Game, Scale } from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 640,
    height: 480,
    parent: 'game-container',
    backgroundColor: '#1e1e2e',
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
