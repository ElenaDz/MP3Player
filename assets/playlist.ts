class Playlist
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery) {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Playlist) return this.$context[0].Playlist;

        // @ts-ignore
        this.$context[0].Playlist = this;

        this.player = Player.create();

        this.$context.on('click',() =>
        {

        });
    }

    public static create($context = $('.b_player_playlist')): Playlist
    {
        return new Playlist($context);
    }
}