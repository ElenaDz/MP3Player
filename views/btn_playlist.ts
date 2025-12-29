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



        this.$context.on('click',() =>
        {
            console.log(this.playlist.id)
        });
    }



    public static create($context: JQuery)
    {
        $context.find('.song-author-btn.btn-play, .c-button.js-btn-play-playlist').each((index, element) => {

            return new BtnPlaylist($(element));
        })
    }
}