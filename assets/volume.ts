class Volume
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Progress) return;

        // @ts-ignore
        this.$context[0].Progress = this;

        this.player = Player.create();

    }


    public static create($context = $('.b_player_volume')): Volume
    {
        return new Volume($context);
    }

}