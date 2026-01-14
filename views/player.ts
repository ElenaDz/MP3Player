
interface SongPlayer {
    songId: number;
    url: string;
    url_hq: string;
    artistHtml: string;
    songName: string;
    urlSongPage: string;
    clicks: number;
    urlSongImg: string;
    songTime: string;
}

class Player
{
    static readonly EVENT_UPDATE_PLAYING = 'Player.EVENT_UPDATE_PLAYING';
    static readonly EVENT_UPDATE_REPEAT_PLAYLIST = 'Player.EVENT_UPDATE_REPEAT_PLAYLIST';
    static readonly EVENT_UPDATE_TIME = 'Player.EVENT_UPDATE_TIME';
    static readonly EVENT_UPDATE_VOLUME = 'Player.EVENT_UPDATE_VOLUME';
    static readonly EVENT_UPDATE_HQ = 'Player.EVENT_UPDATE_HQ';
    static readonly EVENT_LOADED_META_DATA = 'Player.EVENT_LOADED_META_DATA';
    static readonly EVENT_LOADED_SONG_PLAYER = 'Player.EVENT_LOADED_SONG_PLAYER';
    static readonly EVENT_ERROR = 'Player.EVENT_ERROR';
    static readonly EVENT_ENDED = 'Player.EVENT_ENDED';

    public $context: JQuery;

    private audio: HTMLAudioElement;
    private _songPlayer: SongPlayer;
    private _playlist: Playlist;
    private _repeat_playlist: boolean;
    private _hq: boolean = false;
    private timeout_alert_id: number;


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

        this.initAlert();

    }


    private initCreate()
    {
        PlayerControls.create();
        PlayerProgress.create();
        PlayerVolume.create();
        PlayerInfo.create();
        PlayerPlaylist.create()
        // PlayerHQ.create();
        PlayerEQ.create();
    }

    private initAlert()
    {
        this.$context.on(Player.EVENT_ERROR, () =>
        {
            clearTimeout(this.timeout_alert_id);

            setTimeout(
                () => {
                    if (!this.playing) {
                        this.alert('Ошибка', 'Трек не доступен или ссылка устарела. Пожалуйста, обновите страницу.');
                    }
                },
                1*1000
            );

            this.$context.find('.alert').on('click',(alert) =>
            {
                this.alert_close();
            });
        });

        this.$context.on(Player.EVENT_LOADED_META_DATA,() =>
        {
            this.alert_close();
        });
    }

    private alert_close()
    {
        this.$context.find('.alert').removeClass('show');
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

    public getAudio(): HTMLAudioElement
    {
        return this.audio;
    }

    public set hq(hq: boolean)
    {
        if (this._hq == hq) return;

        this._hq = hq;

        let time = this.currentTime;

        this.loadSongPlayer(this.songPlayer, this.playlist);

        this.currentTime = time;
    }

    public get hq()
    {
        return this._hq;
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


    public hasNextSong(): boolean
    {
        return !! this.getNextSong();
    }


    public hasPreviousSong(): boolean
    {
        return !! this.getPreviousSong();
    }

    public next()
    {
        this.loadSongPlayer(this.getNextSong(), this.playlist);
    }

    public previous()
    {
        this.loadSongPlayer(this.getPreviousSong(), this.playlist);
    }

    private getNextSong()
    {
        let target_index = (this.repeat_playlist && (this.getIndexSongCurrent() == this.getIndexSongLast()))
            ? 0
            : this.getIndexSongCurrent() + 1;

        return this.playlist.songsPlayer[target_index];
    }

    private getPreviousSong()
    {
        let target_index = (this.repeat_playlist && (this.getIndexSongCurrent() == 0))
            ? this.getIndexSongLast() :
            this.getIndexSongCurrent() - 1;

        return this.playlist.songsPlayer[target_index]
    }

    public getIndexSongCurrent(): number
    {
        let index_active_song: number;

        this.playlist.songsPlayer.map((song_player, index) =>
        {
            if (song_player.songId == this.songId)
            {
                index_active_song = index;
                return;
            }
        });

        return index_active_song;
    }

    private getIndexSongLast()
    {
        return this.playlist.songsPlayer.length - 1;
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

        if (this.songId  == songPlayer.songId){
            return;

        } else {
            this.url = this.hq ? songPlayer.url_hq :songPlayer.url;
            this.play();
        }

        this._songPlayer = songPlayer;

        this.$context.trigger(Player.EVENT_LOADED_SONG_PLAYER);
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
        this.audio.play()
            .then(() => {})
            .catch(error => {
               this.$context.trigger(Player.EVENT_ERROR)
            });
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
        this.audio.volume = Number(volume.toFixed(2));
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

    public alert(title: string, msg: string)
    {
        let alert = $(`
            <div class="alert b_popup">
                <h3 class="title"></h3>
                <span class="msg"></span>
            </div>
        `);

        if (this.$context.find('.alert').length == 0){
            this.$context.append(alert);
        }

        let $alert = this.$context.find('.alert');

        $alert.addClass('show');
        $alert.find('.title').text(title);
        $alert.find('.msg').text(msg);

        let  timeout_id= setTimeout(
            () => {
                $alert.removeClass('show');
            },
            6*1000
        );

        this.timeout_alert_id = +timeout_id;
    }

    public static create($context = $('.b_player')): Player
    {
        return new Player($context);
    }
}