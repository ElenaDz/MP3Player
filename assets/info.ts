class Info
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery) {

        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Info) return this.$context[0].Info;

        // @ts-ignore
        this.$context[0].Info = this;

        this.player = Player.create();

        this.player.$context.on(Player.EVENT_LOADED_META_DATA,() =>
        {
            this.setSongPlayer(this.player.getSongPlayer());
        })
    }

    private setSongPlayer(song: SongPlayer)
    {
        this.$context.find('.popular-play-composition').text(song.artist_html);

        this.$context.find('.popular-play-author').text(song.song_name);

        this.$context.find('.popular-play-author').attr('href', song.url_song);

        if (navigator.mediaSession)
        {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.song_name,
                artist: song.artist_html,
            });
        }
    }

    public static create($context = $('.b_player_info')): Info
    {
        return new Info($context);
    }
}