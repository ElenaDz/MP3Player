class Player
{
    private $context: JQuery;
    private audio: HTMLAudioElement;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Player) return;

        // @ts-ignore
        this.$context[0].Player = this;

        this.audio = <HTMLAudioElement>$('body').find('audio')[0];

        this.initEventsAudio()
    }

    private initEventsAudio()
    {
        this.audio.onplay = () => {
            // fixme наверное здесь ты хотели синхронизировать состоянии плеера audio с состоянием нашего плеером или что
            this.playing = this.playing;
        };

        this.audio.onpause = () => {
            this.playing = this.playing;
        };
    }

    // fixme ерунда какая-то, удалить, не нужно для такой проверки заводить отдельный метод делай ее в том месте где она понадобиться
    public updateAction()
    {
        this.playing
            ? this.pause()
            : this.play();
    }

    // @ts-ignore
    private get url(): string
    {
        // fixme так где все такие у нас храниться Url?
        return this.$context.data('btn_player_url');
    }

    // @ts-ignore
    public set url(url: string)
    {
       // fixme храним состояние в двух местах, не вижу причин создавать такую головную боль, удаляем
       this.$context.data('btn_player_url');

       this.audio.src = url;
    }

    private play()
    {
        this.audio.play();
    }

    private pause()
    {
        this.audio.pause();
    }

    // fixme ерунда какая-то, ошибка логики, set playing=true привет к тому что get  playing вернет false
    private set playing(playing: boolean)
    {
        playing
            ? this.$context.removeClass('playing')
            : this.$context.addClass('playing');
    }

    private get playing(): boolean
    {
        return this.$context.hasClass('playing');
    }

    public static create($context = $('.b_player')): Player
    {
        return new Player($context);
    }
}