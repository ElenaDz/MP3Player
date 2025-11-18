interface Preset {
    name: string,
    preamp: number,
    bands: number[]
}

const EQUALIZER_PRESETS = [
    { name: "Default", preamp: 0, bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    { name: "Disco", preamp: -2.5, bands: [-0.5, -0.5, 4, 2.5, 2.5, 2.5, 1.5, -0.5, -0.5, -0.5] },
    { name: "Rok", preamp: -3.36, bands: [-0.5, -1, 4, 2.5, 2.5, 1, 1.5, -0.5, -0.5, -0.5] },
    { name: "Dance", preamp: -4, bands: [-0.5, -0.5, -4.5, 2.5, 3.4, 2.5, -3.5, -1.5, -4.5, -0.5] },
    { name: "Rap", preamp: 1.36, bands: [-2.6, -0.5, 1.5,  3.3, 1.5, -0.5, 2.5, -4.5, -2.8, -0.9] },
    { name: "Minimal", preamp: 2.2, bands: [2, 2.5, -0.5, -2.5, -2, -0.5, 4, -4.5, -4.5, 4] },
    { name: "Funk", preamp: 3.7, bands: [4.1, 2.5, -0.5, -2.5, -2, -0.5, 4, 4.5, 4.5, 4] },
    { name: "My_options", preamp: 0, bands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
];

class PlayerEQ
{
    private $context: JQuery;
    private player: Player;
    private sliders: Slider[];
    private eq : Equalizer;

    private KEY_LOCAL_STORE_EQ = 'eq';

    constructor($context: JQuery) {

        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].EQ) return this.$context[0].EQ;

        // @ts-ignore
        this.$context[0].EQ = this;

        this.player = Player.create();
        this.sliders = Slider.create(this.$context);

        this.disabled();

        this.$context.find('.b_slider').removeClass('disabled');

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
            let current_preset = $(e.currentTarget)

            EQUALIZER_PRESETS.forEach((preset) =>
            {
                if (preset.name == current_preset.data('preset_name')) {

                    this.eq.loadPreset(preset);

                    this.eqStore = preset;
                }
            })

            this.updateSlider();
        });

        this.sliders.forEach((slider, index) =>
        {
            slider.$context.on(SliderEvents.StopMove, ( ) =>
            {
                this.$context.find('.preset input').prop('checked', 0);

                this.sliders.forEach((slider, index) =>
                {
                    EQUALIZER_PRESETS.forEach((preset) =>
                    {
                        if (preset.name == 'My_options') {

                            if (index == 0) {
                                preset.preamp = +slider.value.toFixed(2)
                            } else  {
                                preset.bands[index-1] = +slider.value.toFixed(2);
                            }

                            this.eqStore = preset;
                        }
                    })
                })
            });
        })

        this.sliders.forEach((slider, index) =>
        {
            slider.$context.on(SliderEvents.ValueUpdate, ( ) =>
            {
                let hertz = slider.value;

                if (hertz < slider.value_min || hertz > slider.value_max) {
                    throw new Error(`Invalid volume "${hertz}"`);
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

    private get eqStore(): Preset
    {
        return JSON.parse(localStorage.getItem(this.KEY_LOCAL_STORE_EQ));
    }

    private set eqStore(preset: Preset)
    {
        localStorage.setItem(this.KEY_LOCAL_STORE_EQ, JSON.stringify(preset));
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

        let preset = this.eqStore;
        if (preset) {
            this.eq.loadPreset(preset);

            this.updateSlider();

            this.updateChecked(preset.name);
        } else {
            this.updateChecked('Default');
        }
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