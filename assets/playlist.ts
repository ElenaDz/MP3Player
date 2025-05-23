class Playlist
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery) {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Playlist) return this.$context[0].Playlist;

        // @ts-ignore
        this.$context[0].Playlist = this;

        this.player = Player.create();

        this.$context.find('button.close').on('click',() =>
        {
            this.is_active = false;
        });

        this.$context.find('button.playlist_btn').on('click',() =>
        {
            this.is_active = ! this.is_active;
        });

        this.player.$context.on(Player.EVENT_LOADED_META_DATA,() =>
        {
           this.getTemplate(this.player.songPlayer);
        });
    }

    private getTemplate(song: SongPlayer)
    {
        let templ = this.$context.find('template').first();

        templ.tmpl(song).appendTo('.playlist')
        console.log(templ.tmpl(song))

    }

    // fixme вместо этого свойства создай методы open close и свойство isOpen и имя класса переименуй в open
    private set is_active(active: boolean)
    {
        active ? this.$context.addClass('active') : this.$context.removeClass('active');
    }

    private get is_active()
    {
        return this.$context.hasClass('active');
    }

    public static create($context = $('.b_player_playlist')): Playlist
    {
        return new Playlist($context);
    }
}