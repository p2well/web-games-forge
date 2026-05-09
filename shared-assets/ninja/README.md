# Ninja — Shared Asset

A procedurally-generated pixel-art ninja sprite with a running animation, designed for reuse across games in this project.

## Quick Start

```js
import {
    createNinjaAssets,
    createNinjaSounds,
    attachRunSound,
} from '../../shared-assets/ninja/index.js';

// Inside your Scene's create() method:
create() {
    createNinjaAssets(this);
    createNinjaSounds(this);    // procedural footstep sounds

    const ninja = this.add.sprite(200, 300, 'ninja');
    ninja.play('ninja-run');

    attachRunSound(this, ninja); // auto-plays footsteps on contact frames

    // Flip for left-facing movement
    ninja.setFlipX(true);

    // Scale up for visibility (the sprite is 32×32 natively)
    ninja.setScale(3);
}
```

## API

### `createNinjaAssets(scene, opts?)`

Registers the ninja spritesheet texture and running animation in the given scene.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `textureKey` | `string` | `'ninja'` | Key for the texture in TextureManager |
| `animKey` | `string` | `'ninja-run'` | Key for the running animation |
| `frameRate` | `number` | `10` | Frames per second |

### Exported Constants

| Name | Value | Description |
|------|-------|-------------|
| `NINJA_TEXTURE_KEY` | `'ninja'` | Default texture key |
| `NINJA_RUN_ANIM_KEY` | `'ninja-run'` | Default animation key |
| `NINJA_FRAME_WIDTH` | `32` | Pixel width per frame |
| `NINJA_FRAME_HEIGHT` | `32` | Pixel height per frame |
| `NINJA_STEP_LEFT_KEY` | `'ninja-step-left'` | Left footstep sound key |
| `NINJA_STEP_RIGHT_KEY` | `'ninja-step-right'` | Right footstep sound key |

### `createNinjaSounds(scene, opts?)`

Generates procedural footstep sounds and registers them as audio cache entries.
Uses Web Audio API — no external sound files needed.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `leftKey` | `string` | `'ninja-step-left'` | Cache key for left footstep |
| `rightKey` | `string` | `'ninja-step-right'` | Cache key for right footstep |

### `attachRunSound(scene, sprite, opts?)`

Listens to `animationupdate` and plays footstep sounds on contact frames (0 and 3).
Returns a `detach()` function to remove the listener.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `leftKey` | `string` | `'ninja-step-left'` | Left footstep sound key |
| `rightKey` | `string` | `'ninja-step-right'` | Right footstep sound key |
| `volume` | `number` | `0.3` | Playback volume (0–1) |

## Details

- **Frame size**: 32 × 32 pixels
- **Frames**: 6-frame running cycle
- **Style**: Dark ninja with red headband and trailing scarf
- **No external image files** — the sprite is generated at runtime via Canvas 2D
- **No external sound files** — footstep sounds are generated via Web Audio API oscillators
