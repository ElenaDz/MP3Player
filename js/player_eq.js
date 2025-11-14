const EQUALIZER_PRESETS = [
    { name: "Default", preamp: 0, bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: "Disco", preamp: -2.5, bands: [-0.5, -0.5, 4, 2.5, 2.5, 2.5, 1.5, -0.5, -0.5, -0.5] },
    { name: "Rok", preamp: -3.36, bands: [-0.5, -1, 4, 2.5, 2.5, 1, 1.5, -0.5, -0.5, -0.5] },
    { name: "Dance", preamp: -4, bands: [-0.5, -0.5, -4.5, 2.5, 3.4, 2.5, -3.5, -1.5, -4.5, -0.5] },
    { name: "Rap", preamp: 1.36, bands: [-2.6, -0.5, 1.5, 3.3, 1.5, -0.5, 2.5, -4.5, -2.8, -0.9] },
    { name: "Minimal", preamp: 2.2, bands: [2, 2.5, -0.5, -2.5, -2, -0.5, 4, -4.5, -4.5, 4] },
    { name: "Funk", preamp: 3.7, bands: [4.1, 2.5, -0.5, -2.5, -2, -0.5, 4, 4.5, 4.5, 4] }
];
class PlayerEQ {
    constructor($context) {
        this.KEY_LOCAL_STORE_EQ = 'eq';
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].EQ)
            return this.$context[0].EQ;
        // @ts-ignore
        this.$context[0].EQ = this;
        this.player = Player.create();
        this.sliders = Slider.create(this.$context);
        this.disabled();
        this.enable();
        this.initEq();
        this.initShow();
        this.initPresets();
        this.player.$context.on(Player.EVENT_ERROR + " || " + Player.EVENT_LOADED_META_DATA, () => {
            this.disabled(false);
        });
    }
    // fixme переименовать initPresets ok
    initPresets() {
        this.$context.find('.preset input').on('click', (e, i) => {
            let preset = $(e.currentTarget);
            this.eq.loadPreset(preset.data('preset'));
            this.sliders.forEach((slider, index) => {
                if (index == 0) {
                    slider.value = this.eq.preamp.getValue();
                }
                else {
                    slider.value = this.eq.bands[index - 1].getValue();
                }
            });
        });
        this.sliders.forEach((slider, index) => {
            slider.$context.on(SliderEvents.ValueUpdate, () => {
                let hertz = slider.value;
                if (hertz < slider.value_min || hertz > slider.value_max) {
                    throw new Error(`Invalid volume "${hertz}"`);
                }
                if (index !== 0) {
                    this.eq.bands[index - 1].setValue(hertz);
                }
                else {
                    this.eq.preamp.setValue(hertz);
                }
            });
        });
    }
    initShow() {
        this.$context.find('button.eq').on('click', () => {
            this.isShow ? this.close() : this.show();
        });
        this.$context.find('.close').on('click', () => {
            this.close();
        });
        // клик вне эквалайзера приводит к закрытию эквалайзера
        $('html').on('click', (e) => {
            if (!$(e.target).hasClass('popup')
                && !$(e.target).hasClass('eq')
                && !$(e.target).parents().hasClass('popup')) {
                this.close();
                this.$context.find('.inner_dots').removeClass('open');
            }
        });
        this.initDots();
    }
    initDots() {
        this.$context.find('form').on('submit', (event) => {
            event.preventDefault();
        });
        this.$context.find('button.dots').on('click', () => {
            this.$context.find('.inner_dots').toggleClass('open');
        });
    }
    show() {
        this.$context.addClass('show');
    }
    close() {
        this.$context.removeClass('show');
    }
    get isShow() {
        return this.$context.hasClass('show');
    }
    get eqStore() {
        return parseFloat(localStorage.getItem(this.KEY_LOCAL_STORE_EQ));
    }
    set eqStore(eq) {
        localStorage.setItem(this.KEY_LOCAL_STORE_EQ, String(eq));
    }
    disabled(disabled = true) {
        disabled ? this.$context.addClass('disabled') : this.$context.removeClass('disabled');
    }
    initEq() {
        const music = { Equalizer: EqualizerManager };
        const audioElement = this.player.getAudio();
        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaElementSource(audioElement);
        let equalizerManager = new music.Equalizer(audioSource, audioSource);
        equalizerManager.enable();
        this.eq = equalizerManager.equalizer;
    }
    // fixme не нужно это свойство судя по тому что ты его один раз вызываешь, просто вызови этот код в конструкторе
    enable() {
        this.$context.find('.b_slider').removeClass('disabled');
    }
    static create($context = $('.b_player_eq')) {
        return new PlayerEQ($context);
    }
}
