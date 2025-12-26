class PlayerInfo {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Info)
            return this.$context[0].Info;
        // @ts-ignore
        this.$context[0].Info = this;
        this.player = Player.create();
        this.eq = PlayerEQ.create();
        this.disabled();
        this.player.$context.on(Player.EVENT_ERROR + " || " + Player.EVENT_LOADED_META_DATA, () => {
            this.load();
        });
        this.initDots();
        this.initFavorite();
        this.initEq();
        this.initHq();
        this.eq.$context.on(PlayerEQ.EVENT_CLOSE, () => {
            this.$context.find('.eq').removeClass('show');
        });
        $('html').on('click', (e) => {
            if (!$(e.target).hasClass('b_popup')
                && !$(e.target).hasClass('dots')
                && !$(e.target).parents().hasClass('b_popup')) {
                this.closeDots();
            }
        });
    }
    initHq() {
        this.$context.find('.hq').on('click', () => {
            this.player.$context.trigger(Player.EVENT_UPDATE_HQ);
        });
        this.player.$context.on(Player.EVENT_UPDATE_HQ, () => {
            let $hq = this.$context.find('.hq');
            this.player.hq ? $hq.addClass('active') : $hq.removeClass('active');
        });
    }
    initEq() {
        this.$context.find('.eq').on('click', () => {
            let $eq = this.$context.find('.eq');
            this.eq.isShow ? this.eq.close() : this.eq.show();
            this.eq.isShow ? $eq.addClass('show') : $eq.removeClass('show');
        });
    }
    initDots() {
        this.$context.find('button.dots').on('click', () => {
            this.isOpenDots ? this.closeDots() : this.openDots();
        });
    }
    initFavorite() {
        this.$context.find('button.favorite').on('click', () => {
            this.is_favorite = this.is_favorite;
        });
    }
    load() {
        let songPlayer = this.player.songPlayer;
        this.$context.find('.wrap_author').html(songPlayer.artistHtml);
        this.$context.find('.inner_song').text(songPlayer.songName);
        this.$context.find('.inner_song').attr('href', songPlayer.urlSongPage);
        this.$context.find('.download_song').attr('href', songPlayer.urlSongPage);
        this.$context.find('.artist_img img').attr('src', songPlayer.urlSongImg);
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
    set is_favorite(is_favorite) {
        is_favorite
            ? this.$context.find('.inner_favorite').removeClass('is_favorite')
            : this.$context.find('.inner_favorite').addClass('is_favorite');
        is_favorite
            ? this.$context.find('.inner_favorite .text').text('')
            : this.$context.find('.inner_favorite .text').append('Трек добавлен в <a href="">Мои лайки</a>');
    }
    get is_favorite() {
        return this.$context.find('.inner_favorite').hasClass('is_favorite');
    }
    static create($context = $('.b_player_info')) {
        return new PlayerInfo($context);
    }
}
