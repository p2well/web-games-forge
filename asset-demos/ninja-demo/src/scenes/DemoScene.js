import Phaser from 'phaser';
import { createNinjaAssets, createNinjaSounds, attachRunSound, NINJA_RUN_ANIM_KEY } from '../../../../shared-assets/ninja/index.js';

export class DemoScene extends Phaser.Scene {
    constructor() {
        super('DemoScene');
    }

    create() {
        createNinjaAssets(this);
        createNinjaSounds(this);

        this.cameras.main.setBackgroundColor('#2c3e50');

        // Title
        this.add.text(400, 30, 'Ninja Asset Demo', {
            fontSize: '24px',
            fontFamily: 'monospace',
            color: '#ecf0f1',
        }).setOrigin(0.5);

        // Instructions
        this.add.text(400, 560, 'Arrow keys to move  |  Space to flip direction', {
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#95a5a6',
        }).setOrigin(0.5);

        // Ground line
        const ground = this.add.graphics();
        ground.lineStyle(2, 0x7f8c8d);
        ground.lineBetween(0, 420, 800, 420);

        // --- Showcase: different scales ---
        const scales = [2, 3, 4, 5];
        const labelY = 80;
        const spriteY = 140;

        scales.forEach((s, i) => {
            const x = 120 + i * 170;
            this.add.text(x, labelY, `${s}x`, {
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#bdc3c7',
            }).setOrigin(0.5);

            const sprite = this.add.sprite(x, spriteY, 'ninja');
            sprite.setScale(s);
            sprite.play(NINJA_RUN_ANIM_KEY);
        });

        // Divider
        const divider = this.add.graphics();
        divider.lineStyle(1, 0x555555);
        divider.lineBetween(50, 200, 750, 200);

        this.add.text(400, 220, 'Interactive — move with arrow keys', {
            fontSize: '16px',
            fontFamily: 'monospace',
            color: '#ecf0f1',
        }).setOrigin(0.5);

        // --- Interactive ninja ---
        this.ninja = this.add.sprite(400, 380, 'ninja');
        this.ninja.setScale(5);
        this.ninja.play(NINJA_RUN_ANIM_KEY);

        // Attach footstep sounds to the interactive ninja
        attachRunSound(this, this.ninja);

        // Keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.ninjaSpeed = 200;
        this.ninjaVelX = 0;
        this.ninjaVelY = 0;
        this.isMoving = false;
    }

    update(time, delta) {
        const dt = delta / 1000;
        let moving = false;

        if (this.cursors.left.isDown) {
            this.ninjaVelX = -this.ninjaSpeed;
            this.ninja.setFlipX(false);
            moving = true;
        } else if (this.cursors.right.isDown) {
            this.ninjaVelX = this.ninjaSpeed;
            this.ninja.setFlipX(true);
            moving = true;
        } else {
            this.ninjaVelX = 0;
        }

        if (this.cursors.up.isDown) {
            this.ninjaVelY = -this.ninjaSpeed;
            moving = true;
        } else if (this.cursors.down.isDown) {
            this.ninjaVelY = this.ninjaSpeed;
            moving = true;
        } else {
            this.ninjaVelY = 0;
        }

        // Toggle direction with space
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.ninja.setFlipX(!this.ninja.flipX);
        }

        // Move ninja
        this.ninja.x += this.ninjaVelX * dt;
        this.ninja.y += this.ninjaVelY * dt;

        // Clamp to screen bounds
        this.ninja.x = Phaser.Math.Clamp(this.ninja.x, 40, 760);
        this.ninja.y = Phaser.Math.Clamp(this.ninja.y, 260, 400);

        // Pause animation when standing still
        if (moving && !this.isMoving) {
            this.ninja.play(NINJA_RUN_ANIM_KEY);
        } else if (!moving && this.isMoving) {
            this.ninja.stop();
            this.ninja.setFrame(0);
        }
        this.isMoving = moving;
    }
}
