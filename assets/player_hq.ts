class PlayerHQ
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery) {

        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].HQ) return this.$context[0].Info;

        // @ts-ignore
        this.$context[0].HQ = this;

        this.player = Player.create();

        this.disabled();

        this.player.$context.on(Player.EVENT_LOADED_META_DATA,() =>
        {
            this.disabled(false);
        });

        this.$context.find('button.hq').on('click',() =>
        {
            this.is_hq = this.is_hq;
            this.player.hq = this.is_hq
        });
    }

    private set is_hq(is_hq: boolean)
    {
        is_hq
            ? this.$context.removeClass('is_hq')
            : this.$context.addClass('is_hq');
    }

    private get is_hq()
    {
        return this.$context.hasClass('is_hq');
    }

    private disabled(disabled: boolean = true)
    {
        disabled ? this.$context.addClass('disabled') : this.$context.removeClass('disabled');
    }

    public static create($context = $('.b_player_hq')): PlayerHQ
    {
        return new PlayerHQ($context);
    }
}