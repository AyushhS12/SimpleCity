import type { Player } from "../../utils/models";

export class PlayerSprite extends Phaser.Physics.Arcade.Sprite {

    private nameTag: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)
        const player = scene.registry.get("player") as Player
        this.nameTag = scene.add.text(x, y - 20, player.username, { fontSize: '12px' }).setOrigin(0.5)
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        this.nameTag.setPosition(this.x, this.y - 25);
    }

    static createAnims(anims: Phaser.Animations.AnimationManager) {
        if(anims.exists("idle")) return;
        anims.create({
            key: "idle",
            frames: anims.generateFrameNumbers("player", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        })
        anims.create({
            key: "walk-left",
            frames: anims.generateFrameNumbers("player", { start: 8, end: 11 }),
            frameRate: 15,
            repeat: -1
        })
        anims.create({
            key: "walk-right",
            frames: anims.generateFrameNumbers("player", { start: 12, end: 15 }),
            frameRate: 15,
            repeat: -1
        })
        anims.create({
            key: "walk-up",
            frames: anims.generateFrameNumbers("player", { start: 4, end: 7 }),
            frameRate: 15,
            repeat: -1
        })
        anims.create({
            key: "walk-down",
            frames: anims.generateFrameNumbers("player", { start: 2, end: 3 }),
            frameRate: 15,
            repeat: -1
        })
    }
}

export class PlayerGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene, {
            classType: PlayerSprite,
            runChildUpdate: true
        })
        PlayerSprite.createAnims(scene.anims)
    }

    addPlayer(x: number, y: number): PlayerSprite {
        const newPlayer: PlayerSprite = this.create(x, y, "player");
        if (newPlayer) {
            newPlayer.setBodySize(16, 16)
            newPlayer.setCollideWorldBounds(true)
            newPlayer.play("idle")
        }
        return newPlayer;
    }
}