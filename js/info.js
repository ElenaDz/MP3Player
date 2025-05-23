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
            this.setSongPlayer(this.player.getSong());
        });
    }
    setSongPlayer(song) {
        this.$context.find('.wrap_author').text(song.artistHtml);
        this.$context.find('.inner_song').text(song.songName);
        this.$context.find('.inner_song').attr('href', song.urlSong);
        this.$context.find('.download_song').attr('href', song.urlSong);
        if (navigator.mediaSession) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.songName,
                artist: song.artistHtml,
            });
        }
    }
    static create($context = $('.b_player_info')) {
        return new Info($context);
    }
}
