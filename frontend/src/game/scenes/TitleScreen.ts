export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        // Load your assets here
        // this.load.image('background', 'assets/images/titlescreen_bg.png');
    }

    create() {
        const { width, height } = this.scale;

        // 1. Add Background
        // If you don't have an image yet, we'll use a dark gradient rectangle
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        bg.fillRect(0, 0, width, height);

        // 2. Title Text (Shadowed for a WoW-like feel)
        this.add.text(width / 2 + 4, height * 0.3 + 4, 'AZEROTH MINI', {
            fontSize: '64px',
            fontFamily: 'serif',
            color: '#000000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.3, 'AZEROTH MINI', {
            fontSize: '64px',
            fontFamily: 'serif',
            color: '#f1c40f', // Gold
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 3. Create a Play Button
        this.createButton(width / 2, height * 0.6, 'ENTER WORLD', () => {
            // This would trigger your Story/Tutorial scene
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                this.scene.start('main');
            });
        });

        // 4. Create an Options Button
        this.createButton(width / 2, height * 0.7, 'OPTIONS', () => {
            console.log('Options menu clicked');
        });
    }

    // Helper function to create styled, interactive buttons
    createButton(x: number, y: number, label: string, callback: ()=>void) {
        const button = this.add.text(x, y, label, {
            fontSize: '28px',
            fontFamily: 'sans-serif',
            color: '#ffffff',
            backgroundColor: '#2e2e2e',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => callback())
        .on('pointerover', () => button.setStyle({ fill: '#f1c40f', backgroundColor: '#444' }))
        .on('pointerout', () => button.setStyle({ fill: '#ffffff', backgroundColor: '#2e2e2e' }));

        return button;
    }
}