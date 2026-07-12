# AGENTS.md

Instructions for AI agents working on this repository. This is the single
source of truth for repository conventions and workflows.

## Project Overview

This is a collection of experimental 2D web games built with **Phaser 4** (the
latest major version, released April 2026), using Phaser's scene-based
architecture with WebGL rendering. Each game is self-contained in its own
directory. Licensed MIT.

## Phaser 4 Key Concepts

- Games are structured as **Scenes** with a lifecycle: `init → preload → create → update`
- Use `this.add` (GameObjectFactory) to create display objects within a scene
- Use `this.load` (LoaderPlugin) in `preload()` to queue assets
- Use `this.input` for keyboard/mouse/touch/gamepad handling
- Phaser 4 uses a **render node** architecture — custom rendering extends `RenderNode` rather than using pipelines (the v3 pattern)
- Import as ESM: `import Phaser from 'phaser'` (or use the UMD bundle via CDN)
- See `phaser-research.md` for detailed architecture notes

## Creating a New Game

Always create new games by copying the `_game-template/` directory:

1. Copy `_game-template/` to `<game-name>/`
2. Update `package.json`: set `name` and `description`
3. Update `index.html`: set `<title>`
4. Run `npm install` inside the new game directory
5. Implement scenes in `src/game/scenes/`
6. Update `src/game/main.ts` to import and register your scenes

### Template Structure

```
<game-name>/
├── index.html                  # HTML entry point
├── package.json                # Phaser ^4.1.0, Vite, TypeScript
├── tsconfig.json               # Strict TypeScript config
├── vite/
│   ├── config.dev.mjs          # Dev config (fast rebuilds, Phaser chunk split)
│   └── config.prod.mjs         # Prod config (terser minification + chunk split)
├── public/
│   ├── style.css               # Global layout styles
│   └── assets/                 # Static game assets (sprites, audio, etc.)
└── src/
    ├── main.ts                 # App bootstrap (framework-ready for Vue/React)
    ├── vite-env.d.ts           # Vite type references
    └── game/
        ├── main.ts             # Game config and startup
        └── scenes/             # Phaser scenes (Boot, Preloader, Game, etc.)
```

### Key Design Decisions

- **Double-`main.ts` pattern**: `src/main.ts` bootstraps the app, `src/game/main.ts` configures Phaser. This enables future framework integration (Vue, React, etc.)
- **`src/game/` nesting**: Game code lives under `src/game/` to keep it separate from app-level code
- **Split Vite configs**: `vite/config.dev.mjs` for development, `vite/config.prod.mjs` for production with terser + Phaser chunk splitting
- **Static assets**: Place in `public/assets/` — served directly at runtime, copied to `dist/assets` on build

## Publishing a Game to `web-games`

When a game is finished, promote it to the
[`web-games`](https://github.com/p2well/web-games) portfolio repo. That repo
publishes every finished game to GitHub Pages at
`https://p2well.github.io/web-games/<game>/` via a GitHub Actions workflow.
The forge stays the development lab; the publishing pipeline (deploy workflow,
landing gallery, per-game subfolders) lives in `web-games`, not here.

Perform these steps **in the `web-games` repo, on a feature branch**:

1. **Make the game path-portable** so it works under a `/web-games/<game>/`
   subpath:
   - `vite/config.prod.mjs` must use `base: './'` (relative paths). The
     `_game-template/` already does this.
   - Every asset URL in `public/style.css` must be **relative** — e.g.
     `url('./assets/pixeltype.ttf')`, never `url('/assets/pixeltype.ttf')`.
     Absolute (`/assets/...`) paths 404 on a Pages project subpath.
2. **Copy the game** — copy the game's self-contained directory from the forge
   into `web-games/<game>/`, **excluding** `node_modules/` and `dist/`.
3. **Add a gallery card** — add an `<a class="card" href="./<game>/">…</a>`
   entry to `web-games/index.html`.
4. **Add Dependabot coverage** — add an `npm` entry for `/<game>` to
   `web-games/.github/dependabot.yml` (Dependabot scans one manifest directory
   per entry).
5. **Verify** inside `web-games/<game>/`:
   - `npm install`
   - `npx tsc --noEmit` — must pass with zero errors
   - `npm run build` — must succeed; confirm the built `dist/style.css` asset
     URLs are relative
6. **Open a PR** targeting `web-games`'s `main`. On merge, the deploy workflow
   builds every game folder and publishes the updated site.

## Technology Stack

- **Phaser 4** (`^4.1.0`) — game framework. WebGL-first rendering (Canvas
  fallback), node-based renderer
- **Physics**: Arcade Physics (lightweight) or Matter.js (full-body) via
  Phaser's built-in integration
- **Vite** (`^6.3.1`) — bundler
- **TypeScript** (`~5.7.2`) — strict mode enabled
- **Terser** — production minification
- **License**: MIT

## Coding Conventions

- Use **TypeScript** for all game code (strict mode, no unused vars/params)
- Use **ESM imports**: `import { Scene, Physics } from 'phaser'`
- Scene classes should extend `Phaser.Scene` and be exported as named exports
- Use `Phaser.Types` for type annotations (e.g., `Phaser.Types.Core.GameConfig`)
- Prefer generating vector textures via `Graphics.generateTexture()` for simple shapes over loading image assets
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `docs:`)

