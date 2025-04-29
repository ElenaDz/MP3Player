class Player
{
    static readonly EVENT_UPDATE_ACTION = 'Player.EVENT_UPDATE_ACTION';

    public $context: JQuery;
    private audio: HTMLAudioElement;

    constructor($context: JQuery)
    {
        this.$context = $context;

        this.audio = <HTMLAudioElement>$('body').find('audio')[0];

        // @ts-ignore
        if (this.$context[0].Player) return;

        // @ts-ignore
        this.$context[0].Player = this;

        this.initEventsAudio()

    }

    private initEventsAudio()
    {
        this.audio.onplay = () => {
            this.playing = !this.is_playing;
            this.$context.trigger(Player.EVENT_UPDATE_ACTION)
        };

        this.audio.onpause = () => {
            this.playing = !this.is_playing;
            this.$context.trigger(Player.EVENT_UPDATE_ACTION)
        };

        this.audio.onloadedmetadata = () => {
            this.playing = true;
        }
    }

    // @ts-ignore
    public get song_id(): string
    {
        // fixme так где все такие у нас храниться Url? ok
        return this.$context.data('url');
    }

    // @ts-ignore
    public set song_id(url: string)
    {
       // fixme храним состояние в двух местах, не вижу причин создавать такую головную боль, удаляем ok
        this.$context.data('url', url);
    }

    public play()
    {
        this.audio.src = this.song_id;
        this.audio.play()
    }

    public pause()
    {
        this.audio.pause();
    }

    // fixme ерунда какая-то, ошибка логики, set playing=true привет к тому что get  playing вернет false ok
    public set playing(playing: boolean)
    {
        playing
            ? this.$context.addClass('playing')
            : this.$context.removeClass('playing');
    }

    public get is_playing(): boolean
    {
        return this.$context.hasClass('playing');
    }

    public static create($context = $('.b_player')): Player
    {
        return new Player($context);
    }
}