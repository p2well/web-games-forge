/**
 * NinjaSounds — Procedural footstep sound generator for the ninja asset.
 *
 * Generates soft footstep sounds using Web Audio API oscillators and noise,
 * played directly through Web Audio for zero-latency sync with animation.
 *
 * Usage:
 *   import { createNinjaSounds, attachRunSound } from './NinjaSounds.js';
 *
 *   create() {
 *     createNinjaSounds(this);
 *     const ninja = this.add.sprite(200, 300, 'ninja');
 *     ninja.play('ninja-run');
 *     attachRunSound(this, ninja);
 *   }
 */

const SAMPLE_RATE = 44100;
const FOOTSTEP_DURATION = 0.08;
const FOOTSTEP_SAMPLES = Math.floor(SAMPLE_RATE * FOOTSTEP_DURATION);
const FRAMES_PER_STEP = 3; // fire a footstep every 3 animation frames (= 2 steps per 6-frame cycle)

function seededNoise(seed) {
    const x = Math.sin(seed) * 43758.5453;
    return x - Math.floor(x);
}

/**
 * Generate a single footstep AudioBuffer — a short percussive thud.
 * @param {AudioContext} audioCtx
 * @param {'left'|'right'} foot — left has slightly lower pitch
 * @returns {AudioBuffer}
 */
function generateFootstepAudioBuffer(audioCtx, foot) {
    const audioBuffer = audioCtx.createBuffer(1, FOOTSTEP_SAMPLES, SAMPLE_RATE);
    const data = audioBuffer.getChannelData(0);
    const baseFreq = foot === 'left' ? 90 : 110;

    for (let i = 0; i < FOOTSTEP_SAMPLES; i++) {
        const t = i / SAMPLE_RATE;
        const envelope = Math.exp(-t * 50);
        const thud = Math.sin(2 * Math.PI * baseFreq * t) * 0.5;
        const noise = (seededNoise(i * 0.7 + (foot === 'left' ? 0 : 1000)) * 2 - 1) * 0.3;
        const click = Math.exp(-t * 200) * Math.sin(2 * Math.PI * 800 * t) * 0.2;
        data[i] = (thud + noise + click) * envelope * 0.4;
    }

    return audioBuffer;
}

// Module-level store for generated AudioBuffers (keyed by AudioContext + foot)
const bufferCache = new Map();

function getBuffers(audioCtx) {
    if (!bufferCache.has(audioCtx)) {
        bufferCache.set(audioCtx, {
            left: generateFootstepAudioBuffer(audioCtx, 'left'),
            right: generateFootstepAudioBuffer(audioCtx, 'right'),
        });
    }
    return bufferCache.get(audioCtx);
}

/**
 * Play a footstep directly via Web Audio API for minimal latency.
 */
function playFootstep(audioCtx, buffer, volume) {
    const source = audioCtx.createBufferSource();
    const gain = audioCtx.createGain();
    gain.gain.value = volume;
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start(0);
}

/**
 * Pre-generates footstep AudioBuffers. Call once in your scene's create().
 *
 * @param {Phaser.Scene} scene
 */
export function createNinjaSounds(scene) {
    const audioCtx = scene.sound.context;
    if (!audioCtx) return;
    getBuffers(audioCtx);
}

/**
 * Attaches footstep sounds to a ninja sprite so they play automatically
 * in sync with the run animation. Uses a frame counter to trigger a step
 * every 3 animation frames (= 2 steps per 6-frame cycle), alternating
 * left/right.
 *
 * @param {Phaser.Scene}              scene
 * @param {Phaser.GameObjects.Sprite} sprite
 * @param {object}                    [opts]
 * @param {number}                    [opts.volume=0.3]
 * @returns {function} detach — call to remove the listener
 */
export function attachRunSound(scene, sprite, opts = {}) {
    const { volume = 0.3 } = opts;

    const audioCtx = scene.sound.context;
    if (!audioCtx) {
        return () => {};
    }

    const buffers = getBuffers(audioCtx);
    let frameCount = 0;
    let isLeft = true;

    const onFrameChange = () => {
        frameCount++;
        if (frameCount % FRAMES_PER_STEP === 0) {
            playFootstep(audioCtx, isLeft ? buffers.left : buffers.right, volume);
            isLeft = !isLeft;
        }
    };

    sprite.on('animationupdate', onFrameChange);

    return () => {
        sprite.off('animationupdate', onFrameChange);
    };
}

export const NINJA_STEP_LEFT_KEY = 'ninja-step-left';
export const NINJA_STEP_RIGHT_KEY = 'ninja-step-right';
