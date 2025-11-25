interface Preset {
    name: string,
    preamp: number,
    bands: number[]
}
type keys = "Default" | "Disco" | "Rok"| "Dance"| "Rap"| "Minimal"| "Funk"| "Custom"
// fixme укажи тип константы ok
// fixme для эквалайзера используется имя eq ок
const EQ_PRESETS: Record<keys, Preset>  = {
    Default:  {name: "Default", preamp: 0, bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]},
    Disco: {name: "Disco", preamp: -2.5, bands: [-0.5, -0.5, 4, 2.5, 2.5, 2.5, 1.5, -0.5, -0.5, -0.5]},
    Rok: {name: "Rok", preamp: -3.36, bands: [-0.5, -1, 4, 2.5, 2.5, 1, 1.5, -0.5, -0.5, -0.5]},
    Dance: {name: "Dance", preamp: -4, bands: [-0.5, -0.5, -4.5, 2.5, 3.4, 2.5, -3.5, -1.5, -4.5, -0.5]},
    Rap: {name: "Rap", preamp: 1.36, bands: [-2.6, -0.5, 1.5, 3.3, 1.5, -0.5, 2.5, -4.5, -2.8, -0.9]},
    Minimal: {name: "Minimal", preamp: 2.2, bands: [2, 2.5, -0.5, -2.5, -2, -0.5, 4, -4.5, -4.5, 4]},
    Funk: {name: "Funk", preamp: 3.7, bands: [4.1, 2.5, -0.5, -2.5, -2, -0.5, 4, 4.5, 4.5, 4]},
    Custom: {name: "Custom", preamp: 0, bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
};

const DEFAULT: string = 'Default';
const CUSTOM: string = 'Custom';

class PlayerEQ
{
    private $context: JQuery;
    private player: Player;
    // fixme должен быть отдельный слайдер для preamp и отдельный массив для bands ок
    private sliders: Slider[];
    private sliders_bands: Slider[];
    private slider_preamp: Slider;
    private _preset: Preset;
    private eq : Equalizer;

    // fixme не правильное имя, я должен понимать что храниться в переменной когда читаю ее имя ок
    // fixme значение подобных констант лучше копировать как полное имя константы, например сейчас это "PlayerEQ.KEY_LOCAL_STORE_EQ" ok
    private KEY_LOCAL_STORE_PRESET = 'PlayerEQ.KEY_LOCAL_STORE_PRESET';

    constructor($context: JQuery) {

        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].EQ) return this.$context[0].EQ;

        // @ts-ignore
        this.$context[0].EQ = this;

        this.player = Player.create();
        this.sliders = Slider.create(this.$context);

        this.sliders_bands = Slider.create(this.$context.find('.bands'));
        this.slider_preamp = Slider.create(this.$context.find('.preamp'))[0];

        this.disabled();

        // fixme нельзя работать с dom компонентов напрямую, ты должна работать с методами и свойствами компонента ok

        this.sliders.forEach((slider, index) =>
        {
            slider.$context.removeClass('disabled')
        })

        this.initEq();

        this.initShow();

        this.initPresets();

        this.player.$context.on(Player.EVENT_ERROR + " || " + Player.EVENT_LOADED_META_DATA,() =>
        {
            this.disabled(false);
        })
    }

    private initPresets()
    {
        this.$context.find('.preset input').on('click', (e, i) =>
        {
            // fixme для jQuery переменных мы используем приставку $ смотри $context ok
            let $current_preset = $(e.currentTarget)

            let preset_name = $current_preset.data('preset_name');

            for (const key in EQ_PRESETS) {

                if (key== preset_name) {
                    this.eq.loadPreset(EQ_PRESETS[key]);

                    this.presetStore = (EQ_PRESETS[key]);
                }
            }

            this.updateSlider();
        });

        this.sliders.forEach((slider, index) =>
        {
            slider.$context.on(SliderEvents.StopMove, ( ) =>
            {
                this.$context.find('.preset input').prop('checked', 0);

                EQ_PRESETS.Custom.preamp = +this.slider_preamp.value.toFixed(2);

                this.sliders_bands.forEach((slider, index) =>
                {
                    EQ_PRESETS.Custom.bands[index] = +slider.value.toFixed(2);
                })

                this.presetStore = EQ_PRESETS.Custom;
            });
        })

        this.sliders.forEach((slider, index) =>
        {
            slider.$context.on(SliderEvents.ValueUpdate, ( ) =>
            {
                let hertz = slider.value;

                if (hertz < slider.value_min || hertz > slider.value_max) {
                    // fixme invalid volume или не volume? ok
                    throw new Error(`Invalid eq "${hertz}"`);
                }

                if (index !== 0) {
                    this.eq.bands[index - 1].setValue(hertz);
                } else {
                    this.eq.preamp.setValue(hertz);
                }
            });
        })
    }

    private updateSlider()
    {
        this.sliders.forEach((slider, index) =>
        {
            if (index == 0) {
                slider.value = this.eq.preamp.getValue();

            } else {
                slider.value = this.eq.bands[index-1].getValue();
            }
        })
    }

    // fixme не придумал хорошего имени для константы, и потянулось дальше эта ошибка, теперь и свойство не правильно названо ok
    private get presetStore(): Preset
    {
        // fixme хрупкий код, если стор будет пустой пресет не будет возвращен, лучше проверят и заполнять дефолтным присетом, если пусто ok

        if (localStorage.getItem(this.KEY_LOCAL_STORE_PRESET)) {
            return JSON.parse(localStorage.getItem(this.KEY_LOCAL_STORE_PRESET));
        } else {
            return EQ_PRESETS.Default;
        }
    }

    private set presetStore(preset: Preset)
    {
        localStorage.setItem(this.KEY_LOCAL_STORE_PRESET, JSON.stringify(preset));
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

    private show()
    {
        this.$context.addClass('show');
    }

    private close()
    {
        this.$context.removeClass('show');
    }

    private get isShow()
    {
        return this.$context.hasClass('show');
    }

    private disabled(disabled: boolean = true)
    {
        disabled ? this.$context.addClass('disabled') : this.$context.removeClass('disabled');
    }

    private initEq()
    {
        const music = { Equalizer: EqualizerManager };
        const audioElement = this.player.getAudio();
        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaElementSource(audioElement);
        let equalizerManager = new music.Equalizer(audioSource, audioSource);

        equalizerManager.enable();
        this.eq = equalizerManager.equalizer;

        let preset = this.presetStore;
        if (preset) {
            this.eq.loadPreset(preset);

            this.updateSlider();

            this.updateChecked(preset.name);
        } else {
            // fixme магическая строка, требуется вынести в константу ok
            this.updateChecked(DEFAULT);
        }
    }

    // fixme не хватает публичных свойств preset, preamp и bands, ну и их повсеместного использования

    public set preset(preset)
    {
        this._preset = preset;
    }

    public get preset()
    {
        return  this._preset ? this._preset : this.presetStore;
    }
    public set preamp(preamp)
    {
        this._preset.preamp = preamp;
    }

    public get preamp()
    {
        return this.preset.preamp;
    }
    public set bands(bands)
    {
        this._preset.bands = bands;
    }

    public get bands()
    {
        return this.preset.bands;
    }

    private updateChecked(name: string)
    {
        this.$context.find(`[data-preset_name='${name}']`).prop('checked', 1);
    }

    public static create($context = $('.b_player_eq')): PlayerEQ
    {
        return new PlayerEQ($context);
    }
}