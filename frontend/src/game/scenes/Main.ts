import { type MoveEvent, type Snapshot } from "../../utils/utils";
import { PlayerAnims } from "../../utils/keys";
import type { PlayerDetails, PlayerId } from "../../utils/models";
import { PlayerGroup, PlayerSprite } from "../Entities/Player";
import { MyGame } from "../Game";
import type NetworkManager from "../network/NetworkManager";
import { Direction } from "../network/NetworkManager";

type Keys = {
    up: Phaser.Input.Keyboard.Key,
    left: Phaser.Input.Keyboard.Key,
    right: Phaser.Input.Keyboard.Key,
    down: Phaser.Input.Keyboard.Key
};

export default class MainScene extends Phaser.Scene {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    player?: PlayerSprite;
    playerGroup!: PlayerGroup;
    players: Map<PlayerId, PlayerSprite> = new Map();
    keys!: Keys;
    gameState?: Snapshot;
    network!: NetworkManager;

    constructor() {
        super("main");
    }

    preload() {
        this.load.tilemapTiledJSON("main_map", "src/assets/Map/map.json");
        this.load.image("grass", "src/assets/Tilesets/Grass.png");
        this.load.image("water", "src/assets/Tilesets/Water.png");
        this.load.image("plant", "src/assets/Objects/Basic Grass Biom things 1.png");

        this.load.spritesheet("player", "src/assets/Characters/Basic Charakter Spritesheet.png", {
            frameWidth: 48,
            frameHeight: 48
        });

        this.network = (this.game as MyGame).connectToNetwork();

        // ✅ ONLY store snapshot here (NO rendering)
        this.network.on("snapshot", (snapshot: Snapshot) => {
            console.log("Snapshot received:", snapshot);
            this.gameState = snapshot;

            // Apply immediately only if scene already created
            if (this.scene.isActive()) {
                this.applySnapshot(snapshot);
            }
        });
    }

    create() {
        const map = this.make.tilemap({ key: "main_map" });
        const grass = map.addTilesetImage("Grass", "grass")!;
        const water = map.addTilesetImage("Water", "water")!;
        const plant = map.addTilesetImage("Plants", "plant")!;

        const waterLayer = map.createLayer("Water", water)?.setDepth(0);
        map.createLayer("Ground", grass)?.setDepth(0);
        const plantLayer = map.createLayer("Plants", plant)?.setDepth(0);

        this.playerGroup = new PlayerGroup(this);
        this.add.existing(this.playerGroup);

        // Collisions
        if (waterLayer) {
            waterLayer.setCollisionByProperty({ collides: true });
            this.physics.add.collider(this.playerGroup, waterLayer);
        }

        if (plantLayer) {
            plantLayer.setCollisionByProperty({ collides: true });
            this.physics.add.collider(this.playerGroup, plantLayer);
        }

        this.physics.add.collider(this.playerGroup, this.playerGroup);

        // Input
        const cursors = this.input.keyboard?.createCursorKeys();
        if (!cursors) return;

        this.cursors = cursors;
        this.keys = this.input.keyboard?.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            down: Phaser.Input.Keyboard.KeyCodes.S
        }) as Keys;

        // ✅ Apply snapshot if it already arrived
        if (this.gameState) {
            this.applySnapshot(this.gameState);
        }

        // Events
        this.network.on("joined", (player: PlayerDetails) => {
            const p = this.playerGroup.addPlayer(player.username, 200, 400);
            this.players.set(player.id, p);
        });

        this.network.on("move", (move: MoveEvent) => {
            if (this.player?.id !== move.player) {
                const p = this.players.get(move.player);
                if (!p) return;

                p.targetX = move.x;
                p.targetY = move.y;
                p.direction = move.direction;
                p.moving = true;
            }
        });

        this.network.on("left", (player: PlayerId) => {
            this.gameState!.players = this.gameState!.players.filter(p => p.id !== player);

            const p = this.players.get(player);
            if (p) {
                p.destroy();
                this.players.delete(player);
            }
        });
    }

    // ✅ Centralized snapshot application
    private applySnapshot(snapshot: Snapshot) {
        const myId = snapshot.current_player;

        // ✅ 1. destroy everything cleanly
        this.playerGroup.clear(true, true);
        this.players.clear();

        // reset reference
        this.player = undefined;

        // ✅ 2. rebuild from snapshot
        snapshot.players.forEach((x) => {
            const p = this.playerGroup.addPlayer(x.username, 200, 300);

            // make sure sprite is visible + active (important safety)
            p.setActive(true);
            p.setVisible(true);

            if (x.id === myId) {
                this.player = p;
                this.player.id = x.id;
            } else {
                this.players.set(x.id, p);
            }
        });
    }

    private static speed = 100;

    update() {
        // Remote players interpolation
        this.players.forEach((p) => {
            if (p === undefined) return;
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 1) {
                p.anims.play(PlayerAnims.IDLE);
                p.setVelocity(0);
                p.setPosition(p.targetX, p.targetY);
                p.moving = false;
                return;
            }

            const vx = (dx / distance) * MainScene.speed;
            const vy = (dy / distance) * MainScene.speed;

            p.setVelocity(vx, vy);

            let anim: string = PlayerAnims.WALK_DOWN;

            if (Math.abs(vx) > Math.abs(vy)) {
                anim = vx > 0 ? PlayerAnims.WALK_RIGHT : PlayerAnims.WALK_LEFT;
            } else {
                anim = vy > 0 ? PlayerAnims.WALK_DOWN : PlayerAnims.WALK_UP;
            }

            if (!p.anims.isPlaying || p.anims.currentAnim?.key !== anim) {
                p.play(anim, true);
            }
        });

        if (!this.player) return;

        let moving = false;
        let direction = Direction.Down;

        this.player.setVelocity(0);

        if (this.cursors.left?.isDown || this.keys.left.isDown) {
            this.player.setVelocityX(-MainScene.speed);
            this.player.play(PlayerAnims.WALK_LEFT, true);
            moving = true;
            direction = Direction.Left;
        } else if (this.cursors.right?.isDown || this.keys.right.isDown) {
            this.player.setVelocityX(MainScene.speed);
            this.player.play(PlayerAnims.WALK_RIGHT, true);
            moving = true;
            direction = Direction.Right;
        } else if (this.cursors.up?.isDown || this.keys.up.isDown) {
            this.player.setVelocityY(-MainScene.speed);
            this.player.play(PlayerAnims.WALK_UP, true);
            moving = true;
            direction = Direction.Up;
        } else if (this.cursors.down?.isDown || this.keys.down.isDown) {
            this.player.setVelocityY(MainScene.speed);
            this.player.play(PlayerAnims.WALK_DOWN, true);
            moving = true;
        }

        if (moving) {
            this.network.sendMove(direction, this.player.x, this.player.y);
        } else {
            if (this.player.anims.currentAnim?.key !== PlayerAnims.IDLE) {
                this.player.play(PlayerAnims.IDLE, true);
            }
        }
    }
}
