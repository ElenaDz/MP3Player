interface Preset {
    name: string,
    preamp: number,
    bands: number[]
}

const EQ_PRESETS: Record<"Default" | "Disco" | "Rok"| "Dance"| "Rap"| "Minimal"| "Funk"| "Custom", Preset>  = {
    Default:  {name: "Default", preamp: 0, bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    Disco: {name: "Disco", preamp: -2.5, bands: [-0.5, -0.5, 4, 2.5, 2.5, 2.5, 1.5, -0.5, -0.5, -0.5]},
    Rok: {name: "Rok", preamp: -3.36, bands: [-0.5, -1, 4, 2.5, 2.5, 1, 1.5, -0.5, -0.5, -0.5]},
    Dance: {name: "Dance", preamp: -4, bands: [-0.5, -0.5, -4.5, 2.5, 3.4, 2.5, -3.5, -1.5, -4.5, -0.5]},
    Rap: {name: "Rap", preamp: 1.36, bands: [-2.6, -0.5, 1.5, 3.3, 1.5, -0.5, 2.5, -4.5, -2.8, -0.9]},
    Minimal: {name: "Minimal", preamp: 2.2, bands: [2, 2.5, -0.5, -2.5, -2, -0.5, 4, -4.5, -4.5, 4]},
    Funk: {name: "Funk", preamp: 3.7, bands: [4.1, 2.5, -0.5, -2.5, -2, -0.5, 4, 4.5, 4.5, 4]},
    Custom: null
};

class PlayerEQ
{
    static readonly EVENT_UPDATE_BANDS = 'PlayerEQ.EVENT_UPDATE_BANDS';
    static readonly EVENT_UPDATE_PREAMP = 'PlayerEQ.EVENT_UPDATE_PREAMP';
    static readonly EVENT_CLOSE = 'PlayerEQ.EVENT_CLOSE';

    public $context: JQuery;
    private player: Player;
    private sliders: Slider[];
    private slider_preamp: Slider;
    private sliders_bands: Slider[];
    private eq : Equalizer;
    private eq_init: boolean = false;

    private KEY_LOCAL_STORE_PRESET = 'PlayerEQ.KEY_LOCAL_STORE_PRESET';

    constructor($context: JQuery) {

        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].EQ) return this.$context[0].EQ;

        // @ts-ignore
        this.$context[0].EQ = this;

        this.player = Player.create();

        this.addEq();

        this.sliders = Slider.create(this.$context);
        this.sliders_bands = Slider.create(this.$context.find('.bands'));
        this.slider_preamp = Slider.create(this.$context.find('.preamp'))[0];
        console.log(this.slider_preamp.value)


        this.disabled();

        this.sliders.forEach((slider, index) =>
        {
            slider.disabled = false;
        })

        this.$context.on(PlayerEQ.EVENT_UPDATE_BANDS,  (e, index) =>
        {
            let slider_value = +this.sliders_bands[index].value.toFixed(2);

            if (slider_value != this.getBand(index)) {
                this.sliders_bands[index].value = this.getBand(index);
            }
        });

        this.$context.on(PlayerEQ.EVENT_UPDATE_PREAMP, () =>
        {
            if ( this.slider_preamp.value != this.preamp) {
                this.slider_preamp.value = this.preamp;
            }
        });

        this.initShow();

        this.initPresets();

        this.player.$context.on(Player.EVENT_ERROR + " || " + Player.EVENT_LOADED_META_DATA,() =>
        {
            this.initEq();

            this.disabled(false);
        })
    }

    private addEq()
    {
        let presets: Record<string, string> = {
            Custom: 'Моя настройка',
            Default: 'По умолчанию',
            Disco: 'Диско',
            Rok: 'Рок',
            Dance: 'Dance',
            Rap: 'Рэп',
            Minimal: 'Минимал',
            Funk: 'Фонк'
        };

        let show = 5;

        let $dots = $(`
            <div class="inner_dots">
                <button class="dots elem" type="button"></button>
                <div class="other_presets"></div>
            </div>
        `);

        Object.entries(presets).forEach(([key, value], index) => {
            if (index <= show) {
                $('.presets').append(this.presetItem(key, value));
            } else {
                if (this.$context.find('.inner_dots').length == 0){
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

    private  createSlider() {
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

    private presetItem(id, name) {
        const hide = id === 'Custom' ? 'hide' : '';
        return `
            <div class="preset ${hide}">
                <label>
                    <input type="radio" name="preset" data-preset_name="${id}">
                    <span>${name}</span>
                </label>
            </div>
        `;
    }

    private initPresets()
    {
        this.$context.find('.preset input').on('click', (e, i) =>
        {
            let $current_preset = $(e.currentTarget)

            let preset_name = $current_preset.data('preset_name');

            for (const key in EQ_PRESETS) {

                if (key == preset_name) {
                    this.preset = (EQ_PRESETS[key]);
                }
            }
        });

        this.sliders.forEach((slider, index) =>
        {
            slider.$context.on(SliderEvents.StopMove, ( ) =>
            {
                this.$context.find('.preset input').prop('checked', 0);

                let preset:Preset = {
                    name: 'Custom',
                    preamp: 0,
                    bands: []
                };

                preset.preamp = +this.slider_preamp.value.toFixed(2);

                this.sliders_bands.forEach((slider, index) =>
                {
                    preset.bands[index] = +slider.value.toFixed(2);
                })

                this.preset = preset;
            });
        });

        this.slider_preamp.$context.on(SliderEvents.ValueUpdate, ( ) =>
        {
            console.log(this.slider_preamp.value)
            this.preamp = this.slider_preamp.value;
        });

        this.sliders_bands.forEach((slider, index) =>
        {
            slider.$context.on(SliderEvents.ValueUpdate, ( ) =>
            {
                this.setBand(index, slider.value);
            });
        })
    }

    private initShow()
    {
        this.$context.find('button.eq').on('click',() =>
        {
            this.isShow ? this.close() : this.show();
        });

        this.$context.find('.close').on('click',() =>
        {
            this.close();
        });

        $('html').on('click',(e) =>
        {
            if (!$(e.target).hasClass('b_popup')
                && !$(e.target).hasClass('eq')
                && !$(e.target).parents().hasClass('b_popup'))
            {
                this.close();
                this.$context.find('.inner_dots').removeClass('open');
            }
        });

        this.initDots();
    }

    private initDots()
    {
        this.$context.find('form').on('submit', (event) => {
            event.preventDefault();
        });

        this.$context.find('button.dots').on('click',() =>
        {
            this.$context.find('.inner_dots').toggleClass('open');
        });
    }

    private initEq()
    {
        if (this.eq_init == false) {
            const music = { Equalizer: EqualizerManager };
            const audioElement = this.player.getAudio();
            const audioContext = new AudioContext();
            const audioSource = audioContext.createMediaElementSource(audioElement);
            let equalizerManager = new music.Equalizer(audioContext, audioSource);

            equalizerManager.enable();

            this.eq = equalizerManager.equalizer;

            this.preset = this.preset;
            // console.log(this.eq.bands[3].value)
            // console.log(this.eq.preamp.getValue())
            this.$context.find(`[data-preset_name='${this.preset.name}']`).prop('checked', 1);

            this.eq_init = true;
        }
    }

    private get preset(): Preset
    {
        let preset_store = localStorage.getItem(this.KEY_LOCAL_STORE_PRESET);

         return preset_store ? JSON.parse(preset_store) : EQ_PRESETS.Default;
    }

    private set preset(preset: Preset)
    {

        console.log(preset.preamp)
        this.preamp = preset.preamp;

        preset.bands.forEach((band, index) =>
        {
            this.setBand(index, band);
        });

        localStorage.setItem(this.KEY_LOCAL_STORE_PRESET, JSON.stringify(preset));
    }

    public show()
    {
        this.$context.addClass('show');
    }

    public close()
    {
        this.$context.removeClass('show');

        this.$context.trigger(PlayerEQ.EVENT_CLOSE);
    }

    public get isShow()
    {
        return this.$context.hasClass('show');
    }

    private disabled(disabled: boolean = true)
    {
        disabled ? this.$context.addClass('disabled') : this.$context.removeClass('disabled');
    }

    public set preamp(preamp_value: number)
    {
        if (preamp_value < this.slider_preamp.value_min || preamp_value > this.slider_preamp.value_max) {
            throw new Error(
                `Недопустимое значение Preamp = "${preamp_value.toFixed(2)}". 
                Диапазон от "${this.slider_preamp.value_min}" до "${this.slider_preamp.value_max}".`
            );
        }

        if (this.eq.preamp.getValue().toFixed(2) == preamp_value.toFixed(2)
            && this.eq.preamp.getValue().toFixed(2) == this.sliders[0].value.toFixed(2)) return;

        console.log(preamp_value)
        // if (this.eq.preamp.getValue().toFixed(2) != preamp_value.toFixed(2)
        //     || this.eq.preamp.getValue().toFixed(2) != this.sliders[0].value.toFixed(2)) {
        //     this.eq.preamp.setValue(preamp_value);
        //
        //     this.$context.trigger(PlayerEQ.EVENT_UPDATE_PREAMP);
        // }
        this.eq.preamp.setValue(preamp_value);

        console.log(this.eq.preamp.getValue())
        this.$context.trigger(PlayerEQ.EVENT_UPDATE_PREAMP);
    }

    public get preamp(): number
    {
        return +this.eq.preamp.getValue().toFixed(2);
    }

    public setBand(index: number, value: number)
    {
        let $slader_band = this.sliders_bands[index];
        if (value < $slader_band.value_min || value > $slader_band.value_max)
        {
            throw new Error(
                `Недопустимое значение Band["${index}"] = "${value}". 
                Диапазон от "${$slader_band.value_min}" до "${$slader_band.value_max}".`
            );
        }

        if (this.eq.bands[index].getValue().toFixed(2) == value.toFixed(2)
            && this.eq.bands[index].getValue().toFixed(2) == this.sliders[index].value) return;

        this.eq.bands[index].setValue(value);
        this.$context.trigger(PlayerEQ.EVENT_UPDATE_BANDS, index);
    }

    public getBand(index: number): number
    {
        return +this.eq.bands[index].getValue().toFixed(2);
    }

    public static create($context = $('.b_player_eq')): PlayerEQ
    {
        return new PlayerEQ($context);
    }
}