import Phaser from 'phaser';
import { SoundFX } from '../SoundFX.js';


const GRID_SIZE = 20;
const GRID_WIDTH = 30;   // 600px playable area
const GRID_HEIGHT = 22;  // 440px playable area
const OFFSET_X = 20;     // left border offset
const OFFSET_Y = 40;     // top offset (room for score)

const DIRECTION = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

const BASE_SPEED = 150;      // ms per move at start
const MIN_SPEED = 60;        // fastest speed cap
const SPEED_DECREASE = 3;    // ms faster per food eaten

export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init() {
        this.snake = [];
        this.direction = DIRECTION.RIGHT;
        this.nextDirection = DIRECTION.RIGHT;
        this.food = null;
        this.foodGraphics = null;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snake_highscore') || '0', 10);
        this.moveTimer = 0;
        this.speed = BASE_SPEED;
        this.isGameOver = false;
        this.directionChanged = false;

        this.sfx = null;
    }

    create() {
        this.sfx = new SoundFX(this);
        this.createBoard();
        this.createSnake();
        this.spawnFood();
        this.createUI();
        this.setupInput();
    }

    createBoard() {
        // Draw border
        const graphics = this.add.graphics();

        // Board background
        graphics.fillStyle(0x282a36, 1);
        graphics.fillRect(
            OFFSET_X,
            OFFSET_Y,
            GRID_WIDTH * GRID_SIZE,
            GRID_HEIGHT * GRID_SIZE
        );

        // Board border
        graphics.lineStyle(2, 0x6272a4, 1);
        graphics.strokeRect(
            OFFSET_X,
            OFFSET_Y,
            GRID_WIDTH * GRID_SIZE,
            GRID_HEIGHT * GRID_SIZE
        );

        // Grid lines (subtle)
        graphics.lineStyle(1, 0x44475a, 0.3);
        for (let x = 0; x <= GRID_WIDTH; x++) {
            graphics.lineBetween(
                OFFSET_X + x * GRID_SIZE, OFFSET_Y,
                OFFSET_X + x * GRID_SIZE, OFFSET_Y + GRID_HEIGHT * GRID_SIZE
            );
        }
        for (let y = 0; y <= GRID_HEIGHT; y++) {
            graphics.lineBetween(
                OFFSET_X, OFFSET_Y + y * GRID_SIZE,
                OFFSET_X + GRID_WIDTH * GRID_SIZE, OFFSET_Y + y * GRID_SIZE
            );
        }
    }

    createSnake() {
        // Start with 3 segments in the middle
        const startX = Math.floor(GRID_WIDTH / 2);
        const startY = Math.floor(GRID_HEIGHT / 2);

        for (let i = 0; i < 3; i++) {
            this.snake.push({ x: startX - i, y: startY });
        }

        this.snakeGraphics = this.add.graphics();
        this.drawSnake();
    }

    drawSnake() {
        this.snakeGraphics.clear();

        this.snake.forEach((segment, index) => {
            const pixelX = OFFSET_X + segment.x * GRID_SIZE;
            const pixelY = OFFSET_Y + segment.y * GRID_SIZE;

            if (index === 0) {
                // Head - brighter color
                this.snakeGraphics.fillStyle(0x50fa7b, 1);
                this.snakeGraphics.fillRoundedRect(pixelX + 1, pixelY + 1, GRID_SIZE - 2, GRID_SIZE - 2, 4);

                // Eyes
                this.drawEyes(pixelX, pixelY);
            } else {
                // Body - gradient from bright to darker
                const alpha = 1 - (index / this.snake.length) * 0.4;
                const green = Math.floor(0x50 + (0xfa - 0x50) * (1 - index / this.snake.length));
                const color = (green << 8) | 0x7b;
                this.snakeGraphics.fillStyle(color, alpha);
                this.snakeGraphics.fillRoundedRect(pixelX + 2, pixelY + 2, GRID_SIZE - 4, GRID_SIZE - 4, 3);
            }
        });
    }

    drawEyes(headX, headY) {
        this.snakeGraphics.fillStyle(0xffffff, 1);
        const centerX = headX + GRID_SIZE / 2;
        const centerY = headY + GRID_SIZE / 2;

        let eye1X, eye1Y, eye2X, eye2Y;

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

        this.snakeGraphics.fillCircle(eye1X, eye1Y, 2.5);
        this.snakeGraphics.fillCircle(eye2X, eye2Y, 2.5);

        // Pupils
        this.snakeGraphics.fillStyle(0x282a36, 1);
        this.snakeGraphics.fillCircle(eye1X, eye1Y, 1.2);
        this.snakeGraphics.fillCircle(eye2X, eye2Y, 1.2);
    }

    spawnFood() {
        let pos;
        do {
            pos = {
                x: Phaser.Math.Between(0, GRID_WIDTH - 1),
                y: Phaser.Math.Between(0, GRID_HEIGHT - 1)
            };
        } while (this.isOnSnake(pos));

        this.food = pos;
        this.drawFood();
    }

    isOnSnake(pos) {
        return this.snake.some(segment => segment.x === pos.x && segment.y === pos.y);
    }

    drawFood() {
        if (this.foodGraphics) {
            this.foodGraphics.clear();
        } else {
            this.foodGraphics = this.add.graphics();
            this.foodGraphics.setDepth(2);
        }

        const pixelX = OFFSET_X + this.food.x * GRID_SIZE + GRID_SIZE / 2;
        const pixelY = OFFSET_Y + this.food.y * GRID_SIZE + GRID_SIZE / 2;

        // Outer glow
        this.foodGraphics.fillStyle(0xff5555, 0.3);
        this.foodGraphics.fillCircle(pixelX, pixelY, GRID_SIZE / 2);

        // Food circle
        this.foodGraphics.fillStyle(0xff5555, 1);
        this.foodGraphics.fillCircle(pixelX, pixelY, GRID_SIZE / 2 - 3);

        // Highlight
        this.foodGraphics.fillStyle(0xff7979, 1);
        this.foodGraphics.fillCircle(pixelX - 2, pixelY - 2, 3);
    }

    createUI() {
        this.scoreText = this.add.text(OFFSET_X, 10, `Score: ${this.score}`, {
            fontSize: '20px',
            fontFamily: 'monospace',
            color: '#f8f8f2'
        });

        this.highScoreText = this.add.text(
            OFFSET_X + GRID_WIDTH * GRID_SIZE,
            10,
            `Best: ${this.highScore}`,
            {
                fontSize: '20px',
                fontFamily: 'monospace',
                color: '#ffb86c'
            }
        ).setOrigin(1, 0);
    }

    setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys();

        // WASD support
        this.wasd = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };

        // Pause
        this.input.keyboard.on('keydown-P', () => {
            this.togglePause();
        });
        this.input.keyboard.on('keydown-ESC', () => {
            this.togglePause();
        });
    }

    togglePause() {
        if (this.isGameOver) return;

        if (this.scene.isPaused()) {
            this.scene.resume();
            if (this.pauseText) this.pauseText.destroy();
        } else {
            this.pauseText = this.add.text(320, 240, 'PAUSED', {
                fontSize: '48px',
                fontFamily: 'monospace',
                color: '#f1fa8c',
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(100);
            this.scene.pause();
        }
    }

    update(time, delta) {
        if (this.isGameOver) return;

        this.handleInput();

        this.moveTimer += delta;
        if (this.moveTimer >= this.speed) {
            this.moveTimer = 0;
            this.moveSnake();
        }
    }

    handleInput() {
        // Prevent reversing direction (can't go opposite way)
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

    moveSnake() {
        this.sfx.move();
        this.direction = this.nextDirection;
        this.directionChanged = false;

        const head = this.snake[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_WIDTH ||
            newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.isOnSnake(newHead)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(newHead);

        // Check food collision
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.eatFood();
        } else {
            this.snake.pop();
        }

        this.drawSnake();
    }

    eatFood() {
        this.sfx.eat();
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);

        // Increase speed
        this.speed = Math.max(MIN_SPEED, this.speed - SPEED_DECREASE);

        // Flash effect on score
        this.tweens.add({
            targets: this.scoreText,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 100,
            yoyo: true
        });

        this.spawnFood();
    }

    gameOver() {
        this.sfx.gameOver();
        this.isGameOver = true;

        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snake_highscore', this.highScore.toString());
        }

        // Flash the snake red
        this.snakeGraphics.clear();
        this.snake.forEach((segment) => {
            const pixelX = OFFSET_X + segment.x * GRID_SIZE;
            const pixelY = OFFSET_Y + segment.y * GRID_SIZE;
            this.snakeGraphics.fillStyle(0xff5555, 1);
            this.snakeGraphics.fillRoundedRect(pixelX + 1, pixelY + 1, GRID_SIZE - 2, GRID_SIZE - 2, 3);
        });

        // Transition to game over scene
        this.time.delayedCall(800, () => {
            this.scene.start('GameOverScene', {
                score: this.score,
                highScore: this.highScore
            });
        });
    }
}
