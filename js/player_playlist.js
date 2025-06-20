class PlayerPlaylist {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Playlist)
            return this.$context[0].Playlist;
        // @ts-ignore
        this.$context[0].Playlist = this;
        this.disabled();
        this.player = Player.create();
        this.$context.find('button.close').on('click', () => {
            this.close();
        });
        this.$context.find('button.playlist_btn').on('click', () => {
            this.isOpen ? this.close() : this.open();
        });
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.loadPlaylist(this.player.playlist);
            let btns = BtnPlayer.create(this.$context.find('.playlist'));
        });
        this.player.$context.on(Player.EVENT_ERROR, () => {
            this.disabled();
        });
    }
    disabled() {
        this.$context.addClass('disabled');
    }
    loadPlaylist(playlist) {
        if (playlist.id === this.playlist_id)
            return;
        this.$context.removeClass('disabled');
        this.$context.find('.playlist').empty();
        this._playlist_id = playlist.id;
        playlist.songsPlayer.forEach((song_player) => {
            this.$context.find('.playlist')
                .append(this.getHtml(song_player));
        });
        this.$context.find('.music_title')
            .text(playlist.title);
    }
    get playlist_id() {
        return this._playlist_id;
    }
    getHtml(song) {
        return `
            <li class="item">
                <div class="popular-play">
                    <div
                        class="btn_player"
                        data-song_id=" ${song.songId}"
                        data-song_name=" ${song.songName}"
                        data-artist_html="${song.artistHtml}"
                        data-url_song="${song.urlSong}"
                        data-url="${song.url}"
                        data-clicks="${song.clicks}"
                    >    
                        <button class="play"></button>
                    </div>

                    <div class="song_title">
                        <div class="wrap_song">
                            <a href="#" class="inner_song">
                                ${song.songName}
                            </a>
                        </div>
                        <div class="wrap_author">
                            <a href="#">
                                ${song.artistHtml}
                            </a>
                        </div>
                    </div>
                </div>

                <div class="wrap_right">
                    <div class="count_clicks">
                        <i></i>
                        <span>${song.clicks}</span>
                    </div>

                    <div class="download elem">
                        <a class="download_song" href="${song.urlSong}">
                            <i></i>
                        </a>
                    </div>
                </div>
            </li>
        `;
    }
    open() {
        this.$context.addClass('open');
    }
    close() {
        this.$context.removeClass('open');
    }
    get isOpen() {
        return this.$context.hasClass('open');
    }
    static create($context = $('.b_player_playlist')) {
        return new PlayerPlaylist($context);
    }
}
