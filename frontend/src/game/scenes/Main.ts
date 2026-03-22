import { type MoveEvent, type Snapshot } from "../../utils/extract";
import { PlayerAnims } from "../../utils/keys";
import { PlayerGroup, PlayerSprite } from "../Entities/Player";
import type { MyGame } from "../Game";
import type NetworkManager from "../network/NetworkManager";
import { Direction } from "../network/NetworkManager";

type Keys = {
    up: Phaser.Input.Keyboard.Key,
    left: Phaser.Input.Keyboard.Key,
    right: Phaser.Input.Keyboard.Key,
    down: Phaser.Input.Keyboard.Key
}

export default class MainScene extends Phaser.Scene {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    player!: PlayerSprite;
    playerGroup!: PlayerGroup;
    players!: Map<string, PlayerSprite>;
    keys!: Keys
    gameState!: Snapshot
    network!: NetworkManager
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
        });
        this.network = (this.game as MyGame).connectToNetwork()
        this.players = new Map()
    }

    create() {
        const map = this.make.tilemap({ key: "main_map" })
        const grass = map.addTilesetImage("Grass", "grass")!
        const water = map.addTilesetImage("Water", "water")!
        const plant = map.addTilesetImage("Plants", "plant")!

        const waterLayer = map.createLayer("Water", water)?.setDepth(0);
        map.createLayer("Ground", grass)?.setDepth(0)
        const plantLayer = map.createLayer("Plants", plant)?.setDepth(0);

        this.playerGroup = new PlayerGroup(this)
        this.add.existing(this.playerGroup)
        this.player = this.playerGroup.addPlayer("", 200, 150).setDepth(0)

        if (waterLayer) {
            waterLayer.setCollisionByProperty({ collides: true });
        }

        if (plantLayer) {
            plantLayer.setCollisionByProperty({ collides: true });
        }

        // FIXED: Add colliders AFTER setting collision properties
        if (waterLayer) {
            this.physics.add.collider(this.playerGroup, waterLayer);
        }
        if (plantLayer) {
            this.physics.add.collider(this.playerGroup, plantLayer);
        }
        this.physics.add.collider(this.playerGroup, this.playerGroup);

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

        this.network.on("snapshot", (snapshot: Snapshot) => {
            snapshot.players.forEach((x) => {
                const p = this.playerGroup.addPlayer(x, 200, 250)
                this.players.set(x, p)
            })
            console.log("snapshot below: ")
            console.log(snapshot)
            return
        })
        this.network.on("joined", (id: string) => {
            const p = this.playerGroup.addPlayer(id, 200, 200)
            this.players.set(id, p)
            return
        })
        this.network.on("move", (move: MoveEvent) => {
            if (this.player.id !== move.player) {
                const p = this.players.get(move.player)

                if (!p) {
                    throw new Error("Invalid player id received")
                }
                console.log("MOVE EVENT RECEIVED", move.player); // 👈 ADD THIS
                p.targetX = move.x
                p.targetY = move.y
                p.direction = move.direction
                p.moving = true
                return
            }
        })

        // Debug Graphics for colliding tiles
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
    }

    private static speed = 100;

    update(time: number, delta: number): void {
        super.update(time, delta)
        this.players.forEach((p) => {
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            // Stop when close enough
            if (distance < 1) {
                p.anims.play(PlayerAnims.IDLE)
                p.setVelocity(0);
                p.setPosition(p.targetX, p.targetY); // snap to exact position
                p.moving = false;
                return;
            }

            // Normalize direction
            const vx = (dx / distance) * MainScene.speed;
            const vy = (dy / distance) * MainScene.speed;

            // let anim: string = PlayerAnims.WALK_DOWN;

            // switch (p.direction) {
            //     case Direction.Down:
            //         anim = PlayerAnims.WALK_DOWN;
            //         break;
            //     case Direction.Up:
            //         anim = PlayerAnims.WALK_UP;
            //         break;
            //     case Direction.Left:
            //         anim = PlayerAnims.WALK_LEFT;
            //         break;
            //     case Direction.Right:
            //         anim = PlayerAnims.WALK_RIGHT;
            //         break;
            // }

            // if (p.anims.currentAnim?.key !== anim) {
            //     p.play(anim, true);
            // }
            p.setVelocity(vx, vy);
            if (Math.abs(vx) > 1 || Math.abs(vy) > 1) {

                let anim: string = PlayerAnims.WALK_DOWN;

                if (Math.abs(vx) > Math.abs(vy)) {
                    anim = vx > 0 ? PlayerAnims.WALK_RIGHT : PlayerAnims.WALK_LEFT;
                } else {
                    anim = vy > 0 ? PlayerAnims.WALK_DOWN : PlayerAnims.WALK_UP;
                }

                if (!p.anims.isPlaying || p.anims.currentAnim?.key !== anim) {
                    p.play(anim, true);
                }

            } else {
                // idle
                if (p.anims.currentAnim?.key !== PlayerAnims.IDLE) {
                    p.play(PlayerAnims.IDLE, true);
                }
            }
        })
        let moving = false;
        let direction = Direction.Down

        this.player.setVelocity(0);
        this.player.anims.timeScale = 1;

        if (this.cursors.left?.isDown || this.keys?.left.isDown) {
            this.player.setVelocityX(-MainScene.speed);
            this.player.play(PlayerAnims.WALK_LEFT, true);
            moving = true;
            direction = Direction.Left
        }
        else if (this.cursors.right?.isDown || this.keys?.right.isDown) {
            this.player.setVelocityX(MainScene.speed);
            this.player.play(PlayerAnims.WALK_RIGHT, true);
            moving = true;
            direction = Direction.Right
        }
        else if (this.cursors.up?.isDown || this.keys?.up.isDown) {
            this.player.setVelocityY(-MainScene.speed);
            this.player.play(PlayerAnims.WALK_UP, true);
            moving = true;
            direction = Direction.Up
        }
        else if (this.cursors.down?.isDown || this.keys?.down.isDown) {
            this.player.setVelocityY(MainScene.speed);
            this.player.play(PlayerAnims.WALK_DOWN, true);
            moving = true;
        }
        if (moving) {
            if (this.player.body?.blocked.left || this.player.body?.blocked.right || this.player.body?.blocked.up || this.player.body?.blocked.down) {
                this.player.anims.timeScale = 0.3;
                return
            }
            this.network.sendMove(direction, this.player.x, this.player.y)
        }

        if (!moving) {
            if (this.player.anims.currentAnim?.key !== PlayerAnims.IDLE) {
                this.player.play(PlayerAnims.IDLE, true);
            }
        }
    }
}