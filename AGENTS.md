# AGENTS.md

Instructions for AI agents working on this repository.

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

## Technology Stack

- **Phaser 4** (`^4.1.0`) — game framework
- **Vite** (`^6.3.1`) — bundler
- **TypeScript** (`~5.7.2`) — strict mode enabled
- **Terser** — production minification

## Coding Conventions

- Use **TypeScript** for all game code (strict mode, no unused vars/params)
- Use **ESM imports**: `import { Scene, Physics } from 'phaser'`
- Scene classes should extend `Phaser.Scene` and be exported as named exports
- Use `Phaser.Types` for type annotations (e.g., `Phaser.Types.Core.GameConfig`)
- Prefer generating vector textures via `Graphics.generateTexture()` for simple shapes over loading image assets
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `docs:`)

## Verification

Before considering a game complete, always:

1. Run `npx tsc --noEmit` — must pass with zero errors
2. Run `npm run build` — production build must succeed
3. Run `npm run dev` and verify in a browser — game must load and run without console errors
