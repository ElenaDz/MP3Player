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
            // todo не нужно здесь получать каждое свойство по отдельности, получили из плеера объект SongPlayer и работай здесь с ним ok

            this.setSongTitle(this.player.getSongPlayer());
        })
    }

    private setSongTitle(song: SongPlayer)
    {
        // todo set artist name ok
        this.$context.find('.popular-play-composition').text(song.artist_html);

        // todo set song name ok
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