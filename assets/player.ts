class Player
{
    static readonly EVENT_UPDATE_PLAYING = 'Player.EVENT_UPDATE_PLAYING';
    static readonly EVENT_UPDATE_TIME = 'Player.EVENT_UPDATE_TIME';
    static readonly EVENT_LOADED_META_DATA = 'Player.EVENT_LOADED_META_DATA';

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
            this.playing = ! this.audio.paused;
        };

        this.audio.onpause = () => {
            this.playing = ! this.audio.paused;
        };

        this.audio.onloadedmetadata = () =>
        {
            this.playing = true;

            this.$context.trigger(Player.EVENT_LOADED_META_DATA)
        }

        this.audio.ontimeupdate = () => {
            this.$context.trigger(Player.EVENT_UPDATE_TIME)
        };
    }

    public get songId()
    {
        return this.url.split('/').reverse()[0];
    }

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

    public get volume()
    {
        return this.audio.volume;
    }

    public set volume(volume: number)
    {
        this.audio.volume = volume;
    }

    public set mute(mute: boolean)
    {
        this.audio.muted = mute;
    }
    public get mute()
    {
        return this.audio.muted;
    }

    public set playing(playing: boolean)
    {
        playing
            ? this.$context.addClass('playing')
            : this.$context.removeClass('playing');

        this.$context.trigger(Player.EVENT_UPDATE_PLAYING)
    }

    public get playing(): boolean
    {
        return ! this.audio.paused;
    }

    public static create($context = $('.b_player')): Player
    {
        return new Player($context);
    }
}