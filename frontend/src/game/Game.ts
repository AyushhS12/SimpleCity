import MainScene from "./scenes/Main";
import TitleScreen from "./scenes/TitleScreen";

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    scene: [TitleScreen,MainScene]
}