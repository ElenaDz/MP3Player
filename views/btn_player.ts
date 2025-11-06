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
        return parseInt(this.$context.data('song_id'));
    }

    // @ts-ignore
    public get url(): string
    {
        return this.$context.data('url');
    }

    public get url_hq(): string
    {
        return this.$context.data('url_hq');
    }

    private get clicks(): number
    {
        return parseInt(this.$context.data('clicks'));
    }

    public get songName()
    {
        return this.$context.data('song_name')
    }

    public get urlSong()
    {
        return this.$context.data('url_song')
    }

    public get artistHtml()
    {
        return this.$context.data('artist_html')
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
        let btns_player = BtnPlayer.create($(this.$context.parents('.inline_player_playlist_main')))

        let songs_player: SongPlayer[] = [];

        btns_player.forEach((btn_player) => {
            songs_player.push(btn_player.songPlayer)
        });

        let title = this.$context
            .parents('.inline_player_playlist_main')
            .parent()
            .find('h2')
            .text();

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
            urlSong: this.urlSong,
            clicks: this.clicks
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