# Copilot Instructions

## Project Overview

This is a collection of experimental 2D web games built with **Phaser 4** (the latest major version, released April 2026). The project uses Phaser's scene-based architecture with WebGL rendering.

## Technology Stack

- **Game Framework**: Phaser 4 — see `phaser-research.md` for detailed architecture notes
- **Rendering**: WebGL-first (Canvas fallback), node-based renderer
- **Physics**: Arcade Physics (lightweight) or Matter.js (full-body) via Phaser's built-in integration
- **License**: MIT

## Phaser 4 Key Concepts

- Games are structured as **Scenes** with a lifecycle: `init → preload → create → update`
- Use `this.add` (GameObjectFactory) to create display objects within a scene
- Use `this.load` (LoaderPlugin) in `preload()` to queue assets
- Use `this.input` for keyboard/mouse/touch/gamepad handling
- Phaser 4 uses a **render node** architecture — custom rendering extends `RenderNode` rather than using pipelines (v3 pattern)
- Import as ESM: `import Phaser from 'phaser'` (or use the UMD bundle via CDN)

## Conventions

- Each game should be self-contained in its own directory
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat:`, `fix:`, `docs:`)
