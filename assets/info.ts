class Info
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

        this.player.$context.on(Player.EVENT_LOADED_META_DATA,() =>
        {
            // todo не нужно здесь получать каждое свойство по отдельности, получили из плеера объект SongPlayer и работай здесь с ним
        })
    }

    private set songName(song_name) {

    }

    private set artistName(artist_name) {

    }

    private set songUrl(song_url) {

    }

    public static create($context = $('.b_player_info'))
    {
        return new Info($context);
    }
}