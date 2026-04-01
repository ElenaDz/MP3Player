const EQ_PRESETS = {
    Default: { name: "Default", preamp: 0, bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    Classical: { name: "Classical", preamp: -1, bands: [0, 0.5, 1, 2, 2, 1.5, 1, 0.5, 0, -0.5] },
    Club: { name: "Club", preamp: 2, bands: [0, 0, 0.5, 0.7, 0.7, 0.7, 0.5, 0, 0, 0] },
    Full_Bass: { name: "Full Bass", preamp: 3, bands: [2, 2, 2, 0.9, 0, -0.9, -1.5, -2, -2, -2] },
    Full_Bass_Treble: { name: "Full Bass & Treble", preamp: 0, bands: [1.5, 1, 0, -1.8, -1, 0, 1.5, 2.2, 3, 3] },
    Full_Treble: { name: "Full Treble", preamp: 0, bands: [-2.5, -2.5, -2.5, -0.5, 0.5, 2.5, 4, 4, 4, 4] },
    Large_hall: { name: "Large hall", preamp: 0, bands: [2.5, 2.5, 1, 1, 0, -1, -1, -1, 0, 0] },
    Live: { name: "Live", preamp: 0, bands: [-1, 0, 0.5, 1, 1, 1.5, 1.5, 0.5, 0.3, 0.2] },
    Party: { name: "Party", preamp: 0, bands: [1.5, 1.5, 0, 0, 0, 0, 0, 0, 1.5, 1.5] },
    Pop: { name: "Pop", preamp: 0, bands: [-0.7, 0.7, 1.5, 1.5, 1, -0.7, -1, -1, -1, -1] },
    Reggae: { name: "Reggae", preamp: 0, bands: [0, 0, -0.5, -1.5, 0, 1.5, 1.5, 0, 0, 0] },
    Soft: { name: "Soft", preamp: 0, bands: [1, 0, -0.5, -1, -0.5, 1, 2, 2.5, 3, 3.7] },
    Soft_Rock: { name: "Soft_Rock", preamp: 0, bands: [1, 1, 0.5, -0.3, -1, -1.4, -1, -0.3, 0.5, 2.3] },
    Disco: { name: "Disco", preamp: -2.5, bands: [3.5, 3, 1, -1, -2, -1, 1.5, 3, 3.5, 4] },
    Techno: { name: "Techno", preamp: -1.5, bands: [2, 1.5, 0, -1.5, -0.9, 0, 1.6, 2, 2, 1.8] },
    Rok: { name: "Rok", preamp: 0, bands: [1.19, 0.5, -1.3, -2.03, -0.7, 0.5, 2.2, 2.7, 2.7, 2.7] },
    Dance: { name: "Dance", preamp: 0, bands: [2.5, 1.8, 0.6, -0.1, -0.1, -1.7, -2.0, -2.0, -0.1, -0.1] },
    Rap: { name: "Rap", preamp: -3, bands: [5, 4, 2, 0, -1, 1.5, 3, 2, 1, 0] },
    Minimal: { name: "Minimal", preamp: -1.5, bands: [2, 1.5, 0.5, 0, -0.5, 0, 0.5, 1.5, 2, 2.5] },
    Funk: { name: "Funk", preamp: -2, bands: [3, 2.5, 1, 1.5, 2, 1.5, 1, 2.5, 3, 2] },
    Custom: null
};
class PlayerEQ {
    constructor($context) {
        this.eq_init = false;
        this.KEY_LOCAL_STORE_PRESET = 'PlayerEQ.KEY_LOCAL_STORE_PRESET';
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].EQ)
            return this.$context[0].EQ;
        // @ts-ignore
        this.$context[0].EQ = this;
        this.player = Player.create();
        this.addEq();
        this.sliders = Slider.create(this.$context);
        this.sliders_bands = Slider.create(this.$context.find('.bands'));
        this.slider_preamp = Slider.create(this.$context.find('.preamp'))[0];
        this.disabled();
        this.sliders.forEach((slider, index) => {
            slider.disabled = false;
        });
        this.$context.on(PlayerEQ.EVENT_UPDATE_BANDS, (e, index) => {
            let slider_value = +this.sliders_bands[index].value;
            if (slider_value != this.getBand(index)) {
                this.sliders_bands[index].value = this.getBand(index);
            }
        });
        this.$context.on(PlayerEQ.EVENT_UPDATE_PREAMP, () => {
            if (this.slider_preamp.value != this.preamp) {
                this.slider_preamp.value = this.preamp;
            }
        });
        this.initShow();
        this.initPresets();
        this.player.$context.on(Player.EVENT_ERROR + " || " + Player.EVENT_LOADED_SONG_PLAYER, () => {
            this.initEq();
            this.disabled(false);
        });
    }
    addEq() {
        let presets = {
            Custom: 'Моя настройка',
            Default: 'По умолчанию',
            Disco: 'Диско',
            Rok: 'Рок',
            Dance: 'Dance',
            Rap: 'Рэп',
            Minimal: 'Минимал',
            Funk: 'Фонк',
            Classical: 'Классика',
            Club: 'Клубная',
            Full_Bass: 'Полный бас',
            Full_Bass_Treble: 'Полный бас и Требл',
            Full_Treble: 'Полный Требл',
            Large_hall: 'Большой зал',
            Live: 'Live',
            Party: 'Вечеринка',
            Pop: 'Поп',
            Reggae: 'Регги',
            Soft: 'Мягкий',
            Soft_Rock: 'Мягкий Рок',
            Techno: 'Техно'
        };
        let show = 5;
        let $dots = $(`
            <div class="inner_dots">
                <button aria-label="Показать все пресеты" class="dots elem" type="button"></button>
                <div class="other_presets"></div>
            </div>
        `);
        Object.entries(presets).forEach(([key, value], index) => {
            if (index <= show) {
                $('.presets').append(this.presetItem(key, value));
            }
            else {
                if (this.$context.find('.inner_dots').length == 0) {
                    this.$context.find('.presets').append($dots);
                }
                $('.other_presets').append(this.presetItem(key, value));
            }
        });
        let frequencies = ['60', '170', '310', '600', '1к', '3к', '6к', '12к', '14к', '16к'];
        let $settings = this.$context.find('.settings');
        $settings.append(`
            <div class="setting" style="width:45px">
                <div class="slider_eq preamp">
                    ${this.createSlider()}
                    </div>
                <span class="name">Уровень</span>
            </div>
        `);
        // Bands
        frequencies.forEach(freq => {
            $settings.append(`
                <div class="setting bands">
                    <div class="slider_eq">
                    ${this.createSlider()}
                    </div>
                    <span class="name">${freq}</span>
                </div>
            `);
        });
    }
    createSlider() {
        return `
                <div class="b_slider mini ver" data-value_min="-5" data-value_max="5" data-value="0">
                    <div class="slider">
                        <div
                            class="value"
                        >
                            <div class="thumb"></div>
                        </div>
                    </div>
                </div>
            `;
    }
    presetItem(id, name) {
        const hide = id === 'Custom' ? 'hide ' : '';
        return `
            <div class="${hide}preset">
                <label>
                    <input type="radio" name="preset" data-preset_name="${id}">
                    <span class="name_preset">${name}</span>
                </label>
            </div>
        `;
    }
    initPresets() {
        this.$context.find('.preset input').on('click', (e, i) => {
            let $current_preset = $(e.currentTarget);
            let preset_name = $current_preset.data('preset_name');
            for (const key in EQ_PRESETS) {
                if (key == preset_name) {
                    this.preset = (EQ_PRESETS[key]);
                }
            }
        });
        this.sliders.forEach((slider, index) => {
            slider.$context.on(SliderEvents.StopMove, () => {
                this.$context.find('.preset input').prop('checked', 0);
                let preset = {
                    name: 'Custom',
                    preamp: 0,
                    bands: []
                };
                preset.preamp = +this.slider_preamp.value.toFixed(2);
                this.sliders_bands.forEach((slider, index) => {
                    preset.bands[index] = +slider.value.toFixed(2);
                });
                this.preset = preset;
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
        $('body').on('click', (e) => {
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
    initEq() {
        if (this.eq_init == false) {
            const music = { Equalizer: EqualizerManager };
            const audioElement = this.player.getAudio();
            const audioContext = new AudioContext();
            const audioSource = audioContext.createMediaElementSource(audioElement);
            let equalizerManager = new music.Equalizer(audioContext, audioSource);
            equalizerManager.enable();
            this.eq = equalizerManager.equalizer;
            this.preset = this.preset;
            this.$context.find(`[data-preset_name='${this.preset.name}']`).prop('checked', 1);
            this.eq_init = true;
        }
    }
    get preset() {
        let preset_store = localStorage.getItem(this.KEY_LOCAL_STORE_PRESET);
        return preset_store ? JSON.parse(preset_store) : EQ_PRESETS.Default;
    }
    set preset(preset) {
        this.preamp = preset.preamp;
        preset.bands.forEach((band, index) => {
            this.setBand(index, band);
        });
        localStorage.setItem(this.KEY_LOCAL_STORE_PRESET, JSON.stringify(preset));
    }
    show() {
        this.$context.addClass('show');
    }
    close() {
        this.$context.removeClass('show');
        this.$context.trigger(PlayerEQ.EVENT_CLOSE);
    }
    get isShow() {
        return this.$context.hasClass('show');
    }
    disabled(disabled = true) {
        disabled ? this.$context.addClass('disabled') : this.$context.removeClass('disabled');
    }
    set preamp(preamp_value) {
        if (preamp_value < this.slider_preamp.value_min || preamp_value > this.slider_preamp.value_max) {
            throw new Error(`Недопустимое значение Preamp = "${preamp_value.toFixed(2)}". 
                Диапазон от "${this.slider_preamp.value_min}" до "${this.slider_preamp.value_max}".`);
        }
        if (this.eq.preamp.getValue().toFixed(2) != preamp_value.toFixed(2)
            || this.eq.preamp.getValue().toFixed(2) != this.sliders[0].value.toFixed(2)) {
            this.eq.preamp.setValue(preamp_value);
            this.$context.trigger(PlayerEQ.EVENT_UPDATE_PREAMP);
        }
    }
    get preamp() {
        return +this.eq.preamp.getValue().toFixed(2);
    }
    setBand(index, value) {
        let $slader_band = this.sliders_bands[index];
        if (value < $slader_band.value_min || value > $slader_band.value_max) {
            throw new Error(`Недопустимое значение Band["${index}"] = "${value}". 
                Диапазон от "${$slader_band.value_min}" до "${$slader_band.value_max}".`);
        }
        if (this.eq.bands[index].getValue().toFixed(2) == value.toFixed(2))
            return;
        this.eq.bands[index].setValue(value);
        this.$context.trigger(PlayerEQ.EVENT_UPDATE_BANDS, index);
    }
    getBand(index) {
        return +this.eq.bands[index].getValue().toFixed(2);
    }
    static create($context = $('.b_player_eq')) {
        return new PlayerEQ($context);
    }
}
PlayerEQ.EVENT_UPDATE_BANDS = 'PlayerEQ.EVENT_UPDATE_BANDS';
PlayerEQ.EVENT_UPDATE_PREAMP = 'PlayerEQ.EVENT_UPDATE_PREAMP';
PlayerEQ.EVENT_CLOSE = 'PlayerEQ.EVENT_CLOSE';
