class Volume {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Volume)
            return this.$context[0].Volume;
        // @ts-ignore
        this.$context[0].Volume = this;
        this.player = Player.create();
        this.slider = Slider.create(this.$context)[0];
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.slider.value = this.player.volume;
        });
        this.slider.context.on(SliderEvents.StopMove, () => {
            this.player.volume = this.slider.value;
        });
    }
    static create($context = $('.b_player_volume')) {
        return new Volume($context);
    }
}
