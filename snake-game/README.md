# 🐍 Snake Game

A classic Snake game built with **Phaser 4** and bundled with **Vite**. No external assets — all visuals and audio are generated procedurally at runtime.

## Quick Start

```bash
npm install
npm run dev        # opens http://localhost:3000
```

Build for production:

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## How to Play

| Action          | Keys                        |
|-----------------|-----------------------------|
| Move            | Arrow keys **or** W A S D   |
| Pause / Resume  | P **or** ESC                |
| Start / Restart | SPACE **or** ENTER          |
| Return to menu  | ESC (on Game Over screen)   |

Eat food to grow and score points. The snake speeds up with every piece of food. Avoid the walls and your own tail!

High scores are saved in `localStorage`.

## Project Structure

```
snake-game/
├── index.html           # Entry point — hosts the game container
├── vite.config.js       # Vite dev server & build config
├── package.json
└── src/
    ├── main.js          # Phaser game config & scene registration
    ├── SoundFX.js       # Procedural retro sound effects (eat, move, game over)
    ├── TitleMusic.js     # Procedural chiptune melody for the title screen
    └── scenes/
        ├── SplashScene.js    # Initial click-to-start screen (unlocks audio)
        ├── BootScene.js      # Title screen with instructions & music
        ├── GameScene.js      # Core gameplay loop
        └── GameOverScene.js  # Score display & restart options
```

## Scene Flow

```
SplashScene ──click──▸ BootScene ──SPACE/ENTER──▸ GameScene
                           ▲                          │
                           │ ESC                      │ collision
                           │                          ▼
                           └──────────────── GameOverScene
                                                SPACE/ENTER ──▸ GameScene
```

### SplashScene

Displays the game title and a "Click to play" prompt. The click event is required to unlock the browser's `AudioContext` — after that, procedural audio works seamlessly.

### BootScene

Shows the title, control instructions, and a blinking "Press SPACE or ENTER to Start" prompt. Starts the `TitleMusic` chiptune loop, which stops when gameplay begins.

### GameScene

The main gameplay scene. Key concepts:

- **Grid system** — the play area is a 30 × 22 cell grid (each cell is 20 px). The snake, food, and collisions all operate in grid coordinates.
- **Movement** — on each tick the snake's head advances one cell in the current direction. The tick interval starts at 150 ms and decreases by 3 ms per food eaten (capped at 60 ms).
- **Direction guard** — only one direction change is accepted per tick, preventing the snake from reversing into itself.
- **Food spawning** — a new food position is randomly chosen from cells that are not occupied by the snake.
- **Collision detection** — the game ends if the head moves outside the grid or overlaps any body segment.
- **Drawing** — the snake and food are drawn with the Phaser `Graphics` API. The head has eyes that follow the current direction, and body segments fade with a gradient.

### GameOverScene

Displays the final score and the all-time best. If a new record was set, a pulsing "★ NEW RECORD! ★" label appears. The player can restart immediately or return to the title screen.

## Audio

All audio is **procedurally generated** using the Web Audio API via Phaser's built-in `SoundManager` context — no audio files are loaded.

| Class         | Purpose                                                |
|---------------|--------------------------------------------------------|
| `SoundFX`     | Short one-shot effects: eat (ascending beeps), move (subtle tick), game over (descending tones) |
| `TitleMusic`  | Looping chiptune melody + bass line scheduled with `OscillatorNode`s on the title screen |

Both classes respect Phaser's global mute and volume settings.

## Tech Stack

| Tool      | Version | Role                |
|-----------|---------|---------------------|
| Phaser    | 4.1+    | Game framework      |
| Vite      | 6.x     | Dev server & bundler|

## License

MIT
