class Controls {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Controls)
            return this.$context[0].Controls;
        // @ts-ignore
        this.$context[0].Controls = this;
        this.player = Player.create();
        this.$context.find('button.play').on('click', () => {
            // fixme ты должна выдать ошибку если не задан url ok
            // throw new Error('Не задан url');
            if (this.player.url) {
                this.player.playing ? this.player.pause() : this.player.play();
            }
            else {
                throw new Error('Не задан url');
            }
        });
    }
    static create($context = $('.b_player_controls')) {
        return new Controls($context);
    }
}
