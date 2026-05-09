import Phaser, { Scene } from 'phaser';
import { SoundFX } from '../SoundFX';

interface Direction {
    readonly x: number;
    readonly y: number;
}

interface GridPosition {
    x: number;
    y: number;
}

const GRID_SIZE = 24;
const GRID_WIDTH = 40;
const GRID_HEIGHT = 27;
const OFFSET_X = 32;
const OFFSET_Y = 80;

const DIRECTION: Record<string, Direction> = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

const BASE_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_DECREASE = 3;

export class Game extends Scene {

    private snake: GridPosition[] = [];
    private direction: Direction = DIRECTION.RIGHT;
    private nextDirection: Direction = DIRECTION.RIGHT;
    private food: GridPosition = { x: 0, y: 0 };
    private foodGraphics: Phaser.GameObjects.Graphics | null = null;
    private score = 0;
    private highScore = 0;
    private moveTimer = 0;
    private speed = BASE_SPEED;
    private isGameOver = false;
    private directionChanged = false;

    private sfx!: SoundFX;
    private snakeGraphics!: Phaser.GameObjects.Graphics;
    private scoreText!: Phaser.GameObjects.Text;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: {
        up: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
    };
    private pauseText: Phaser.GameObjects.Text | null = null;
    private pauseKeyHandler: ((event: KeyboardEvent) => void) | null = null;

    constructor() {
        super('Game');
    }

    init() {
        this.snake = [];
        this.direction = DIRECTION.RIGHT;
        this.nextDirection = DIRECTION.RIGHT;
        this.foodGraphics = null;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snake_highscore') || '0', 10);
        this.moveTimer = 0;
        this.speed = BASE_SPEED;
        this.isGameOver = false;
        this.directionChanged = false;
    }

    create() {
        this.sfx = new SoundFX(this);
        this.createBoard();
        this.createSnake();
        this.spawnFood();
        this.createUI();
        this.setupInput();
    }

    private createBoard(): void {
        const graphics = this.add.graphics();

        // Playing field — pure black
        graphics.fillStyle(0x000000, 1);
        graphics.fillRect(OFFSET_X, OFFSET_Y, GRID_WIDTH * GRID_SIZE, GRID_HEIGHT * GRID_SIZE);

        // Bright arcade border
        graphics.lineStyle(2, 0x00ff00, 1);
        graphics.strokeRect(OFFSET_X, OFFSET_Y, GRID_WIDTH * GRID_SIZE, GRID_HEIGHT * GRID_SIZE);

        // Faint inner dot-grid for retro feel
        for (let x = 0; x <= GRID_WIDTH; x++) {
            for (let y = 0; y <= GRID_HEIGHT; y++) {
                graphics.fillStyle(0x00ff00, 0.1);
                graphics.fillRect(
                    OFFSET_X + x * GRID_SIZE,
                    OFFSET_Y + y * GRID_SIZE,
                    1, 1
                );
            }
        }
    }

    private createSnake(): void {
        const startX = Math.floor(GRID_WIDTH / 2);
        const startY = Math.floor(GRID_HEIGHT / 2);

        for (let i = 0; i < 3; i++) {
            this.snake.push({ x: startX - i, y: startY });
        }

        this.snakeGraphics = this.add.graphics();
        this.drawSnake();
    }

    private drawSnake(): void {
        this.snakeGraphics.clear();

        this.snake.forEach((segment, index) => {
            const pixelX = OFFSET_X + segment.x * GRID_SIZE;
            const pixelY = OFFSET_Y + segment.y * GRID_SIZE;

            if (index === 0) {
                // Head — bright neon green, sharp pixel block
                this.snakeGraphics.fillStyle(0x00ff00, 1);
                this.snakeGraphics.fillRect(pixelX + 1, pixelY + 1, GRID_SIZE - 2, GRID_SIZE - 2);
                this.drawEyes(pixelX, pixelY);
            } else {
                // Body — gradually dimmer green, sharp blocks with 1px gap
                const brightness = 1 - (index / this.snake.length) * 0.5;
                const green = Math.floor(0xff * brightness);
                const color = (green << 8);
                this.snakeGraphics.fillStyle(color, 1);
                this.snakeGraphics.fillRect(pixelX + 1, pixelY + 1, GRID_SIZE - 2, GRID_SIZE - 2);
            }
        });
    }

