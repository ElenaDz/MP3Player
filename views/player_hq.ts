class PlayerHQ
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery) {

        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].HQ) return this.$context[0].HQ;

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
            this.active = ! this.active;
            this.player.hq = this.active
        });
    }

    // fixme переименовать в active, так как это свойство, если бы был метод тогда бы он назывался isActive ok
    private set active(active: boolean)
    {
        active
            ? this.$context.addClass('active')
            : this.$context.removeClass('active');
    }

    private get active()
    {
        return this.$context.hasClass('active');
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