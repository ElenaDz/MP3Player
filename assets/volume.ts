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
            this.slider.value = this.player.volume;
        })

        this.slider.context.on(SliderEvents.StopMove, () =>
        {
            this.player.volume = this.slider.value;
            this.removeMute();
            if (this.player.volume == 0) {
                this.addMute();
            }
        })

        this.$context.find('button.volume_inner').on('click', () =>
        {
            this.player.mute ? this.removeMute() : this.addMute();
        })
    }

    private addMute() {
        this.player.mute = true;
        this.$context.addClass('mute');
        this.slider.value = 0;
    }

    private removeMute() {
        this.player.mute = false;
        this.$context.removeClass('mute');
        this.slider.value = this.player.volume;
    }

    public static create($context = $('.b_player_volume')): Volume
    {
        return new Volume($context);
    }
}