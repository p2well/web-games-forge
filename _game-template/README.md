# Game Name

A Phaser 4 game built with Vite and TypeScript.

## Getting Started

```bash
npm install
npm run dev
```

## Commands

| Command           | Description                              |
|-------------------|------------------------------------------|
| `npm run dev`     | Start the development server on port 8080 |
| `npm run build`   | Create a production build in `dist/`     |
| `npm run preview` | Preview the production build locally     |

## Project Structure

| Path                         | Description                                       |
|------------------------------|---------------------------------------------------|
| `index.html`                 | HTML entry point                                  |
| `public/assets/`             | Static game assets (sprites, audio, etc.)         |
| `public/style.css`           | Global layout styles                              |
| `src/main.ts`                | Application bootstrap                             |
| `src/game/main.ts`           | Game entry point: configures and starts the game  |
| `src/game/scenes/`           | Phaser game scenes                                |
| `vite/config.dev.mjs`        | Vite config for development                       |
| `vite/config.prod.mjs`       | Vite config for production (terser + chunk split) |

## Based On

[Phaser Vite TypeScript Template](https://github.com/phaserjs/template-vite-ts)
