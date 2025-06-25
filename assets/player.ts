
interface SongPlayer {
    songId: number;
    url: string;
    artistHtml: string;
    songName: string;
    urlSong: string;
    clicks: number;
}

class Player
{
    static readonly EVENT_UPDATE_PLAYING = 'Player.EVENT_UPDATE_PLAYING';
    static readonly EVENT_UPDATE_REPEAT_PLAYLIST = 'Player.EVENT_UPDATE_REPEAT_PLAYLIST';
    static readonly EVENT_UPDATE_TIME = 'Player.EVENT_UPDATE_TIME';
    static readonly EVENT_UPDATE_VOLUME = 'Player.EVENT_UPDATE_VOLUME';
    static readonly EVENT_LOADED_META_DATA = 'Player.EVENT_LOADED_META_DATA';
    static readonly EVENT_ERROR = 'Player.EVENT_ERROR';
    static readonly EVENT_ENDED = 'Player.EVENT_ENDED';

    public $context: JQuery;

    private audio: HTMLAudioElement;
    private _songPlayer: SongPlayer;
    private _playlist: Playlist;
    private _repeat_playlist: boolean;


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
        PlayerControls.create();
        PlayerProgress.create();
        PlayerVolume.create();
        PlayerInfo.create();
        PlayerPlaylist.create();
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

        this.audio.addEventListener('ended', () =>
        {
            this.$context.trigger(Player.EVENT_ENDED);
        });

        this.audio.addEventListener('error', () =>
        {
            this.$context.trigger(Player.EVENT_ERROR);
        });

    }
    public set repeat_playlist(repeat_playlist)
    {
        this._repeat_playlist = repeat_playlist;

        this.$context.trigger(Player.EVENT_UPDATE_REPEAT_PLAYLIST);
    }

    public get repeat_playlist()
    {
        return this._repeat_playlist;
    }
    
    // fixme кажется этот метод можно упростить просто сделав проверку что текущий индекс не равен последнему индексу ok
    public hesNextSong(): boolean
    {
        if (this.repeat_playlist) return true;

        return this.getIndexSong() != this.getLastIndex();
    }

    // fixme кажется этот метод можно упростить просто сделав проверку что текущий индекс не равен 0 ok
    public hesPreviousSong(): boolean
    {
        if (this.repeat_playlist) return true;

        return this.getIndexSong() != 0;
    }

    public next()
    {
        let target_index = (this.repeat_playlist && (this.getIndexSong() == this.getLastIndex()))
            ? 0
            : this.getIndexSong() + 1;

        this.loadSongPlayer(this.playlist.songsPlayer[target_index], this._playlist);
    }

    public previous()
    {
        let target_index = (this.repeat_playlist && (this.getIndexSong() == 0))
            ? this.getLastIndex() :
            this.getIndexSong() - 1;

        this.loadSongPlayer(this.playlist.songsPlayer[target_index], this._playlist);
    }

    // используется в нескольких местах
    private getLastIndex()
    {
        return this._playlist.songsPlayer.length - 1;
    }

    public getIndexSong(): number
    {
        let index_active_song: number;

        this._playlist.songsPlayer.map((song_player, index) =>
        {
            if (song_player.songId == this.songId) {

                index_active_song = index;
                return;
            }
        })

        return index_active_song;
    }

    public get songId()
    {
        return this.songPlayer ? this.songPlayer.songId : null;
    }

    public get url()
    {
        return this.audio.src;
    }

    private set url(url)
    {
        this.audio.src = url;
    }

    public loadSongPlayer(songPlayer: SongPlayer, playlist: Playlist)
    {
        this._playlist = playlist;

        if ( !this.songPlayer || this.songPlayer.songId != songPlayer.songId ) {
            this.url = songPlayer.url;
        }

        this._songPlayer = songPlayer;

    }

    public get songPlayer(): SongPlayer
    {
        return this._songPlayer;
    }

    public get playlist(): Playlist
    {
        return this._playlist;
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