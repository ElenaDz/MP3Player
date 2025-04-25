class Btn_player
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Btn_player) return;

        // @ts-ignore
        this.$context[0].Btn_player = this;

        this.player = Player.create();

        this.$context.find('.play').on('click',() =>
        {
            this.player.url = this.url;
            this.player.updateAction();

        });
    }

    private get url(): string
    {
        return this.$context.data('url');
    }

    public static create($context = $('.btn_player')): Btn_player
    {
        return new Btn_player($context);
    }
}