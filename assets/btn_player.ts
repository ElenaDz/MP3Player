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
        //
        this.$context.on('click',() =>
        {
            this.playing ? this.pause() : this.play();
        });

        this.player.$context.on(Player.EVENT_UPDATE_PLAYING,() =>
        {
            // fixme я просил завести свойство song id и использовать его для такой проверки, url'ов может быть несколько у одной
            //  и той же песни например hd и обычное качество
            if (this.player.url == this.url) {
                this.playing = this.player.playing;

            } else  {
                this.playing = false;
            }
        })
    }

    private get song_id(): string
    {
        // fixme не знаю откуда брать song id
        return ;
    }

    // @ts-ignore
    private get url(): string
    {
        return this.$context.data('url');
    }

    private play()
    {
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