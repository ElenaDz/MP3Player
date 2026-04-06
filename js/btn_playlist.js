class BtnPlaylist {
    constructor($context) {
        this.$context = $context;
        this.player = Player.create();
        this.updatePause();
        // @ts-ignore
        if (this.$context[0].BtnPlaylist)
            return this.$context[0].BtnPlaylist;
        // @ts-ignore
        this.$context[0].BtnPlaylist = this;
        let song_on = $('body').find(`.inline_player_playlist_main .btn_player[data-song-id="${this.player.songId}"]`);
        if (song_on) {
            this.$context.data('song-id', this.player.songId);
        }
        this.player.$context.on(Player.EVENT_UPDATE_PLAYING + ' ' + Player.EVENT_LOADED_SONG_PLAYER, () => {
            this.$context.data('song-id', this.player.songId);
            this.updatePause();
        });
        this.initClick();
    }
    updatePause() {
        this.player.playing
            ? this.$context.addClass('pause')
            : this.$context.removeClass('pause');
    }
    initClick() {
        this.$context.on('click', () => {
            if (this.player.playing) {
                this.player.pause();
                return;
            }
            if (this.$context.data('song-id')) {
                this.player.playing ? this.player.pause() : this.player.play();
            }
            else {
                let first_song = $('body').find('.inline_player_playlist_main .popular-play__item').first();
                first_song.trigger('click');
            }
        });
    }
    static create($context) {
        $context.find('.c-button.js-btn-play-playlist').each((index, element) => {
            return new BtnPlaylist($(element));
        });
    }
}
