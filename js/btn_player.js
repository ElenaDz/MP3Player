class BtnPlayer {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].BtnPlayer)
            return this.$context[0].BtnPlayer;
        // @ts-ignore
        this.$context[0].BtnPlayer = this;
        this.player = Player.create();
        if (this.player.songPlayer
            && this.player.playing
            && this.player.songPlayer.songId === this.songId) {
            this.playing = true;
        }
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
        return parseInt(this.$context.find('button').data('song-id'));
    }
    // @ts-ignore
    get url() {
        return this.$context.find('button').data('url');
    }
    get url_hq() {
        return this.$context.find('button').data('url_hq');
    }
    get clicks() {
        return parseInt(this.$context.parents('.music-popular__item').find('.popular-download-number').text()) || 0;
    }
    get url_song_img() {
        return this.$context.find('button').data('url_song_img') || '/templates/drivemusic/img/note.svg';
    }
    get songName() {
        return this.$context.parents().first().find('.popular-play-author').text()
            || this.$context.parents().first().find('.music-name-text').text();
    }
    //  страница песни
    get urlSongPage() {
        return this.$context.parents().first().find('.popular-play-author').attr('href')
            || this.$context.parents().first().find('.music-name-text').attr('href');
    }
    get artistHtml() {
        return this.$context.parents().first().find('.popular-play-composition').html() || '';
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
        btns_player.forEach((btn_player) => {
            songs_player.push(btn_player.songPlayer);
        });
        let title = this.$context
            .parents('.inline_player_playlist_main')
            .parent()
            .find('h2')
            .text();
        return new Playlist(songs_player, title);
    }
    get songPlayer() {
        return {
            songId: this.songId,
            url: this.url,
            url_hq: this.url_hq,
            artistHtml: this.artistHtml,
            songName: this.songName,
            urlSongPage: this.urlSongPage,
            clicks: this.clicks,
            urlSongImg: this.url_song_img
        };
    }
    pause() {
        this.player.pause();
    }
    set playing(playing) {
        playing
            ? this.$context.addClass('playing')
            : this.$context.removeClass('playing');
        playing
            ? this.$context.addClass('pause')
            : this.$context.removeClass('pause');
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
