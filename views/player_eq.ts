class PlayerEQ
{
    private $context: JQuery;
    private player: Player;
    private sliders: Slider[];
    private eq : Equalizer;
    constructor($context: JQuery) {

        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].EQ) return this.$context[0].EQ;

        // @ts-ignore
        this.$context[0].EQ = this;

        this.player = Player.create();
        this.sliders = Slider.create(this.$context);

        this.enable();

        this.initEq();

        this.$context.find('.preset input').on('click', (e, i) =>
        {
            let preset = $(e.currentTarget)
            console.log(preset.data('preamp'))
            console.log(preset.data('bands'))
        });

        this.sliders.forEach((slider, index) => {
            slider.$context.on(SliderEvents.ValueUpdate, ( ) =>
            {
                let hertz = slider.value;

                if (hertz < slider.value_max || hertz > slider.value_min) {
                    throw new Error(`Invalid volume "${hertz}"`);
                }

                slider.value = hertz;
                if (index !== 0) {
                    this.eq.bands[index - 1].setValue(hertz)
                } else {
                    this.eq.preamp.setValue(hertz)
                }
            });
        })

    }

    private initEq()
    {
        const music = { Equalizer: EqualizerManager };
        const audioElement = this.player.getAudio(); // HTML <audio>
        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaElementSource(audioElement);
        let equalizerManager = new music.Equalizer(audioSource, audioSource)
        equalizerManager.enable()
        this.eq = equalizerManager.equalizer;
    }

    private enable()
    {
        this.$context.find('.b_slider').removeClass('disabled');
    }

    public static create($context = $('.b_player_eq')): PlayerEQ
    {
        return new PlayerEQ($context);
    }
}