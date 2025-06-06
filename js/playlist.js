class Playlist {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Playlist)
            return this.$context[0].Playlist;
        // @ts-ignore
        this.$context[0].Playlist = this;
        this.player = Player.create();
        this.$context.find('button.close').on('click', () => {
            this.close();
        });
        this.$context.find('button.playlist_btn').on('click', () => {
            this.isOpen ? this.close() : this.open();
        });
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.load();
        });
    }
    load() {
        this.$context.find('.playlist').empty();
        this.player.playlist.forEach((song_player) => {
            this.$context.find('.playlist').append(this.getHtml(song_player));
        });
    }
    getHtml(song) {
        return `
            <li class="item">
                <div class="popular-play">
                    <div class="btn_player">
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
                        <span>12345</span>
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
        return new Playlist($context);
    }
}
