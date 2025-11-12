class PlayerEQ {
    constructor($context) {
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
        this.updatePreset();
        this.player.$context.on(Player.EVENT_ERROR + " || " + Player.EVENT_LOADED_META_DATA, () => {
            this.disabled(false);
        });
    }
    updatePreset() {
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
                if (hertz < slider.value_max || hertz > slider.value_min) {
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
    enable() {
        this.$context.find('.b_slider').removeClass('disabled');
    }
    static create($context = $('.b_player_eq')) {
        return new PlayerEQ($context);
    }
}
