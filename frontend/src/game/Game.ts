
import NetworkManager from "./network/NetworkManager";
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
    scene: [TitleScreen, MainScene],
}


export class MyGame extends Phaser.Game{
    network!: NetworkManager
    constructor(config: Phaser.Types.Core.GameConfig){
        super(config)
    }
    
    connectToNetwork(){
        this.network = new NetworkManager("ws://localhost:7878/world")
    }
}