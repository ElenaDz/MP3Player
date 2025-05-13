class Volume
{
    private readonly $context: JQuery;
    private player: Player;
    private slider: Slider;


    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Volume) return this.$context[0].Volume;

        // @ts-ignore
        this.$context[0].Volume = this;

        this.player = Player.create();

        this.slider = Slider.create(this.$context)[0];

        this.player.$context.on(Player.EVENT_LOADED_META_DATA,() =>
        {
            this.$context.find('.b_slider').removeClass('disabled');

            this.volume = this.player.volume;
        });

        // fixme нужно чтобы уровень громкости менялся сразу при передвижении slider без необходимости отпускать кнопку мыши,
        //  так как это происходить в самом audio ok
        this.slider.context.on(SliderEvents.ValueUpdate, () =>
        {
            // todo заведи свойство volume в этом классе и помети ниже стоящий код туда ok
            if (this.muted && this.volume === 0) {
                this.mute = true;
                return;
            }

            this.player.volume = this.volume;
        })

        this.player.$context.on(Player.EVENT_UPDATE_VOLUME,() =>
        {
            if (this.muted && this.volume === 0) {
            this.mute = true;
            return;
            }

            this.volume = this.player.volume;
        });

        this.$context.find('button.volume_mute').on('click', () =>
        {
            this.mute = !this.mute;

        });

        // todo необходимо сохранять уровень громкости localStore для того чтобы он восстанавливался при повторном отрытии страницы

        // fixme когда меняешь громкость в audio в player она не меняется, тоже с muted ok
    }

    // fixme заменить эти два метода на свойство mute ok

    private get mute() {
        return this.player.mute;
    }

    private set mute(mute) {
        this.player.mute = mute;

        if (mute) {
            this.volume = 0
            this.$context.addClass('mute');
        } else {
            this.volume = this.player.volume;
            this.$context.removeClass('mute');
        }
    }

    private muted() {
        this.mute = this.player.volume == 0;
    }

    private get volume() {
        return this.slider.value;
    }

    private set volume(volume) {
        if (volume < 0 || volume > 1) {
            throw new Error(`Invalid volume "${volume}"`);
        }

        this.slider.value = volume;

    }

    public static create($context = $('.b_player_volume')): Volume
    {
        return new Volume($context);
    }
}