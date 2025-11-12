
// Частоты, на которые настроены полосы эквалайзера (в герцах)
const DEFAULT_BAND_FREQUENCIES = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

// Пресеты эквалайзера: название, значение предусиления (preamp), уровни для каждой полосы
const EQUALIZER_PRESETS = [
    { id: "default", preamp: 0, bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { id: "Classical", preamp: -0.5, bands: [-0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -3.5, -3.5, -3.5, -4.5] },
    { id: "Club", preamp: -3.36, bands: [-0.5, -0.5, 4, 2.5, 2.5, 2.5, 1.5, -0.5, -0.5, -0.5] },
    // ... другие пресеты ...
    { preamp: -3.84, bands: [4, 2.5, -0.5, -2.5, -2, -0.5, 4, 4.5, 4.5, 4] }
];


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


//Класс Equalizer
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

//Обёртка EqualizerManager
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
//
// audioSource — источник звука (аудио/видео/микрофон).
//
// Они соединяются между собой и с другими эффектами (например, эквалайзером).