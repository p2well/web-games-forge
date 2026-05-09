/**
 * NinjaAssets — Procedural pixel-art ninja spritesheet generator.
 *
 * Usage (inside a Phaser 4 Scene):
 *   import { createNinjaAssets } from '../../shared-assets/ninja/NinjaAssets.js';
 *
 *   create() {
 *     createNinjaAssets(this);                // registers texture + animations
 *     const ninja = this.add.sprite(200, 300, 'ninja');
 *     ninja.play('ninja-run');
 *   }
 */

const FRAME_W = 32;
const FRAME_H = 32;
const FRAME_COUNT = 6;
const SCALE = 1;

// Color palette
const C = {
    TRANSPARENT: null,
    OUTLINE: '#1a1a2e',
    BODY: '#2d2d5e',
    BODY_LIGHT: '#3a3a7e',
    BELT: '#8b0000',
    HEADBAND: '#cc0000',
    HEADBAND_TAIL: '#aa0000',
    SKIN: '#e8c090',
    EYES: '#ffffff',
    PUPIL: '#1a1a1a',
    SHOE: '#222222',
    SCARF_TRAIL: '#bb0000',
};

// Each frame is a 32x32 grid. Legend:
//   . = transparent,  O = outline,  B = body,  L = body_light,
//   E = belt,  H = headband,  T = headband_tail,  S = skin,
//   W = eyes(white),  P = pupil,  X = shoe, R = scarf_trail
const PALETTE_MAP = {
    '.': C.TRANSPARENT,
    'O': C.OUTLINE,
    'B': C.BODY,
    'L': C.BODY_LIGHT,
    'E': C.BELT,
    'H': C.HEADBAND,
    'T': C.HEADBAND_TAIL,
    'S': C.SKIN,
    'W': C.EYES,
    'P': C.PUPIL,
    'X': C.SHOE,
    'R': C.SCARF_TRAIL,
};

// 6-frame running animation, each frame 32 chars wide × 32 rows
const FRAMES = [
    // Frame 0: right foot forward, left arm forward
    [
        '................................',
        '................................',
        '................................',
        '................................',
        '..........OOOOOOO...............',
        '.........OHHHHHHO...............',
        '.........OHHHHHHORT.............',
        '........OSSSWPSSOORT............',
        '........OSSSWPSSOO..............',
        '.........OOSSSOO................',
        '..........OBBBO.................',
        '.........OLBBBBBO...............',
        '........OLLLBBBBO...............',
        '........OBLEEELBO...............',
        '.........OBBBBBBO...............',
        '.........OBBOBBO................',
        '........OBB.OBBO................',
        '........OBB..OBO................',
        '.......OBB...OBO................',
        '.......OBO....OO................',
        '......OBO........................',
        '......OXO........................',
        '.......O.........................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
    ],
    // Frame 1: mid stride, both legs under body
    [
        '................................',
        '................................',
        '................................',
        '................................',
        '..........OOOOOOO...............',
        '.........OHHHHHHO...............',
        '.........OHHHHHHO.RT............',
        '........OSSSWPSSO.ORT...........',
        '........OSSSWPSSOO..............',
        '.........OOSSSOO................',
        '..........OBBBO.................',
        '..........OBBBO.................',
        '.........OLBBBBLO...............',
        '.........OBLEEELBO..............',
        '.........OBBBBBO................',
        '..........OBBBO.................',
        '..........OBOOB.................',
        '.........OBO.OBO................',
        '.........OXO.OXO................',
        '..........O...O.................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
    ],
    // Frame 2: left foot forward, right arm forward
    [
        '................................',
        '................................',
        '................................',
        '................................',
        '..........OOOOOOO...............',
        '.........OHHHHHHO...............',
        '.........OHHHHHHORT.............',
        '........OSSSWPSSOORT............',
        '........OSSSWPSSOO..............',
        '.........OOSSSOO................',
        '..........OBBBO.................',
        '.........OBBBBBLO...............',
        '........OBBBBLLBO...............',
        '........OBLEEELBO...............',
        '.........OBBBBBO................',
        '..........OBBBO.................',
        '..........OBOOB.................',
        '.........OBO..OBO...............',
        '........OBO...OBB...............',
        '........OO....OBO...............',
        '...............OBO..............',
        '...............OXO..............',
        '................O...............',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
    ],
    // Frame 3: left leg extended back, body leaning
    [
        '................................',
        '................................',
        '................................',
        '................................',
        '...........OOOOOOO..............',
        '..........OHHHHHHO..............',
        '..........OHHHHHHO.RT...........',
        '.........OSSSWPSSOOORT..........',
        '.........OSSSWPSSOO.............',
        '..........OOSSSOO...............',
        '...........OBBBO................',
        '..........OLBBBBBO..............',
        '.........OLLLBBBBO..............',
        '.........OBLEEELBO..............',
        '..........OBBBBBBO..............',
        '..........OBBOBBO...............',
        '.........OBB.OBBO...............',
        '.........OBB..OBO...............',
        '........OBB...OBO...............',
        '........OBO....OO...............',
        '.......OBO.......................',
        '.......OXO.......................',
        '........O........................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
    ],
    // Frame 4: mid stride opposite
    [
        '................................',
        '................................',
        '................................',
        '................................',
        '..........OOOOOOO...............',
        '.........OHHHHHHO...............',
        '.........OHHHHHHO..RT...........',
        '........OSSSWPSSO..ORT..........',
        '........OSSSWPSSOO..............',
        '.........OOSSSOO................',
        '..........OBBBO.................',
        '..........OBBBO.................',
        '.........OLBBBBLO...............',
        '.........OBLEEELBO..............',
        '.........OBBBBBO................',
        '..........OBBBO.................',
        '.........OBOBBO.................',
        '........OBO.OBO.................',
        '........OXO.OXO.................',
        '.........O...O..................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
    ],
    // Frame 5: right leg extended back
    [
        '................................',
        '................................',
        '................................',
        '................................',
        '..........OOOOOOO...............',
        '.........OHHHHHHO...............',
        '.........OHHHHHHORT.............',
        '........OSSSWPSSOORT............',
        '........OSSSWPSSOO..............',
        '.........OOSSSOO................',
        '..........OBBBO.................',
        '.........OBBBBBLO...............',
        '........OBBBBLLBO...............',
        '........OBLEEELBO...............',
        '.........OBBBBBO................',
        '..........OBBBO.................',
        '.........OBOBBO.................',
        '........OBO..OBO...............',
        '.......OBO...OBB...............',
        '.......OO....OBO...............',
        '..............OBO...............',
        '..............OXO...............',
        '...............O................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
    ],
];

