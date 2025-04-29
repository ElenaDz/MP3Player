class Controls
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Controls) return;

        // @ts-ignore
        this.$context[0].Controls = this;

        this.player = Player.create();

        this.$context.find('button.play').on('click',() =>
        {
            if (this.player.song_id) {
                this.player.is_playing ? this.player.pause() : this.player.play();
            }
        });
    }

    public static create($context = $('.b_player_controls'))
    {
        return new Controls($context);
    }
}
