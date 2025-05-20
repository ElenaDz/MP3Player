class BtnPlayer {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].BtnPlayer)
            return this.$context[0].BtnPlayer;
        // @ts-ignore
        this.$context[0].BtnPlayer = this;
        this.player = Player.create();
        this.$context.on('click', () => {
            this.playing ? this.pause() : this.play();
        });
        this.player.$context.on(Player.EVENT_UPDATE_PLAYING, () => {
            if (this.player.songId === this.songId) {
                this.playing = this.player.playing;
            }
            else {
                this.playing = false;
            }
        });
    }
    get songId() {
        let filename = this.url.split('/').reverse()[0];
        return filename;
    }
    // @ts-ignore
    get url() {
        return this.$context.data('url');
    }
    get songName() {
        return this.$context.data('song_name');
    }
    get urlSong() {
        return this.$context.data('url_song');
    }
    get artistHtml() {
        return this.$context.data('artist_html');
    }
    play() {
        if (this.player.songId !== this.songId) {
            if (this.url) {
                this.player.loadSong({
                    url: this.url,
                    artist_html: this.artistHtml,
                    song_name: this.songName,
                    url_song: this.urlSong
                });
            }
        }
        this.player.play();
    }
    pause() {
        this.player.pause();
    }
    set playing(playing) {
        playing
            ? this.$context.addClass('playing')
            : this.$context.removeClass('playing');
    }
    get playing() {
        return this.$context.hasClass('playing');
    }
    static create($context = $('.btn_player')) {
        // @ts-ignore
        return $context.map((index, element) => {
            return new BtnPlayer($(element));
        });
    }
}
