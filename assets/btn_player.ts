class BtnPlayer
{
    private $context: JQuery;
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
    private get url(): string
    {
        return this.$context.data('url');
    }

    private get songName()
    {
        return this.$context.data('song_name')
    }

    private get urlSong()
    {
        return this.$context.data('url_song')
    }

    private get artistHtml()
    {
        return this.$context.data('artist_html')
    }

    private play()
    {
        if (this.player.songId !== this.songId) {

            if (this.url) {
                this.player.loadSong({
                    url: this.url,
                    artistHtml: this.artistHtml,
                    songName: this.songName,
                    urlSong: this.urlSong
                });
            }
        }

        this.player.play();
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

    public static create($context = $('.btn_player')): BtnPlayer[]
    {
        // @ts-ignore
        return $context.map(
            (index, element) : BtnPlayer => {
                return new BtnPlayer($(element))
            }
        );
    }
}