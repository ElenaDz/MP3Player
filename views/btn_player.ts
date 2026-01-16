class BtnPlayer
{
    public $context: JQuery;
    private player: Player;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].BtnPlayer) return this.$context[0].BtnPlayer;

        // @ts-ignore
        this.$context[0].BtnPlayer = this;

        this.player = Player.create();

        if (
                this.player.songPlayer
            &&  this.player.playing
            &&  this.player.songPlayer.songId === this.songId
        ) {
            this.playing = true;
        }

        this.$context.on('click',() =>
        {
            this.playing ? this.pause() : this.play();
        });

        this.player.$context.on(Player.EVENT_UPDATE_PLAYING,() =>
        {
            if (this.player.songId === this.songId)
            {
                this.playing = this.player.playing;

            } else  {
                this.playing = false;
            }
        })
    }

    public get songId(): number
    {
        return parseInt(this.$context.find('button').data('song-id'));
    }

    // @ts-ignore
    public get url(): string
    {
        return this.$context.find('button').data('url');
    }

    public get url_hq(): string
    {
        return this.$context.find('button').data('url_hq');
    }

    private get clicks(): number
    {
        return parseInt(this.$context.parents('.music-popular__item').find('.popular-download-number').text()) || 0;
    }

    public get song_time(): string
    {
        return this.$context.parents('.music-popular__item').find('.time-hover').text()
            || this.$context.parents('.music-popular__item').find('.popular-download-number').text()
            || this.$context.parents('.item').find('.song_time').text()
            || this.$context.parents('.player-music__item').find('.player-time').text();
    }

    private get url_song_img(): string
    {
        return this.$context.find('button').data('image')
            || this.$context.parents('.music-popular__item').find('.lazyloaded').data('src')
            || '/templates/drivemusic/img/note.svg';
    }

    public get songName()
    {
        return this.$context.parents().first().find('.popular-play-author').text()
            || this.$context.parents().first().find('.music-name-text').text();
    }

    //  страница песни
    public get urlSongPage()
    {
        return this.$context.parents().first().find('.popular-play-author').attr('href')
            || this.$context.parents().first().find('.music-name-text').attr('href');
    }

    public get artistHtml()
    {
        return this.$context.parents().first().find('.popular-play-composition').html() || '';
    }

    private play()
    {
        this.load();

        this.player.play();
    }

    private load()
    {
        if (this.player.songId !== this.songId || this.getPlaylist().id !== this.player.playlist.id)
        {
            if (this.url) {
                this.player.loadSongPlayer(this.songPlayer, this.getPlaylist());
            }
        }
    }

    private getPlaylist(): Playlist
    {
        let playlist: JQuery;

        if ($(this.$context.parents('.inline_player_playlist_main')).length > 0) {
            playlist = $(this.$context.parents('.inline_player_playlist_main'));
        } else  {
            playlist = $(this.$context.parents('.box-player-music'));
        }

        let btns_player = BtnPlayer.create(playlist);

        let songs_player: SongPlayer[] = [];

        btns_player.forEach((btn_player) => {
            songs_player.push(btn_player.songPlayer)
        });

        let title = this.$context.parents('.main-music-content').find('h1').not('.song-title-text').text()
            || this.$context.parents('.inline_player_playlist_main').find('.music-title-link').text()
            || this.$context.parents('.inline_player_playlist_main').find('.music-title').text()
            || this.$context.parents('.box-player__item').find('.picture-text__link').text()
            || this.$context.parents('.main-music-content').find('.c-playlist-content__title').text()
            || this.$context.parents('.main-music-popular').find('.music-title-link').text()
            || this.$context.parents('.main-music-popular').find('.music-title').text()
            || this.$context.parents('.main-music-content').find('.song-top-title .music-title .music-title-link').text()
            || this.$context.parents('.main-music-content').find('.main-music-top-title .music-title').text()
            || this.$context.parents('.main-music-content').find('.music-title .music-title-link').text()
            || this.player.$context.find('.music_title').text();

        return new Playlist(songs_player, title);
    }

    public get songPlayer(): SongPlayer
    {
        return {
            songId: this.songId,
            url: this.url,
            url_hq: this.url_hq,
            artistHtml: this.artistHtml,
            songName: this.songName,
            urlSongPage: this.urlSongPage,
            clicks: this.clicks,
            urlSongImg: this.url_song_img,
            songTime: this.song_time
        }
    }

    private pause()
    {
        this.player.pause();
    }

    public set playing(playing: boolean)
    {
        playing
            ? this.$context.addClass('playing')
            : this.$context.removeClass('playing');

        playing
            ? this.$context.addClass('pause')
            : this.$context.removeClass('pause');
    }

    public get playing(): boolean
    {
        return this.$context.hasClass('playing');
    }


    public static create($context: JQuery): BtnPlayer []
    {
        let btns_player: BtnPlayer [] = [];

        $context.find('.btn_player').each((index, element) => {
            btns_player.push(new BtnPlayer($(element)));
        })
        return btns_player;
    }
}