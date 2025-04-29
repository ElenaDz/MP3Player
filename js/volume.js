class Volume {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Progress)
            return;
        // @ts-ignore
        this.$context[0].Progress = this;
        this.player = Player.create();
    }
    static create($context = $('.b_player_volume')) {
        return new Volume($context);
    }
}
