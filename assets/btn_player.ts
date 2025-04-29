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

        this.player.$context.on(Player.EVENT_UPDATE_ACTION,() =>
        {
            if (this.player.song_id == this.song_id) {
                // fixme синхронизируй с состоянием плеера, а не просто пиши сомнительную логику, которая завтра сломается
                this.playing = ! this.playing;

            } else  {
                this.playing = false;
            }
        })
    }

    // fixme тоже самое что я писал в блоке плеер
    // @ts-ignore
    private get song_id(): string
    {
        return this.$context.data('url');
    }

    private play()
    {
        // fixme из за этой строчки плеер работает не так как на https://muzyara.com/, нужно продолжать воспроизведение,
        //  а не начинать сначала, если песня уже загружена в плеер
        this.player.song_id = this.song_id;
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