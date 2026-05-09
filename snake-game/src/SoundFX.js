/**
 * Procedural retro sound effects using Phaser's WebAudio context.
 * Leverages Phaser's SoundManager for autoplay unlock, mute, and pause integration.
 */
export class SoundFX {
    constructor(scene) {
        this.scene = scene;
        this.ctx = scene.sound.context;
        this.masterGain = scene.sound.masterVolumeNode;
    }

    get muted() {
        return this.scene.sound.mute;
    }

    play(frequency, duration, type = 'square', volume = 0.3) {
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

    eat() {
        this.play(600, 0.1, 'square', 0.25);
        setTimeout(() => this.play(900, 0.1, 'square', 0.2), 50);
    }

    gameOver() {
        this.play(400, 0.15, 'square', 0.3);
        setTimeout(() => this.play(300, 0.15, 'square', 0.25), 150);
        setTimeout(() => this.play(200, 0.3, 'sawtooth', 0.2), 300);
    }

    move() {
        this.play(150, 0.03, 'sine', 0.08);
    }
}
