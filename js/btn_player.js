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
            // fixme весь этот блок касающийся получения плейлист айди должен быть в гетере плейлист айди
            this.$playlist = this.$context.parents('.inline_player_playlist_main');
            if (!this.playlist_id) {
                let playlist_id = '';
                // fixme мы не работаем с dom мы работаем с свойствами объектов, правильно методом create создать все
                //  объекты btn player в плейлисте и обращаться к его свойствам,
                this.$playlist.find('[data-song_name]').each((index, player) => {
                    let btn_player = $(player);
                    playlist_id = playlist_id + btn_player.data('song_name');
                });
                this.playlist_id = playlist_id;
            }
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
    set playlist_id(playlist_id) {
        this.$playlist.data('playlist_id', playlist_id);
    }
    // fixme соблюдай нотацию
    get playlist_id() {
        return this.$playlist.data('playlist_id');
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
        this.player.playlist_id = this.playlist_id;
        if (this.player.songId !== this.songId) {
            if (this.url) {
                this.player.loadSong(this.songPlayer);
            }
        }
        this.player.play();
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
    // fixme не правильно здесь определен $context, $context это контекст в котором мы хотим найти все btn player и создать их например body или плейлист
    static create($context = $('.btn_player')) {
        // @ts-ignore
        return $context.map((index, element) => {
            return new BtnPlayer($(element));
        });
    }
}
