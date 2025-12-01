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

// fixme занести внутрь класса PlayerEQ, как readonly если слово const там не допустимо ok
// fixme кажется больше не нужна, можно удалить, из за того что ключи теперь не строки, а свойства, а их ide понимает ok

class PlayerEQ
{
    static readonly EVENT_UPDATE_BANDS_PREAMP = 'PlayerEQ.EVENT_UPDATE_BANDS_PREAMP';

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
            //  у слайдера есть свойство disabled ok
            slider.disabled = false;
        })

        this.$context.on(PlayerEQ.EVENT_UPDATE_BANDS_PREAMP, () => {
            this.sliders.forEach((slider, index) =>
            {
                let slader_value = +slider.value.toFixed(2);

                if (index == 0) {
                    if ( slader_value != this.preamp) {
                        slider.value = this.preamp;
                    }

                } else {
                    if (slader_value != this.getBand(index-1)) {
                        slider.value = this.getBand(index-1);
                    }
                }
            })
        });

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

                    this.preset = (EQ_PRESETS[key]);
                }
            }

            this.$context.trigger(PlayerEQ.EVENT_UPDATE_BANDS_PREAMP);
        });

        this.sliders.forEach((slider, index) =>
        {
            slider.$context.on(SliderEvents.StopMove, ( ) =>
            {
                this.$context.find('.preset input').prop('checked', 0);

                // fixme здесь ты должна менять то что у тебя храниться в presetStore, а не коснтанту EQ_PRESETS.Custom ( не знаю как обойтись без Кастомного пресета)

                EQ_PRESETS.Custom.preamp = +this.slider_preamp.value.toFixed(2);

                this.sliders_bands.forEach((slider, index) =>
                {
                    EQ_PRESETS.Custom.bands[index] = +slider.value.toFixed(2);
                })

                // fixme здесь запись в стор
                this.preset = EQ_PRESETS.Custom;

                this.$context.trigger(PlayerEQ.EVENT_UPDATE_BANDS_PREAMP);
            });
        })

        this.sliders.forEach((slider, index) =>
        {
            slider.$context.on(SliderEvents.ValueUpdate, ( ) =>
            {
                // fixme в слайдере на сколько я помню значение с -5 до 5, это не частота ok
                let value = slider.value;

                if (value < slider.value_min || value > slider.value_max) {
                    // fixme в консоле ты увидишь ошибку "Invalid eq 6" через год, тебе будет понятно что это значит? ok
                    //  Напиши понятное сообщение об ошибке ok
                    throw new Error(`Недопустимое значение EQ "${value}". Диапозон от -5 до 5.`);
                }

                if (index !== 0) {
                    this.setBand(index-1, value)

                } else {
                    this.preamp = value;
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

        // fixme ни когда не бывает пустой ok
        this.eq.loadPreset(this.preset);

        this.$context.trigger(PlayerEQ.EVENT_UPDATE_BANDS_PREAMP);

       this.updateChecked(this.preset.name);
    }

    private get preset(): Preset
    {
        let preset_store = localStorage.getItem(this.KEY_LOCAL_STORE_PRESET);
        // fixme обращение к локальному стору нужно вынести в переменую ok
        if (preset_store) {
            return JSON.parse(preset_store);
        } else {
            return EQ_PRESETS.Default;
        }
    }

    private set preset(preset: Preset)
    {
        localStorage.setItem(this.KEY_LOCAL_STORE_PRESET, JSON.stringify(preset));
    }

        // fixme сохраняешь пресет но при этом не загружаешь данные из него в эквалайзер, а нужно, и делать это надо
        //  с помощью с prep и setBand
        // fixme может быть ты можешь хранить пресет только в одном места а именно в локалном сторе  ok

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

    public set preamp(preamp: number)
    {
        this.eq.preamp.setValue(preamp);
    }

    public get preamp(): number
    {
        return +this.eq.preamp.getValue().toFixed(2);
    }

    public setBand(index: number, value: number)
    {
        // просто пример кода, допиши/исправь как нужно
        this.eq.bands[index].setValue(value);

        this.$context.trigger(PlayerEQ.EVENT_UPDATE_BANDS_PREAMP);
    }

    public getBand(index: number): number
    {
        // просто пример кода, допиши/исправь как нужно
        return +this.eq.bands[index].getValue().toFixed(2);
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