    private drawEyes(headX: number, headY: number): void {
        const centerX = headX + GRID_SIZE / 2;
        const centerY = headY + GRID_SIZE / 2;

        let eye1X: number, eye1Y: number, eye2X: number, eye2Y: number;

        if (this.direction === DIRECTION.RIGHT) {
            eye1X = centerX + 3; eye1Y = centerY - 4;
            eye2X = centerX + 3; eye2Y = centerY + 4;
        } else if (this.direction === DIRECTION.LEFT) {
            eye1X = centerX - 3; eye1Y = centerY - 4;
            eye2X = centerX - 3; eye2Y = centerY + 4;
        } else if (this.direction === DIRECTION.UP) {
            eye1X = centerX - 4; eye1Y = centerY - 3;
            eye2X = centerX + 4; eye2Y = centerY - 3;
        } else {
            eye1X = centerX - 4; eye1Y = centerY + 3;
            eye2X = centerX + 4; eye2Y = centerY + 3;
        }

        // Sharp pixel-style eyes — white squares with dark pupils
        this.snakeGraphics.fillStyle(0xffffff, 1);
        this.snakeGraphics.fillRect(eye1X - 2, eye1Y - 2, 4, 4);
        this.snakeGraphics.fillRect(eye2X - 2, eye2Y - 2, 4, 4);

        this.snakeGraphics.fillStyle(0x000000, 1);
        this.snakeGraphics.fillRect(eye1X - 1, eye1Y - 1, 2, 2);
        this.snakeGraphics.fillRect(eye2X - 1, eye2Y - 1, 2, 2);
    }

    private spawnFood(): void {
        let pos: GridPosition;
        do {
            pos = {
                x: Phaser.Math.Between(0, GRID_WIDTH - 1),
                y: Phaser.Math.Between(0, GRID_HEIGHT - 1)
            };
        } while (this.isOnSnake(pos));

        this.food = pos;
        this.drawFood();
    }

    private isOnSnake(pos: GridPosition): boolean {
        return this.snake.some(segment => segment.x === pos.x && segment.y === pos.y);
    }

    private drawFood(): void {
        if (this.foodGraphics) {
            this.foodGraphics.clear();
        } else {
            this.foodGraphics = this.add.graphics();
            this.foodGraphics.setDepth(2);
        }

        const pixelX = OFFSET_X + this.food.x * GRID_SIZE;
        const pixelY = OFFSET_Y + this.food.y * GRID_SIZE;

        // Outer glow
        this.foodGraphics.fillStyle(0xff0055, 0.25);
        this.foodGraphics.fillRect(pixelX - 1, pixelY - 1, GRID_SIZE + 2, GRID_SIZE + 2);

        // Solid food block
        this.foodGraphics.fillStyle(0xff0055, 1);
        this.foodGraphics.fillRect(pixelX + 2, pixelY + 2, GRID_SIZE - 4, GRID_SIZE - 4);

        // Highlight pixel
        this.foodGraphics.fillStyle(0xff6699, 1);
        this.foodGraphics.fillRect(pixelX + 3, pixelY + 3, 3, 3);
    }

    private createUI(): void {
        // Score bar separator line
        const barGfx = this.add.graphics();
        barGfx.lineStyle(1, 0x00ff00, 0.3);
        barGfx.lineBetween(OFFSET_X, OFFSET_Y - 5, OFFSET_X + GRID_WIDTH * GRID_SIZE, OFFSET_Y - 5);

        this.scoreText = this.add.text(OFFSET_X, 16, `SCORE  ${this.formatScore(this.score)}`, {
            fontSize: '56px',
            fontFamily: 'Pixeltype',
            color: '#ffffff'
        });

        this.add.text(
            OFFSET_X + GRID_WIDTH * GRID_SIZE,
            16,
            `HI  ${this.formatScore(this.highScore)}`,
            {
                fontSize: '56px',
                fontFamily: 'Pixeltype',
                color: '#ffff00'
            }
        ).setOrigin(1, 0);
    }

