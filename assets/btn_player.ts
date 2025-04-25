class BtnPlayer
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].BtnPlayer) return;

        // @ts-ignore
        this.$context[0].BtnPlayer = this;

        this.player = Player.create();

        this.$context.find('button.play').on('click',() =>
        {
            // fixme не правильно, правильно создать здесь методы play, pause и isPlaying и воспользоваться ими
            this.player.url = this.url;
            this.player.updateAction();
        });
    }

    private get url(): string
    {
        return this.$context.data('url');
    }

    public static create($context = $('.btn_player')): BtnPlayer
    {
        return new BtnPlayer($context);
    }
}