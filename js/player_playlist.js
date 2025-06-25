class PlayerPlaylist {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Playlist)
            return this.$context[0].Playlist;
        // @ts-ignore
        this.$context[0].Playlist = this;
        // todo так как у нас тут 3 отдельных кнопки не плохо было бы разбит конструктор на initRepeat, initPlaylist,
        //  initShuffle
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
        });
        this.player.$context.on(Player.EVENT_ERROR, () => {
            // fixme здесь блокируется на ошибке и не разблокируется когда запускается другая песня из того же плейлиста
            this.disabled();
        });
        this.$context.find('button.repeat_playlist').on('click', () => {
            this.player.repeat_playlist = !this.player.repeat_playlist;
            this.setActiveRepeat();
        });
        this.$context.find('button.shuffle').on('click', () => {
            this.shufflePlaylist();
            this.loadPlaylist(this.player.playlist);
        });
    }
    shufflePlaylist() {
        // fixme нужно добавить проверку что обновленный плейлист отличается от старого так как иногда при нажатии кнопки
        //  ни чего не происходит, из за того что старый плейлист не отличается от нового, так не должно быть
        this.player.playlist.songsPlayer = PlayerPlaylist.shuffleArray(this.player.playlist.songsPlayer, this.player.getIndexSong());
        this.player.loadSongPlayer(this.player.songPlayer, this.player.playlist);
    }
    setActiveRepeat() {
        this.player.repeat_playlist
            ? this.$context.find('button.repeat_playlist').addClass('active')
            : this.$context.find('button.repeat_playlist').removeClass('active');
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
        this.$context.find('.music_title').text(playlist.title);
        BtnPlayer.create(this.$context.find('.playlist'));
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
                            <!-- fixme на drivemusic ссылка при наведении меняет цвет, у тебя нет -->
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
                        <!-- todo это иконку можно взять на drivemusic она там сделана на css -->
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
    static shuffleArray(array, active_index) {
        let activeElement = array[active_index];
        delete array[active_index];
        array = array.filter(element => element != null);
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        array.unshift(activeElement);
        return array;
    }
    static create($context = $('.b_player_playlist')) {
        return new PlayerPlaylist($context);
    }
}
