import { PlayerGroup, PlayerSprite } from "../Entities/Player";

type Keys = {
    up: Phaser.Input.Keyboard.Key,
    left: Phaser.Input.Keyboard.Key,
    right: Phaser.Input.Keyboard.Key,
    down: Phaser.Input.Keyboard.Key
}

type Position = {
    x: number,
    y: number
}

export default class MainScene extends Phaser.Scene {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    player!: PlayerSprite;
    keys!: Keys
    socket!: WebSocket
    constructor() {
        super("main")
    }

    preload() {
        this.load.tilemapTiledJSON("main_map", "src/assets/Map/map.json")
        this.load.image("grass", "src/assets/Tilesets/Grass.png")
        this.load.image("water", "src/assets/Tilesets/Water.png")
        // this.load.image("fence", "src/assets/Tilesets/Fences.png")
        // this.load.image("house", "src/assets/Tilesets/Wooden House.png")
        this.load.image("plant", "src/assets/Objects/Basic Grass Biom things 1.png")
        this.load.spritesheet("player", "src/assets/Characters/Basic Charakter Spritesheet.png", {
            frameWidth: 48,
            frameHeight: 48,
            margin: 0,
            spacing: 0
        })
    }

    create() {
        const map = this.make.tilemap({ key: "main_map" })
        const grass = map.addTilesetImage("Grass", "grass")!
        const water = map.addTilesetImage("Water", "water")!
        const plant = map.addTilesetImage("Plants", "plant")!

        const waterLayer = map.createLayer("Water", water)?.setDepth(0);
        map.createLayer("Ground", grass)?.setDepth(0)
        const plantLayer = map.createLayer("Plants", plant)?.setDepth(0);

        const players = new PlayerGroup(this)
        this.add.existing(players)
        this.player = players.addPlayer(200, 150).setDepth(0)

        if (waterLayer) {
            waterLayer.setCollisionByProperty({ collides: true });
        }

        if (plantLayer) {
            plantLayer.setCollisionByProperty({ collides: true });
        }

        // FIXED: Add colliders AFTER setting collision properties
        if (waterLayer) {
            this.physics.add.collider(this.player, waterLayer);
        }
        if (plantLayer) {
            this.physics.add.collider(this.player, plantLayer);
        }

        const cursors = this.input.keyboard?.createCursorKeys()
        if (!cursors) {
            return
        }
        this.cursors = cursors
        this.keys = this.input.keyboard?.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            down: Phaser.Input.Keyboard.KeyCodes.S
        }) as Keys;

        // const debugGraphics = this.add.graphics().setAlpha(0.7);
        // waterLayer?.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        // });
        // plantLayer?.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)
        // });

        try {
            this.socket = new WebSocket("ws://localhost:7878/world/")
            this.socket.binaryType = "arraybuffer"
            this.socket.onmessage = (e) => {
                const view = new DataView(e.data);
                const position: Position = { x: view.getFloat32(0, true), y: view.getFloat32(4, true) };
                console.log(position);
            }
            this.socket.onclose = (e) => {
                console.log(e)
            }
        } catch (e) {
            console.log(e)
        }
    }

    private static speed = 100;

    update(time: number, delta: number): void {
        super.update(time, delta)
        let moving = false;

        this.player.setVelocity(0);
        this.player.anims.timeScale = 1;

        if (this.cursors.left?.isDown || this.keys?.left.isDown) {
            this.player.setVelocityX(-MainScene.speed);
            this.player.play("walk-left", true);
            moving = true;
        }
        else if (this.cursors.right?.isDown || this.keys?.right.isDown) {
            this.player.setVelocityX(MainScene.speed);
            this.player.play("walk-right", true);
            moving = true;
        }
        else if (this.cursors.up?.isDown || this.keys?.up.isDown) {
            this.player.setVelocityY(-MainScene.speed);
            this.player.play("walk-up", true);
            moving = true;
        }
        else if (this.cursors.down?.isDown || this.keys?.down.isDown) {
            this.player.setVelocityY(MainScene.speed);
            this.player.play("walk-down", true);
            moving = true;
        }
        if (moving) {
            if (this.player.body?.blocked.left || this.player.body?.blocked.right || this.player.body?.blocked.up || this.player.body?.blocked.down) {
                this.player.anims.timeScale = 0.3;
                return
            }
            if (this.socket.readyState === WebSocket.OPEN) {
                const buffer = new ArrayBuffer(13);
                const view = new DataView(buffer);

                view.setFloat32(0, this.player.x, true);
                view.setFloat32(4, this.player.y, true);

                this.socket.send(buffer);
                // this.socket.send(JSON.stringify({
                //     "x": this.player.x,
                //     "y": this.player.y
                // }))
            }
        }

        if (!moving) {
            this.player.play("idle", true);
        }
    }
}