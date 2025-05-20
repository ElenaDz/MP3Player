
interface SongPlayer {
    url: string;
    artist_html: string;
    song_name: string;
    url_song: string;
}

class Player
{
    static readonly EVENT_UPDATE_PLAYING = 'Player.EVENT_UPDATE_PLAYING';
    static readonly EVENT_UPDATE_TIME = 'Player.EVENT_UPDATE_TIME';
    static readonly EVENT_UPDATE_VOLUME = 'Player.EVENT_UPDATE_VOLUME';
    static readonly EVENT_LOADED_META_DATA = 'Player.EVENT_LOADED_META_DATA';
    static readonly EVENT_ERROR = 'Player.EVENT_ERROR';

    public $context: JQuery;
    public songPlayer: SongPlayer;
    private audio: HTMLAudioElement;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Player) return this.$context[0].Player;

        // @ts-ignore
        this.$context[0].Player = this;

        this.audio = <HTMLAudioElement> this.$context.find('audio')[0];

        this.initCreate();

        this.initEventsAudio();
    }

    private initCreate()
    {
        Controls.create();
        Progress.create();
        Volume.create();
        Info.create();
        Playlist.create();
    }

    private initEventsAudio()
    {
        this.audio.addEventListener('play', () =>
        {
            this.playing = ! this.audio.paused;
        });

        this.audio.addEventListener('pause', () =>
        {
            this.playing = ! this.audio.paused;
        });

        this.audio.addEventListener('loadedmetadata', () =>
        {
            this.playing = true;

            this.$context.trigger(Player.EVENT_LOADED_META_DATA);
        });

        this.audio.addEventListener('timeupdate', () =>
        {
            this.$context.trigger(Player.EVENT_UPDATE_TIME);
        });

        this.audio.addEventListener('volumechange', () =>
        {
            this.$context.trigger(Player.EVENT_UPDATE_VOLUME);
        });

        this.audio.addEventListener('error', () =>
        {
            this.$context.trigger(Player.EVENT_ERROR);
        });
    }

    public getSongPlayer(): SongPlayer
    {
        return this.songPlayer;
    }

    public get songId()
    {
        let filename = this.url.split('/').reverse()[0];

        return filename;
    }

    public get url()
    {
        return this.audio.src;
    }

    private set url(url)
    {
        this.audio.src = url;
    }

    public loadSong(song: SongPlayer, playlist: SongPlayer[] = [])
    {
        this.songPlayer = song;

        this.url = song.url;
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