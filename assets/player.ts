class Player
{
    static readonly EVENT_UPDATE_PLAYING = 'Player.EVENT_UPDATE_PLAYING';
    static readonly EVENT_UPDATE_TIME = 'Player.EVENT_UPDATE_TIME';

    public $context: JQuery;
    private audio: HTMLAudioElement;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Player) return this.$context[0].Player;

        // @ts-ignore
        this.$context[0].Player = this;

        this.audio = <HTMLAudioElement> this.$context.find('audio')[0];

        Controls.create();
        Progress.create();
        Volume.create();

        this.initEventsAudio();

    }



    private initEventsAudio()
    {
        this.audio.onplay = () => {
            // fixme лучше синхронизировать состояние твоего плеера с audio, чем просто надеяться на логику работы, которая
            //  сейчас работает, а завтра нет, потому что что то изменилось, для синхронизации используй свойство audio.paused
            //  это касается все 3х обработчиков ok
            // console.log('play');
            this.playing = !this.audio.paused;
            this.$context.trigger(Player.EVENT_UPDATE_PLAYING)
        };

        this.audio.onpause = () => {
            // console.log('pause');
            this.playing = !this.audio.paused;
            this.$context.trigger(Player.EVENT_UPDATE_PLAYING)
        };

        this.audio.onloadedmetadata = () => {
            // console.log('load', this.audio.paused);
            this.playing = true;
            this.$context.trigger(Player.EVENT_UPDATE_PLAYING)
        }

        this.audio.ontimeupdate = () => {
            this.$context.trigger(Player.EVENT_UPDATE_TIME)
        };

    }

    // fixme заведи свойство url ok
    public get url()
    {
        return this.audio.src;
    }

    public set url(url)
    {
        this.audio.src = url;
    }

    public play()
    {
        // fixme завтра song id будет цифрой, здесь должно быть обращение к свойству url ok
        this.audio.play();
    }

    public pause()
    {
        this.audio.pause();
    }

    public set currentTime(current_time: number)
    {
        this.audio.currentTime = current_time;
    }

    public get currentTime(): number
    {
        return this.audio.currentTime;
    }

    public get duration(): number
    {
        return this.audio.duration;
    }

    public set playing(playing: boolean)
    {
        playing
            ? this.$context.addClass('playing')
            : this.$context.removeClass('playing');
    }

    public get playing(): boolean
    {
        return !this.audio.paused;
    }

    public static create($context = $('.b_player')): Player
    {
        return new Player($context);
    }
}