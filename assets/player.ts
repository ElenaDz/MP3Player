
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

    // fixme сделать static и убрать в самый низ класса, так как она вспомогательная и к этому классу не относиться
    // https://www.google.com/search?q=%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%88%D0%B0%D1%82%D1%8C+%D0%BC%D0%B0%D1%81%D1%81%D0%B8%D0%B2+%D1%81%D1%82%D1%80%D0%BE%D0%BA+jquery&sca_esv=eee3cc9543ede721&sxsrf=AE3TifOXsQIy-ouBYZA-M4VXuTQWdnzhWw%3A1750415220958&ei=dDdVaIWdOsmn1fIPkbGvyQM&oq=%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%88%D0%B0%D1%82%D1%8C+%D0%BC%D0%B0%D1%81%D1%81%D0%B8%D0%B2+cnhjr&gs_lp=Egxnd3Mtd2l6LXNlcnAiJ9C_0LXRgNC10LzQtdGI0LDRgtGMINC80LDRgdGB0LjQsiBjbmhqcioCCAAyCRAhGKABGAoYKjIHECEYoAEYCjIHECEYoAEYCkj-MlDuHVi8KnABeAOQAQCYAVqgAYQDqgEBNrgBA8gBAPgBAZgCCaAClAPCAgQQABhHwgIFEAAYgATCAggQABiABBiiBMICBRAAGO8FmAMA4gMFEgExIECIBgGQBgiSBwE5oAfGHrIHATa4B40DwgcDNS40yAcK&sclient=gws-wiz-serp
    private shuffleArray(array)
    {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        // fixme не используется
        return array;
    }

    // fixme этого быть в этом классе не должно, плеер не должен ни чего знать про шафл это функция объекта PlayerPlaylist
    public shufflePlaylist()
    {
        // fixme нужно добавить проверку что обновленный плейлист отличается от старого так как иногда при нажатии кнопки
        //  ни чего не происходит, из за того что старый плейлист не отличается от нового, так не должно быть
        this.shuffleArray(this.playlist.songsPlayer);

        this.loadSongPlayer(this.songPlayer, this.playlist);
    }

    public set repeat_playlist(repeat_playlist)
    {
        this._repeat_playlist = repeat_playlist;
    }

    public get repeat_playlist()
    {
        return this._repeat_playlist;
    }

    
    // fixme кажется этот метод можно упростить просто сделав проверку что текущий индекс не равен последнему индексу
    public hesNextSong(): boolean
    {
        let has_next_song: boolean;

        this._playlist.songsPlayer.map((song_player, index) =>
        {
            if (this.songId == song_player.songId) {
                has_next_song = index != this.getLastIndex();
            }
        })

        return this._repeat_playlist ? true : has_next_song;
    }

    // fixme кажется этот метод можно упростить просто сделав проверку что текущий индекс не равен 0
    public hesPreviousSong(): boolean
    {
        let has_previous_song: boolean;

        this._playlist.songsPlayer.map((song_player, index) =>
        {
            if (this.songId == song_player.songId) {
                has_previous_song = index != 0;
            }
        });

        // fixme здесь стоило использовать свойство repeat_playlist, а не внутреннюю переменную _repeat_playlist,
        //  getter repeat_playlist может содержать дополнительную логику, например инициализировать состояние переменной
        //  если она пуста, а мы этим не воспользуемся если будем обращаться напрямую к переменной а не getter у
        //  исправь везде
        // fixme эту проверку нужно делать первой, не бойся иметь несколько return в функции это норм
        return this._repeat_playlist ? true : has_previous_song;
    }

    // fixme избавься от этой функции в ней нет необходимости
    private getLastIndex(): number
    {
        return this._playlist.songsPlayer.length - 1;
    }

    public next()
    {
        let target_index = this.getIndexSong() + 1;

        this.loadSongPlayer(this.getTargetSong(target_index), this._playlist);
    }

    public previous()
    {
        let target_index = this.getIndexSong() - 1;

        this.loadSongPlayer(this.getTargetSong(target_index), this._playlist);
    }

    private getTargetSong(target_index: number): SongPlayer
    {
        let target_song: SongPlayer;

        // fixme а не проще сделать так this.playlist.songsPlayer[index] ?
        //  тогда можно будет совсем избавиться от этой функции
        this._playlist.songsPlayer.map((song_player, index) =>
        {
            if (index == target_index) {
                target_song = song_player;
            }
        })

        return target_song;
    }

    private getIndexSong(): number
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
        this._songPlayer = songPlayer;

        this._playlist = playlist;

        this.url = songPlayer.url;
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