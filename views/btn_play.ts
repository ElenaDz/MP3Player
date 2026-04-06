class BtnPlay
{
    public $context: JQuery;
    private player: Player;
    private playlist: Playlist;

    constructor($context: JQuery)
    {
        this.$context = $context;

        let song_id = $('body').find('.inline_player_playlist_main .popular-play__item').first().data('song-id')

        this.$context.data('song-id', song_id);

        // @ts-ignore
        if (this.$context[0].BtnPlay) return this.$context[0].BtnPlay;

        // @ts-ignore
        this.$context[0].BtnPlay = this;

        this.player = Player.create();

        this.initClick();
        this.updatePause();
    }

    private initClick()
    {
        this.$context.on('click',()=>
        {
            this.$context.find('.icon-music-player-play').toggleClass('pause');
        })
    }

    private updatePause()
    {
        this.player.$context.on(Player.EVENT_UPDATE_PLAYING,() =>
        {
            if (this.$context.data('song-id') == this.player.songId)
            {
                this.player.playing
                    ? this.$context.find('.icon-music-player-play').addClass('pause')
                    : this.$context.find('.icon-music-player-play').removeClass('pause');
            } else {
                this.$context.find('.icon-music-player-play').removeClass('pause');
            }
        })
    }

    public static create($context: JQuery)
    {
        $context.find('.song-author-btn.btn-play').each((index, element) => {

            return new BtnPlay($(element));
        })
    }
}