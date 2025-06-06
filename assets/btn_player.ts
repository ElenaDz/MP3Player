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

    private get songId(): string
    {
        let filename = this.url ? this.url.split('/').reverse()[0] : null;

        return filename;
    }

    // @ts-ignore
    public get url(): string
    {
        return this.$context.data('url');
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
        if (this.player.songId !== this.songId) {

            if (this.url) {
                this.player.loadSongPlayer(this.songPlayer,  this.getPlaylist());
            }
        }
    }

    private getPlaylist()
    {
        let btns_player = BtnPlayer.create($(this.$context.parents('.inline_player_playlist_main')))

        let playlist = [];

        btns_player.forEach((btn_player) => {

            playlist.push(btn_player.songPlayer)
        })

        return  playlist;
    }

    public get songPlayer(): SongPlayer
    {
        return {
            url: this.url,
            artistHtml: this.artistHtml,
            songName: this.songName,
            urlSong: this.urlSong
        }
    }

    private pause()
    {
        this.player.pause();
    }

    private set playing(playing: boolean)
    {
        playing
            ? this.$context.addClass('playing')
            : this.$context.removeClass('playing');
    }

    private get playing(): boolean
    {
        return this.$context.hasClass('playing');
    }

    // fixme не правильно здесь определен $context, $context это контекст в котором мы хотим найти все btn player и создать их например body или плейлист(ok?)
    // @ts-ignore
    public static create($context = $('.inline_player_playlist_main')): BtnPlayer []
    {
        let $playlists = $context;

        let btns_player: BtnPlayer [] = [];

        $playlists.find('.btn_player').each((index, element) => {
            btns_player.push(new BtnPlayer($(element)));
        })
        return btns_player;
    }
}