class BtnPlayer
{
    private $context: JQuery;
    private player: Player;


    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].BtnPlayer) return this.$context[0].BtnPlayer;

        // @ts-ignore
        this.$context[0].BtnPlayer = this;

        this.player = Player.create();

        this.$context.on('click',() =>
        {
            this.playing ? this.pause() : this.play();
        });

        this.player.$context.on(Player.EVENT_UPDATE_PLAYING,() =>
        {
            if (this.player.url == this.url) {
                // fixme синхронизируй с состоянием плеера, а не просто пиши сомнительную логику, которая завтра сломается ok
                this.playing = this.player.playing;

            } else  {
                this.playing = false;
            }
        })
    }

    // fixme тоже самое что я писал в блоке плеер ok
    // @ts-ignore
    private get url(): string
    {
        return this.$context.data('url');
    }

    private play()
    {
        // fixme из за этой строчки плеер работает не так как на https://muzyara.com/, нужно продолжать воспроизведение,
        //  а не начинать сначала, если песня уже загружена в плеер ok
        if (this.player.url !== this.url) {
            this.player.url = this.url;
        }

        this.player.play();
    }

    private pause()
    {
        this.player.pause();
    }

    private set playing(playing: boolean)
    {
        playing
            ? this.$context.addClass('playing')
            : this.$context.removeClass('playing');
    }

    private get playing(): boolean
    {
        return this.$context.hasClass('playing');
    }

    public static create($context = $('.btn_player')): BtnPlayer[]
    {
        // @ts-ignore
        return $context.map(
            (index, element) : BtnPlayer => {
                return new BtnPlayer($(element))
            }
        );
    }
}