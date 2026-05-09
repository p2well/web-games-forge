import { Scene } from 'phaser';

type WebAudioSound = {
    context: AudioContext;
    masterVolumeNode: AudioNode;
};

/**
 * Procedural retro sound effects using Phaser's WebAudio context.
 */
export class SoundFX {
    private scene: Scene;
    private ctx: AudioContext;
    private masterGain: AudioNode;

    constructor(scene: Scene) {
        this.scene = scene;
        const sound = scene.sound as unknown as WebAudioSound;
        this.ctx = sound.context;
        this.masterGain = sound.masterVolumeNode;
    }

    get muted(): boolean {
        return this.scene.sound.mute;
    }

    play(frequency: number, duration: number, type: OscillatorType = 'square', volume = 0.3): void {
        if (this.muted || !this.ctx) return;

        const oscillator = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);

        const effectiveVolume = volume * this.scene.sound.volume;
        gainNode.gain.setValueAtTime(effectiveVolume, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        oscillator.start(this.ctx.currentTime);
        oscillator.stop(this.ctx.currentTime + duration);
    }

    eat(): void {
        this.play(600, 0.1, 'square', 0.25);
        setTimeout(() => this.play(900, 0.1, 'square', 0.2), 50);
    }

    gameOver(): void {
        this.play(400, 0.15, 'square', 0.3);
        setTimeout(() => this.play(300, 0.15, 'square', 0.25), 150);
        setTimeout(() => this.play(200, 0.3, 'sawtooth', 0.2), 300);
    }

    move(): void {
        this.play(150, 0.03, 'sine', 0.08);
    }
}
