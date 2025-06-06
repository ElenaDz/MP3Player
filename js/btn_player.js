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
        let filename = this.url ? this.url.split('/').reverse()[0] : null;
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
        this.load();
        this.player.play();
    }
    load() {
        if (this.player.songId !== this.songId) {
            if (this.url) {
                this.player.loadSongPlayer(this.songPlayer, this.getPlaylist());
            }
        }
    }
    getPlaylist() {
        let btns_player = BtnPlayer.create($(this.$context.parents('.inline_player_playlist_main')));
        let playlist = [];
        btns_player.forEach((btn_player) => {
            playlist.push(btn_player.songPlayer);
        });
        return playlist;
    }
    get songPlayer() {
        return {
            url: this.url,
            artistHtml: this.artistHtml,
            songName: this.songName,
            urlSong: this.urlSong
        };
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
    // fixme не правильно здесь определен $context, $context это контекст в котором мы хотим найти все btn player и создать их например body или плейлист(ok?)
    // @ts-ignore
    static create($context = $('.inline_player_playlist_main')) {
        let $playlists = $context;
        let btns_player = [];
        $playlists.find('.btn_player').each((index, element) => {
            btns_player.push(new BtnPlayer($(element)));
        });
        return btns_player;
    }
}
