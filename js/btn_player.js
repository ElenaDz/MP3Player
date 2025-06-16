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
        // let filename = this.url ? this.url.split('/').reverse()[0] : null;
        //
        // return filename;
        return +this.$context.data('song_id');
    }
    // @ts-ignore
    get url() {
        return this.$context.data('url');
    }
    get clicks() {
        return this.$context.data('clicks');
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
        if (this.player.songId !== this.songId || this.getPlaylist().id !== this.player.playlist.id) {
            if (this.url) {
                this.player.loadSongPlayer(this.songPlayer, this.getPlaylist());
            }
        }
    }
    getPlaylist() {
        let btns_player = BtnPlayer.create($(this.$context.parents('.inline_player_playlist_main')));
        let songs_player = [];
        let clicks_playlist = [];
        btns_player.forEach((btn_player) => {
            songs_player.push(btn_player.songPlayer);
            clicks_playlist.push({
                song_id: btn_player.songId,
                count: +btn_player.clicks
            });
        });
        let title = this.$context
            .parents('.inline_player_playlist_main')
            .parent()
            .find('h2')
            .text();
        // fixme добавить недостающие clicks
        return new Playlist(songs_player, title, clicks_playlist);
    }
    get songPlayer() {
        return {
            song_id: this.songId,
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
    static create($context) {
        let btns_player = [];
        $context.find('.btn_player').each((index, element) => {
            btns_player.push(new BtnPlayer($(element)));
        });
        return btns_player;
    }
}
