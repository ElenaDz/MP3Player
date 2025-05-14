class Controls
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Controls) return this.$context[0].Controls;

        // @ts-ignore
        this.$context[0].Controls = this;

        this.player = Player.create();

        this.disabled();

        this.player.$context.on(Player.EVENT_LOADED_META_DATA,() =>
        {
            this.$context.find('button.play').removeAttr('disabled');
        })

        this.player.$context.on(Player.EVENT_ERROR,() =>
        {
            this.disabled();
        })

        this.$context.find('button.play').on('click',() =>
        {
            if ( ! this.player.url) {
                throw new Error('Не задан url');
            }

            this.player.playing ? this.player.pause() : this.player.play();
        });
    }

    private disabled()
    {
        this.$context.find('button.play').attr('disabled', 1);
        this.$context.find('button.prev').attr('disabled', 1);
        this.$context.find('button.next').attr('disabled', 1);
    }

    public static create($context = $('.b_player_controls'))
    {
        return new Controls($context);
    }
}
