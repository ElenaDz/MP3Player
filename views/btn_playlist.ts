class BtnPlaylist
{
    public $context: JQuery;
    private player: Player;
    private playlist: Playlist;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].BtnPlaylist) return this.$context[0].BtnPlaylist;

        // @ts-ignore
        this.$context[0].BtnPlaylist = this;

        this.player = Player.create();

        let song_on = $('body').find(`.inline_player_playlist_main .btn_player[data-song-id="${this.player.songId}"]`);

        if (song_on) {
            this.$context.data('song-id', this.player.songId)
        }

        this.player.$context.on(Player.EVENT_UPDATE_PLAYING,() =>
        {
            $('body').find(`.inline_player_playlist_main .btn_player`).data('song-id', this.player.songId);

            this.player.playing
                ? this.$context.addClass('pause')
                : this.$context.removeClass('pause');
        })

        this.$context.on( 'click',() =>
        {
            if (this.$context.data('song-id')) {
                this.player.playing ? this.player.pause() : this.player.play();
            } else {
                // доделать
                $('body').find('.inline_player_playlist_main .popular-play__item').first()
            }
        })
    }



    public static create($context: JQuery)
    {
        $context.find('.c-button.js-btn-play-playlist').each((index, element) => {

            return new BtnPlaylist($(element));
        })
    }
}