    private formatScore(value: number): string {
        return value.toString().padStart(5, '0');
    }

    private setupInput(): void {
        this.cursors = this.input.keyboard!.createCursorKeys();

        this.wasd = {
            up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };

        // Use a DOM listener so pause/unpause works even while the scene is paused
        this.pauseKeyHandler = (event: KeyboardEvent) => {
            if (event.code === 'KeyP' || event.code === 'Escape') {
                this.togglePause();
            }
        };
        window.addEventListener('keydown', this.pauseKeyHandler);

        this.events.on('shutdown', () => {
            if (this.pauseKeyHandler) {
                window.removeEventListener('keydown', this.pauseKeyHandler);
                this.pauseKeyHandler = null;
            }
        });
    }

    private togglePause(): void {
        if (this.isGameOver) return;

        if (this.scene.isPaused()) {
            this.scene.resume();
            if (this.pauseText) this.pauseText.destroy();
        } else {
            this.pauseText = this.add.text(512, 384, '- PAUSED -', {
                fontSize: '96px',
                fontFamily: 'Pixeltype',
                color: '#ffff00',
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(100);
            this.scene.pause();
        }
    }

    update(_time: number, delta: number) {
        if (this.isGameOver) return;

        this.handleInput();

        this.moveTimer += delta;
        if (this.moveTimer >= this.speed) {
            this.moveTimer = 0;
            this.moveSnake();
        }
    }

    private handleInput(): void {
        if (this.directionChanged) return;

        if ((this.cursors.up.isDown || this.wasd.up.isDown) && this.direction !== DIRECTION.DOWN) {
            this.nextDirection = DIRECTION.UP;
            this.directionChanged = true;
        } else if ((this.cursors.down.isDown || this.wasd.down.isDown) && this.direction !== DIRECTION.UP) {
            this.nextDirection = DIRECTION.DOWN;
            this.directionChanged = true;
        } else if ((this.cursors.left.isDown || this.wasd.left.isDown) && this.direction !== DIRECTION.RIGHT) {
            this.nextDirection = DIRECTION.LEFT;
            this.directionChanged = true;
        } else if ((this.cursors.right.isDown || this.wasd.right.isDown) && this.direction !== DIRECTION.LEFT) {
            this.nextDirection = DIRECTION.RIGHT;
            this.directionChanged = true;
        }
    }

    private moveSnake(): void {
        this.sfx.move();
        this.direction = this.nextDirection;
        this.directionChanged = false;

        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        if (newHead.x < 0 || newHead.x >= GRID_WIDTH ||
            newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
            this.endGame();
            return;
        }

        if (this.isOnSnake(newHead)) {
            this.endGame();
            return;
        }

        this.snake.unshift(newHead);

        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.eatFood();
        } else {
            this.snake.pop();
        }

        this.drawSnake();
    }

    private eatFood(): void {
        this.sfx.eat();
        this.score += 10;
        this.scoreText.setText(`SCORE  ${this.formatScore(this.score)}`);

        this.speed = Math.max(MIN_SPEED, this.speed - SPEED_DECREASE);

        this.tweens.add({
            targets: this.scoreText,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 100,
            yoyo: true
        });

        this.spawnFood();
    }

    private endGame(): void {
        this.sfx.gameOver();
        this.isGameOver = true;

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snake_highscore', this.highScore.toString());
        }

        this.snakeGraphics.clear();
        this.snake.forEach((segment) => {
            const pixelX = OFFSET_X + segment.x * GRID_SIZE;
            const pixelY = OFFSET_Y + segment.y * GRID_SIZE;
            this.snakeGraphics.fillStyle(0xff0000, 1);
            this.snakeGraphics.fillRect(pixelX + 1, pixelY + 1, GRID_SIZE - 2, GRID_SIZE - 2);
        });

        this.time.delayedCall(800, () => {
            this.scene.start('GameOver', {
                score: this.score,
                highScore: this.highScore
            });
        });
    }
}
