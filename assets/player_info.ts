class PlayerInfo
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery) {

        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Info) return this.$context[0].Info;

        // @ts-ignore
        this.$context[0].Info = this;

        this.player = Player.create();

        this.disabled();

        this.player.$context.on(Player.EVENT_ERROR,() =>
        {
            this.load();
        })

        this.player.$context.on(Player.EVENT_LOADED_META_DATA,() =>
        {
            this.load();
        })

        this.$context.find('button.dots').on('click',() =>
        {
            this.isOpenDots ? this.closeDots() : this.openDots();
        });
    }

    private load()
    {
        let songPlayer = this.player.songPlayer;

        this.$context.find('.wrap_author').text(songPlayer.artistHtml);

        this.$context.find('.inner_song').text(songPlayer.songName);

        this.$context.find('.inner_song').attr('href', songPlayer.urlSong);

        this.$context.find('.download_song').attr('href', songPlayer.urlSong);

        if (navigator.mediaSession)
        {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: songPlayer.songName,
                artist: songPlayer.artistHtml,
            });
        }

        this.disabled(false);
    }

    private disabled(disabled: boolean = true)
    {
        if (disabled) {
            this.$context.addClass('disabled');
            this.$context.find('button').attr('disabled', 1);

        } else {
            this.$context.removeClass('disabled');
            this.$context.find('button').removeAttr('disabled');
        }
    }

    private openDots()
    {
        this.$context.find('.inner_dots').addClass('open');
    }

    private closeDots()
    {
        this.$context.find('.inner_dots').removeClass('open');
    }

    private get isOpenDots()
    {
        return this.$context.find('.inner_dots').hasClass('open');
    }

    public static create($context = $('.b_player_info')): PlayerInfo
    {
        return new PlayerInfo($context);
    }
}