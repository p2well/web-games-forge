/**
 * Procedural chiptune music generator using Phaser's WebAudio context.
 * Generates a retro 8-bit style looping melody for the title screen.
 */
export class TitleMusic {
    constructor(scene) {
        this.scene = scene;
        this.ctx = scene.sound.context;
        this.masterGain = scene.sound.masterVolumeNode;
        this.playing = false;
        this.scheduledUntil = 0;
        this.loopInterval = null;

        // Dedicated gain node so we can silence all scheduled notes instantly
        this.outputGain = this.ctx.createGain();
        this.outputGain.connect(this.masterGain);
    }

    // Classic snake-game style melody — simple, catchy, retro
    get melody() {
        return [
            { note: 'E4', dur: 0.15 },
            { note: 'G4', dur: 0.15 },
            { note: 'A4', dur: 0.15 },
            { note: 'B4', dur: 0.3 },
            { note: null, dur: 0.1 },
            { note: 'A4', dur: 0.15 },
            { note: 'G4', dur: 0.15 },
            { note: 'E4', dur: 0.3 },
            { note: null, dur: 0.1 },
            { note: 'D4', dur: 0.15 },
            { note: 'E4', dur: 0.15 },
            { note: 'G4', dur: 0.15 },
            { note: 'A4', dur: 0.3 },
            { note: null, dur: 0.1 },
            { note: 'G4', dur: 0.15 },
            { note: 'E4', dur: 0.15 },
            { note: 'D4', dur: 0.3 },
            { note: null, dur: 0.3 },
        ];
    }

    // Bass line
    get bass() {
        return [
            { note: 'E2', dur: 0.6 },
            { note: 'A2', dur: 0.6 },
            { note: 'D2', dur: 0.6 },
            { note: 'G2', dur: 0.6 },
            { note: 'E2', dur: 0.6 },
            { note: 'A2', dur: 0.3 },
            { note: 'B2', dur: 0.3 },
        ];
    }

    noteToFreq(note) {
        if (!note) return 0;
        const notes = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
        const name = note[0];
        const octave = parseInt(note[note.length - 1]);
        const semitone = notes[name] + (note.includes('#') ? 1 : 0);
        return 440 * Math.pow(2, (semitone - 9) / 12 + (octave - 4));
    }

    playNote(freq, startTime, duration, type = 'square', volume = 0.12) {
        if (!freq || !this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.outputGain);

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        const effectiveVol = volume * this.scene.sound.volume;
        gain.gain.setValueAtTime(effectiveVol, startTime);
        gain.gain.setValueAtTime(effectiveVol, startTime + duration * 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    scheduleLoop() {
        if (!this.playing) return;

        const now = this.ctx.currentTime;
        let startTime = Math.max(now, this.scheduledUntil);

        // Schedule melody
        let melodyTime = startTime;
        for (const { note, dur } of this.melody) {
            if (note) {
                this.playNote(this.noteToFreq(note), melodyTime, dur * 0.9, 'square', 0.10);
            }
            melodyTime += dur;
        }

        // Schedule bass
        let bassTime = startTime;
        const totalMelodyDur = this.melody.reduce((sum, n) => sum + n.dur, 0);
        while (bassTime < startTime + totalMelodyDur) {
            for (const { note, dur } of this.bass) {
                if (bassTime >= startTime + totalMelodyDur) break;
                if (note) {
                    this.playNote(this.noteToFreq(note), bassTime, dur * 0.8, 'triangle', 0.08);
                }
                bassTime += dur;
            }
        }

        this.scheduledUntil = startTime + totalMelodyDur;
    }

    start() {
        if (this.playing) return;
        this.playing = true;
        this.scheduledUntil = this.ctx.currentTime;

        this.scheduleLoop();
        // Re-schedule ahead of time to avoid gaps
        const loopDuration = this.melody.reduce((sum, n) => sum + n.dur, 0) * 1000;
        this.loopInterval = setInterval(() => {
            if (this.playing) this.scheduleLoop();
        }, loopDuration - 200);
    }

    stop() {
        this.playing = false;
        if (this.loopInterval) {
            clearInterval(this.loopInterval);
            this.loopInterval = null;
        }
        // Immediately silence all pre-scheduled notes
        this.outputGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.outputGain.disconnect();
    }
}
