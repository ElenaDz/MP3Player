
const DEFAULT_BAND_FREQUENCIES = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

// Класс Biquad-полосы
class EQBand {
    filter: BiquadFilterNode;
    private type: any;
    private listeners: any[];
    constructor(context, type, frequency) {
        this.filter = context.context.createBiquadFilter();
        this.filter.type = type;
        this.filter.frequency.value = frequency;
        this.filter.Q.value = 1;
        this.filter.gain.value = 0;
        this.type = type;
        this.listeners = [];
    }

    setValue(value) {
        this.filter.gain.value = value;
        this._triggerChange(value);
    }

    getValue() {
        return this.filter.gain.value;
    }

    getFreq() {
        return this.filter.frequency.value;
    }

    onChange(callback) {
        this.listeners.push(callback);
    }

    _triggerChange(value) {
        this.listeners.forEach(cb => cb("change", this.getFreq(), value));
    }
}

// Класс Equalizer
class Equalizer {
    public preamp: EQBand;
    bands: any[];
    input: BiquadFilterNode;
    output: any;
    constructor(audioContext, bandsFrequencies = DEFAULT_BAND_FREQUENCIES) {
        this.preamp = new EQBand(audioContext, 'highshelf', 0);
        this.bands = [];

        let previous = this.preamp;

        bandsFrequencies.forEach((freq, index) => {
            const type = index === 0 ? 'lowshelf' : 'peaking';
            const band = new EQBand(audioContext, type, freq);
            previous.filter.connect(band.filter);
            previous = band;
            this.bands.push(band);
        });

        this.input = this.preamp.filter;
        this.output = this.bands[this.bands.length - 1].filter;
    }

    loadPreset(preset) {
        preset.bands.forEach((value, i) => {
            this.bands[i].setValue(value);
        });
        this.preamp.setValue(preset.preamp);
    }

    savePreset() {
        return {
            preamp: this.preamp.getValue(),
            bands: this.bands.map(b => b.getValue())
        };
    }

    guessPreamp() {
        const total = this.bands.reduce((sum, b) => sum + b.getValue(), 0);
        return -total / 6;
    }
}

// Обёртка EqualizerManager
class EqualizerManager {
    private audioContext: AudioContext;
    private audioSource: any;
    public equalizer: Equalizer;
    constructor(audioContext, audioSource) {
        this.audioContext = audioContext;
        this.audioSource = audioSource;
        this.equalizer = new Equalizer(audioContext);
    }

    enable() {
        this.audioSource.disconnect();
        this.audioSource.connect(this.equalizer.input);
        this.equalizer.output.connect(this.audioContext.context.destination);
    }

    disable() {
        this.audioSource.disconnect();
        this.audioSource.connect(this.audioContext.destination);
    }

    onChange(callback) {
        this.equalizer.bands.forEach(band => band.onChange(callback));
    }
}

// Экспортируем EqualizerManager, чтобы им можно было пользоваться в других частях приложения
//Схема соединения: [audioElement] → [Equalizer] → [audioContext.destination]
// audioContext — глобальный управляющий объект.
// audioSource — источник звука (аудио/видео/микрофон).
