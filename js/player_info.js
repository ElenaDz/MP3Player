class PlayerInfo {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Info)
            return this.$context[0].Info;
        // @ts-ignore
        this.$context[0].Info = this;
        this.player = Player.create();
        this.disabled();
        this.player.$context.on(Player.EVENT_ERROR, () => {
            this.load();
        });
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.load();
        });
        this.$context.find('button.dots').on('click', () => {
            this.isOpenDots ? this.closeDots() : this.openDots();
        });
    }
    load() {
        let songPlayer = this.player.songPlayer;
        this.$context.find('.wrap_author').text(songPlayer.artistHtml);
        this.$context.find('.inner_song').text(songPlayer.songName);
        this.$context.find('.inner_song').attr('href', songPlayer.urlSong);
        this.$context.find('.download_song').attr('href', songPlayer.urlSong);
        if (navigator.mediaSession) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: songPlayer.songName,
                artist: songPlayer.artistHtml,
            });
        }
        this.disabled(false);
    }
    disabled(disabled = true) {
        if (disabled) {
            this.$context.addClass('disabled');
            this.$context.find('button').attr('disabled', 1);
        }
        else {
            this.$context.removeClass('disabled');
            this.$context.find('button').removeAttr('disabled');
        }
    }
    openDots() {
        this.$context.find('.inner_dots').addClass('open');
    }
    closeDots() {
        this.$context.find('.inner_dots').removeClass('open');
    }
    get isOpenDots() {
        return this.$context.find('.inner_dots').hasClass('open');
    }
    static create($context = $('.b_player_info')) {
        return new PlayerInfo($context);
    }
}
