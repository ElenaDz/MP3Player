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
            this.is_open ? this.close() : this.open();
        });
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            $('.inline_player_playlist_main').each((i, playlist) => {
                let inline_playlist = $(playlist);
                if (inline_playlist.data('playlist_id') == this.player.playlist_id) {
                    let btns_player = BtnPlayer.create(inline_playlist.find('.btn_player'));
                    // btns_player.forEach()
                }
            });
            this.$context.find('.playlist').prepend(this.getElement(this.player.songPlayer));
        });
    }
    getElement(song) {
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
    // fixme вместо этого свойства создай методы open close и свойство isOpen и имя класса переименуй в open ok
    get is_open() {
        return this.$context.hasClass('open');
    }
    static create($context = $('.b_player_playlist')) {
        return new Playlist($context);
    }
}
