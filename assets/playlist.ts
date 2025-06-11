class Playlist
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Controls) return this.$context[0].Playlist;

        // @ts-ignore
        this.$context[0].Playlist = this;

        this.player = Player.create();
    }

    public static create($context = $('.playlist'))
    {
        return new Playlist($context);
    }
}
