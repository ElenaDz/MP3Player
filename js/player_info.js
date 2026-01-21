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
        this.player.$context.on(Player.EVENT_ERROR + " || " + Player.EVENT_LOADED_SONG_PLAYER, () => {
            this.load();
            this.initComment();
        });
        this.initDots();
        this.initFavorite();
        this.initEq();
        this.initHq();
        this.eq.$context.on(PlayerEQ.EVENT_CLOSE, () => {
            this.$context.find('.eq').removeClass('show');
        });
        $('body').on('click', (e) => {
            if (!$(e.target).hasClass('b_popup')
                && !$(e.target).hasClass('dots')
                && !$(e.target).parents().hasClass('b_popup')) {
                this.closeDots();
            }
        });
        this.initCopy();
    }
    initCopy() {
        this.$context.find('.copy').on('click', () => {
            let hostname = window.location.hostname;
            let url_song_page = hostname + '/' + this.player.songPlayer.urlSongPage;
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(url_song_page);
            }
            this.closeDots();
            this.$context.find('.is_copy').addClass('active');
            setTimeout(() => {
                this.removeActiveForCopy();
            }, 2 * 1000);
            setTimeout(() => {
                $('html').on('click', (e) => {
                    if (!$(e.target).hasClass('copy')) {
                        this.removeActiveForCopy();
                        $('html').off('click');
                    }
                });
            }, 0);
        });
    }
    removeActiveForCopy() {
        this.$context.find('.is_copy').removeClass('active');
    }
    initComment() {
        let url = this.player.songPlayer.urlSongPage + '#uname';
        this.$context.find('.wrap_comment').attr('href', url);
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
        this.renderPopup();
        this.$context.find('button.dots').on('click', () => {
            this.isOpenDots ? this.closeDots() : this.openDots();
        });
    }
    renderPopup() {
        this.$context.find('.inner_dots').append(this.addHtmlPopup);
    }
    addHtmlPopup() {
        return `<div class="b_popup">
                <div class="eq">
                    <i></i>
                    <span>Эквалайзер</span>
                </div>
                <div class="copy">
                    <i></i>
                    <span>
                        Скопировать ссылку
                    </span>
                </div>
                <a class="wrap_comment" href="">
                    <div class="comment">
                        <i></i>
                        <span>
                            Оставить отзыв
                        </span>
                    </div>
                </a>

            </div>
            <div class="b_popup is_copy">
                <span> Ссылка скопирована</span>
            </div>
        `;
    }
    initFavorite() {
        this.$context.find('button.favorite').on('click', () => {
            this.is_favorite = this.is_favorite;
        });
    }
    load() {
        let songPlayer = this.player.songPlayer;
        songPlayer.artistHtml
            ? this.$context.find('.wrap_author').html(songPlayer.artistHtml)
            : this.$context.find('.wrap_author').text(this.player.playlist.title);
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
    setSongName(song_name) {
        this.$context.find('.inner_song').text(song_name);
    }
    setArtistHtml(artist_html) {
        artist_html
            ? this.$context.find('.wrap_author').html(artist_html)
            : this.$context.find('.wrap_author').text('Название плейлиста');
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
