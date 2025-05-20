class Playlist {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Playlist)
            return this.$context[0].Playlist;
        // @ts-ignore
        this.$context[0].Playlist = this;
        this.player = Player.create();
        this.$context.on('click', () => {
        });
    }
    static create($context = $('.b_player_playlist')) {
        return new Playlist($context);
    }
}