## Classic Arcade Style Guide

When creating a game with a **classic arcade** aesthetic (80s gaming hall style), apply the following visual conventions consistently across all scenes.

### Color Palette

| Role            | Color     | Hex       |
|-----------------|-----------|-----------|
| Background      | Pure black| `#000000` |
| Primary / Snake | Neon green| `#00ff00` |
| Accent / Food   | Hot pink  | `#ff0055` |
| Headings / CTA  | Yellow    | `#ffff00` |
| Info text       | Cyan      | `#00ccff` |
| Body text       | White     | `#ffffff` |
| Danger / Death  | Red       | `#ff0000` |

### Typography

- Use the **Pixeltype** bitmap font (`public/assets/pixeltype.ttf`) for all in-game text
- Load via `@font-face` in `public/style.css` and await `document.fonts.load()` in the first scene before rendering text
- All text should be **UPPERCASE**
- Score displays use **zero-padded** format: `SCORE  00130`, `HI  00450`

### Rendering Style

- **Sharp pixel blocks** — use `fillRect()` for all game objects, never `fillRoundedRect()` or `fillCircle()`
- **1px gap** between grid cells for visual separation (e.g., `fillRect(x + 1, y + 1, size - 2, size - 2)`)
- **Highlight pixels** — small bright squares on objects for a specular/shine effect
- **Outer glow** — semi-transparent larger rect behind key objects (food, power-ups)
- Playing field uses a **dot-grid** pattern (1px dots at grid intersections, ~10% opacity green)

### CRT / Cabinet Effects (CSS)

Apply these in `public/style.css` on `#game-container`:

- **Neon green border** with box-shadow glow (`0 0 8px rgba(0,255,0,0.4)`)
- **Scanline overlay** via `::after` pseudo-element with `repeating-linear-gradient` (2px transparent + 2px semi-black)
- **Black page background** (`body { background-color: #000 }`)
- No `border-radius` — sharp corners only

### Scene Layout Conventions

- **Decorative border frames** — thin green or red `strokeRect` around full-screen scenes (Splash, Boot, GameOver)
- **Separator lines** — 1px horizontal lines between content sections (colored to match section theme)
- **Blinking prompts** — CTA text (e.g., "PRESS SPACE OR ENTER") uses a tween with `alpha: 0.2`, `duration: 600`, `yoyo: true`, `loop: -1`
- **Score bar** — top area above the playing field with `SCORE` left-aligned and `HI` right-aligned

### Reference Implementation

See `snake-game/` for a complete example of this style applied to all scenes (Splash, Boot, Game, GameOver).

## Verification

Before considering a game complete, always:

1. Run `npx tsc --noEmit` — must pass with zero errors
2. Run `npm run build` — production build must succeed
3. Run `npm run dev` and verify in a browser — game must load and run without console errors
