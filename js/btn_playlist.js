class BtnPlaylist {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].BtnPlaylist)
            return this.$context[0].BtnPlaylist;
        // @ts-ignore
        this.$context[0].BtnPlaylist = this;
        this.player = Player.create();
        this.$context.on('click', () => {
        });
    }
    static create($context) {
        $context.find('.song-author-btn.btn-play, .c-button.js-btn-play-playlist').each((index, element) => {
            return new BtnPlaylist($(element));
        });
    }
}
