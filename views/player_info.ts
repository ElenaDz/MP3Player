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

        this.player.$context.on(Player.EVENT_ERROR + " || " + Player.EVENT_LOADED_META_DATA,() =>
        {
            this.load();
        })

        this.initDots();
        this.initFavorite();
    }

    private initDots()
    {
        this.$context.find('button.dots').on('click',() =>
        {
            this.isOpenDots ? this.closeDots() : this.openDots();
        });
    }

    private initFavorite()
    {
        this.$context.find('button.favorite').on('click',() =>
        {
            this.is_favorite = this.is_favorite;
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

    private set is_favorite(is_favorite)
    {
        is_favorite
            ? this.$context.find('.inner_favorite').removeClass('is_favorite')
            : this.$context.find('.inner_favorite').addClass('is_favorite');

        is_favorite
            ? this.$context.find('.inner_favorite .text').text('')
            : this.$context.find('.inner_favorite .text').append('Трек добавлен в <a href="">Мои лайки</a>');
    }

    private get is_favorite()
    {
        return this.$context.find('.inner_favorite').hasClass('is_favorite');
    }

    public static create($context = $('.b_player_info')): PlayerInfo
    {
        return new PlayerInfo($context);
    }
}