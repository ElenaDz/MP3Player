class Player
{
    private $context: JQuery;
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
            this.playing = this.playing;
        };

        this.audio.onpause = () => {
            this.playing = this.playing;
        };
    }
    public updateAction()
    {
        this.playing
            ? this.pause()
            : this.play();
    }

    // @ts-ignore
    private get url(): string
    {
        return this.$context.data('btn_player_url');
    }

    // @ts-ignore
    public set url(url: string)
    {
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