function renderFrameToCanvas(ctx, frameData, offsetX) {
    for (let y = 0; y < FRAME_H; y++) {
        const row = frameData[y];
        for (let x = 0; x < FRAME_W; x++) {
            const ch = row[x] || '.';
            const color = PALETTE_MAP[ch];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(offsetX + x * SCALE, y * SCALE, SCALE, SCALE);
            }
        }
    }
}

/**
 * Generates a spritesheet canvas with all ninja frames side by side.
 * @returns {HTMLCanvasElement}
 */
function generateSpritesheetCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = FRAME_W * SCALE * FRAME_COUNT;
    canvas.height = FRAME_H * SCALE;
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < FRAME_COUNT; i++) {
        renderFrameToCanvas(ctx, FRAMES[i], i * FRAME_W * SCALE);
    }

    return canvas;
}

/**
 * Registers the ninja spritesheet texture and running animation in the given scene.
 *
 * @param {Phaser.Scene} scene — any active Phaser 4 scene
 * @param {object}       [opts]
 * @param {string}       [opts.textureKey='ninja']      — texture key
 * @param {string}       [opts.animKey='ninja-run']     — animation key
 * @param {number}       [opts.frameRate=10]            — animation fps
 */
export function createNinjaAssets(scene, opts = {}) {
    const {
        textureKey = 'ninja',
        animKey = 'ninja-run',
        frameRate = 10,
    } = opts;

    if (scene.textures.exists(textureKey)) {
        return;
    }

    const canvas = generateSpritesheetCanvas();
    scene.textures.addSpriteSheet(textureKey, canvas, {
        frameWidth: FRAME_W * SCALE,
        frameHeight: FRAME_H * SCALE,
    });

    if (!scene.anims.exists(animKey)) {
        scene.anims.create({
            key: animKey,
            frames: scene.anims.generateFrameNumbers(textureKey, {
                start: 0,
                end: FRAME_COUNT - 1,
            }),
            frameRate,
            repeat: -1,
        });
    }
}

export const NINJA_FRAME_WIDTH = FRAME_W * SCALE;
export const NINJA_FRAME_HEIGHT = FRAME_H * SCALE;
export const NINJA_TEXTURE_KEY = 'ninja';
export const NINJA_RUN_ANIM_KEY = 'ninja-run';
