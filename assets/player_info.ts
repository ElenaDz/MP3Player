class Player_info
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

        this.disabled();

        this.player.$context.on(Player.EVENT_ERROR,() =>
        {
            this.load();
        })

        this.player.$context.on(Player.EVENT_LOADED_META_DATA,() =>
        {
            this.load();
        })
    }

    private load()
    {
        this.setSongPlayer(this.player.getSongPlayer());

        this.$context.removeClass('disabled');
    }

    private disabled()
    {
        this.$context.addClass('disabled');
    }

    private setSongPlayer(song: SongPlayer)
    {
        this.$context.find('.wrap_author').text(song.artistHtml);

        this.$context.find('.inner_song').text(song.songName);

        this.$context.find('.inner_song').attr('href', song.urlSong);

        this.$context.find('.download_song').attr('href', song.urlSong);

        if (navigator.mediaSession)
        {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.songName,
                artist: song.artistHtml,
            });
        }
    }

    public static create($context = $('.b_player_info')): Player_info
    {
        return new Player_info($context);
    }
}