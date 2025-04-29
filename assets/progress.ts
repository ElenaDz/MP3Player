class Progress
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Progress) return this.$context[0].Progress;

        // @ts-ignore
        this.$context[0].Progress = this;

        this.player = Player.create();
    }


    public static create($context = $('.b_player_progress')): Progress
    {
        return new Progress($context);
    }

}