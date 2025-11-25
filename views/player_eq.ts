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
    // fixme кажется это лишнее и это нужно удалить, если вдруг нужны значение по умолчанию их можно взять в Default
    Custom: {name: "Custom", preamp: 0, bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
};

// fixme занести внутрь класса PlayerEQ, как readonly если слово const там не допустимо
// fixme кажется больше не нужна, можно удалить, из за того что ключи теперь не строки, а свойства, а их ide понимает
const DEFAULT: string = 'Default';

class PlayerEQ
{
    private $context: JQuery;
    private player: Player;
    private sliders: Slider[];
    private slider_preamp: Slider;
    private sliders_bands: Slider[];
    private _preset: Preset;
    private eq : Equalizer;

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

        this.sliders.forEach((slider, index) =>
        {
            // fixme нельзя работать с dom компонентов напрямую, ты должна работать с методами и свойствами компонента,
            //  у слайдера есть свойство disabled
            slider.$context.removeClass('disabled');
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
            let $current_preset = $(e.currentTarget)

            let preset_name = $current_preset.data('preset_name');

            for (const key in EQ_PRESETS) {

                if (key == preset_name) {
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

                // fixme здесь ты должна менять то что у тебя храниться в presetStore, а не коснтанту EQ_PRESETS.Custom

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
                // fixme в слайдере на сколько я помню значение с -5 до 5, это не частота
                let hertz = slider.value;

                if (hertz < slider.value_min || hertz > slider.value_max) {
                    // fixme в консоле ты увидишь ошибку "Invalid eq 6" через год, тебе будет понятно что это значит?
                    //  Напиши понятное сообщение об ошибке
                    throw new Error(`Invalid eq "${hertz}"`);
                }

                if (index !== 0) {
                    this.eq.bands[index - 1].setValue(hertz);
                } else {
                    this.preamp = hertz;
                }
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
        const music = { Equalizer: EqualizerManager };
        const audioElement = this.player.getAudio();
        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaElementSource(audioElement);
        let equalizerManager = new music.Equalizer(audioSource, audioSource);

        equalizerManager.enable();
        this.eq = equalizerManager.equalizer;

        let preset = this.presetStore;
        // fixme ни когда не бывает пустой
        if (preset) {
            this.eq.loadPreset(preset);

            this.updateSlider();

            this.updateChecked(preset.name);
        } else {
            this.updateChecked(DEFAULT);
        }
    }


    // fixme ну нужно выносить в метод, а нужно поместить этот код как реакцию на событие в конструктор
    private updateSlider()
    {
        this.sliders.forEach((slider, index) =>
        {
            if (index == 0) {
                slider.value = this.preamp;

            } else {
                slider.value = this.eq.bands[index-1].getValue();
            }
        })
    }


    private get presetStore(): Preset
    {
        // fixme обращение к локальному стору нужно вынести в переменую
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

    public set preset(preset)
    {
        // fixme сохраняешь пресет но при этом не загружаешь данные из него в эквалайзер, а нужно, и делать это надо
        //  с помощью с prep и setBands
        // fixme может быть ты можешь хранить пресет только в одном места а именно в локалном сторе
        this._preset = preset;
    }

    public get preset(): Preset
    {
        return this._preset ? this._preset : this.presetStore || EQ_PRESETS.Default;
    }


    public set preamp(preamp: number)
    {
        this.eq.preamp.setValue(preamp);
    }

    public get preamp(): number
    {
        return this.eq.preamp.getValue();
    }


    public setBands(index: number, value: number)
    {
        // просто пример кода, допиши/исправь как нужно
        this.eq.bands[index - 1].setValue(value);
    }

    public getBands(index: number)
    {
        // просто пример кода, допиши/исправь как нужно
        return this.eq.bands[index - 1];
    }


    // fixme не нужно выность это в метод
    private updateChecked(name: string)
    {
        this.$context.find(`[data-preset_name='${name}']`).prop('checked', 1);
    }

    public static create($context = $('.b_player_eq')): PlayerEQ
    {
        return new PlayerEQ($context);
    }
}