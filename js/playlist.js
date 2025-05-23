class Playlist {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Playlist)
            return this.$context[0].Playlist;
        // @ts-ignore
        this.$context[0].Playlist = this;
        this.player = Player.create();
        this.$context.find('button.close').on('click', () => {
            this.is_active = false;
        });
        this.$context.find('button.playlist_btn').on('click', () => {
            this.is_active = !this.is_active;
        });
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.getTemplate(this.player.songPlayer);
        });
    }
    getTemplate(song) {
        let templ = this.$context.find('template').first();
        templ.tmpl(song).appendTo('.playlist');
        console.log(templ.tmpl(song));
    }
    set is_active(active) {
        active ? this.$context.addClass('active') : this.$context.removeClass('active');
    }
    get is_active() {
        return this.$context.hasClass('active');
    }
    static create($context = $('.b_player_playlist')) {
        return new Playlist($context);
    }
}
