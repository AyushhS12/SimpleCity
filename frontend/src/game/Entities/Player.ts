import { PlayerAnims } from "../../utils/keys";
import type { Player } from "../../utils/models";

export class PlayerSprite extends Phaser.Physics.Arcade.Sprite {

    private nameTag!: Phaser.GameObjects.Text;
    public id: string
    public targetX: number
    public targetY: number
    public direction: number = 1
    public moving: boolean = false
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture)
        const player = scene.registry.get("player") as Player
        this.targetX = x
        this.targetY = y
        this.id = player._id.$oid
    }

    setNameTag(name: string) {
        if (name === "") {
            const player = this.scene.registry.get("player") as Player
            name = player.username
            this.nameTag = this.scene.add.text(this.x, this.y - 20, name, { fontSize: '12px' }).setOrigin(0.5)
            return
        }
        this.nameTag = this.scene.add.text(this.x, this.y - 20, name, { fontSize: '12px' }).setOrigin(0.5)
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        this.nameTag.setPosition(this.x, this.y - 25);
    }

    static createAnims(anims: Phaser.Animations.AnimationManager) {
        if (anims.exists(PlayerAnims.IDLE)) return;
        anims.create({
            key: PlayerAnims.IDLE,
            frames: anims.generateFrameNumbers("player", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        })
        anims.create({
            key: PlayerAnims.WALK_LEFT,
            frames: anims.generateFrameNumbers("player", { start: 8, end: 11 }),
            frameRate: 15,
            repeat: -1
        })
        anims.create({
            key: PlayerAnims.WALK_RIGHT,
            frames: anims.generateFrameNumbers("player", { start: 12, end: 15 }),
            frameRate: 15,
            repeat: -1
        })
        anims.create({
            key: PlayerAnims.WALK_UP,
            frames: anims.generateFrameNumbers("player", { start: 4, end: 7 }),
            frameRate: 15,
            repeat: -1
        })
        anims.create({
            key: PlayerAnims.WALK_DOWN,
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

    addPlayer(name: string, x: number, y: number): PlayerSprite {
        const newPlayer: PlayerSprite = this.create(x, y, "player");
        newPlayer.setNameTag(name)
        if (newPlayer) {
            newPlayer.setBodySize(16, 16)
            newPlayer.setCollideWorldBounds(true)
            newPlayer.play(PlayerAnims.IDLE)
        }
        return newPlayer;
    }
}