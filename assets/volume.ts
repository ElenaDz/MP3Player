class Volume
{
    private $context: JQuery;
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
        })
    }


    public static create($context = $('.b_player_volume')): Volume
    {
        return new Volume($context);
    }
}