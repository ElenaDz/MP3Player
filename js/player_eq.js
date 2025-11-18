// fixme укажи тип константы
// fixme для эквалайзера используется имя eq
const EQUALIZER_PRESETS = [
    { name: "Default", preamp: 0, bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: "Disco", preamp: -2.5, bands: [-0.5, -0.5, 4, 2.5, 2.5, 2.5, 1.5, -0.5, -0.5, -0.5] },
    { name: "Rok", preamp: -3.36, bands: [-0.5, -1, 4, 2.5, 2.5, 1, 1.5, -0.5, -0.5, -0.5] },
    { name: "Dance", preamp: -4, bands: [-0.5, -0.5, -4.5, 2.5, 3.4, 2.5, -3.5, -1.5, -4.5, -0.5] },
    { name: "Rap", preamp: 1.36, bands: [-2.6, -0.5, 1.5, 3.3, 1.5, -0.5, 2.5, -4.5, -2.8, -0.9] },
    { name: "Minimal", preamp: 2.2, bands: [2, 2.5, -0.5, -2.5, -2, -0.5, 4, -4.5, -4.5, 4] },
    { name: "Funk", preamp: 3.7, bands: [4.1, 2.5, -0.5, -2.5, -2, -0.5, 4, 4.5, 4.5, 4] },
    { name: "My_options", preamp: 0, bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
];
class PlayerEQ {
    constructor($context) {
        // fixme не правильное имя, я должен понимать что храниться в переменной когда читаю ее имя
        // fixme значение подобных констант лучше копировать как полное имя константы, например сейчас это "PlayerEQ.KEY_LOCAL_STORE_EQ"
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
        // fixme нельзя работать с dom компонентов напрямую, ты должна работать с методами и свойствами компонента
        this.$context.find('.b_slider').removeClass('disabled');
        this.initEq();
        this.initShow();
        this.initPresets();
        this.player.$context.on(Player.EVENT_ERROR + " || " + Player.EVENT_LOADED_META_DATA, () => {
            this.disabled(false);
        });
    }
    initPresets() {
        this.$context.find('.preset input').on('click', (e, i) => {
            // fixme для jQuery переменных мы используем приставку $ смотри $context
            let current_preset = $(e.currentTarget);
            EQUALIZER_PRESETS.forEach((preset) => {
                if (preset.name == current_preset.data('preset_name')) {
                    this.eq.loadPreset(preset);
                    this.eqStore = preset;
                }
            });
            this.updateSlider();
        });
        this.sliders.forEach((slider, index) => {
            slider.$context.on(SliderEvents.StopMove, () => {
                this.$context.find('.preset input').prop('checked', 0);
                this.sliders.forEach((slider, index) => {
                    EQUALIZER_PRESETS.forEach((preset) => {
                        if (preset.name == 'My_options') {
                            if (index == 0) {
                                preset.preamp = +slider.value.toFixed(2);
                            }
                            else {
                                preset.bands[index - 1] = +slider.value.toFixed(2);
                            }
                            this.eqStore = preset;
                        }
                    });
                });
            });
        });
        this.sliders.forEach((slider, index) => {
            slider.$context.on(SliderEvents.ValueUpdate, () => {
                let hertz = slider.value;
                if (hertz < slider.value_min || hertz > slider.value_max) {
                    // fixme invalid volume или не volume?
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
    updateSlider() {
        this.sliders.forEach((slider, index) => {
            if (index == 0) {
                slider.value = this.eq.preamp.getValue();
            }
            else {
                slider.value = this.eq.bands[index - 1].getValue();
            }
        });
    }
    // fixme не придумал хорошего имени для константы, и потянулось дальше эта ошибка, теперь и свойство не правильно названо
    get eqStore() {
        // fixme хрупкий код, если стор будет пустой пресет не будет возвращен, лучше проверят и заполнять дефолтным присетом, если пусто
        return JSON.parse(localStorage.getItem(this.KEY_LOCAL_STORE_EQ));
    }
    set eqStore(preset) {
        localStorage.setItem(this.KEY_LOCAL_STORE_EQ, JSON.stringify(preset));
    }
    initShow() {
        this.$context.find('button.eq').on('click', () => {
            this.isShow ? this.close() : this.show();
        });
        this.$context.find('.close').on('click', () => {
            this.close();
        });
        $('html').on('click', (e) => {
            if (!$(e.target).hasClass('b_popup')
                && !$(e.target).hasClass('eq')
                && !$(e.target).parents().hasClass('b_popup')) {
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
        let preset = this.eqStore;
        if (preset) {
            this.eq.loadPreset(preset);
            this.updateSlider();
            this.updateChecked(preset.name);
        }
        else {
            // fixme магическая строка, требуется вынести в константу
            this.updateChecked('Default');
        }
    }
    // fixme не хватает публичных свойств preset, preamp и bands, ну и их повсеместного использования
    updateChecked(name) {
        this.$context.find(`[data-preset_name='${name}']`).prop('checked', 1);
    }
    static create($context = $('.b_player_eq')) {
        return new PlayerEQ($context);
    }
}
