
interface SongPlayer {
    url: string;
    artistHtml: string;
    songName: string;
    urlSong: string;
}

class Player
{
    static readonly EVENT_UPDATE_PLAYING = 'Player.EVENT_UPDATE_PLAYING';
    static readonly EVENT_UPDATE_TIME = 'Player.EVENT_UPDATE_TIME';
    static readonly EVENT_UPDATE_VOLUME = 'Player.EVENT_UPDATE_VOLUME';
    static readonly EVENT_LOADED_META_DATA = 'Player.EVENT_LOADED_META_DATA';
    static readonly EVENT_ERROR = 'Player.EVENT_ERROR';

    public $context: JQuery;

    private songPlayer: SongPlayer;
    private audio: HTMLAudioElement;
    private _playlist: SongPlayer[] = [];
    private _playlist_title: string;


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
        Player_controls.create();
        Player_progress.create();
        Player_volume.create();
        Player_info.create();
        Player_playlist.create();
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

    public get songId()
    {
        let filename = this.url ? this.url.split('/').reverse()[0] : null;

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

    public loadSongPlayer(songPlayer: SongPlayer, playlist: SongPlayer[], playlist_title: string)
    {
        this.songPlayer = songPlayer;

        this.playlist = playlist;

        this.url = songPlayer.url;

        this.playlist_title = playlist_title;
    }

    private set playlist_title(playlist_title: string)
    {
        this._playlist_title = playlist_title;
    }

    public get playlist_title(): string
    {
        return this._playlist_title;
    }
    public getSongPlayer(): SongPlayer
    {
        return this.songPlayer;
    }

    public get playlist(): SongPlayer[]
    {
        return this._playlist;
    }

    private set playlist(playlist:SongPlayer[])
    {
        this._playlist = playlist;
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

    // fixme метод не используется, а должен (зачем?, я сравниваю плейлисты при загрузки песни)
    public static getPlaylistId(playlist:SongPlayer[]): string
    {
        return playlist.map((songPlayer:SongPlayer) =>
            {
                songPlayer.songName
            })
            .join(' ');
    }

    public static create($context = $('.b_player')): Player
    {
        return new Player($context);
    }
}