class Info {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Info)
            return this.$context[0].Info;
        // @ts-ignore
        this.$context[0].Info = this;
        this.player = Player.create();
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.setSongPlayer(this.player.getSongPlayer());
        });
    }
    setSongPlayer(song) {
        this.$context.find('.wrap_author').text(song.artist_html);
        this.$context.find('.inner_song').text(song.song_name);
        this.$context.find('.inner_song').attr('href', song.url_song);
        this.$context.find('.download_song').attr('href', song.url_song);
        if (navigator.mediaSession) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.song_name,
                artist: song.artist_html,
            });
        }
    }
    static create($context = $('.b_player_info')) {
        return new Info($context);
    }
}
