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
        this.player.$context.on(Player.EVENT_ERROR, () => {
            // this.disabled();
        });
        $('html').on('click', (e) => {
            if (!$(e.target).hasClass('b_popup')
                && !$(e.target).hasClass('playlist_btn')
                && !$(e.target).hasClass('shuffle')
                && !$(e.target).hasClass('repeat_playlist')
                && !$(e.target).parents().hasClass('b_popup')) {
                this.close();
                this.$context.find('.inner_dots').removeClass('open');
            }
        });
        this.player.$context.on(Player.EVENT_UPDATE_REPEAT_PLAYLIST, () => {
            this.setActiveRepeat();
        });
        this.player.$context.on(Player.EVENT_ENDED, () => {
            this.player.next();
            this.player.play();
        });
        this.player.$context.on(Player.EVENT_ERROR, () => {
            this.player.pause();
        });
        this.$context.on(PlayerPlaylist.EVENT_UPDATE_PLAYLIST, () => {
            this.loadPlaylist(this.player.playlist);
        });
        this.initPlaylist();
        this.initRepeat();
        this.initShuffle();
    }
    initPlaylist() {
        this.$context.find('button.close').on('click', () => {
            this.close();
        });
        this.$context.find('button.playlist_btn').on('click', () => {
            this.isOpen ? this.close() : this.open();
        });
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.loadPlaylist(this.player.playlist);
            this.$context.find('.playing')[0].scrollIntoView({
                block: "center",
                behavior: "smooth"
            });
        });
    }
    initRepeat() {
        this.$context.find('button.repeat_playlist').on('click', () => {
            this.player.repeat_playlist = !this.player.repeat_playlist;
        });
    }
    initShuffle() {
        this.$context.find('button.shuffle').on('click', () => {
            this.shufflePlaylist();
        });
    }
    shufflePlaylist() {
        this.open();
        let playlist_id = this.player.playlist.id;
        let playlist_new = PlayerPlaylist.shufflePlaylist(this.player.playlist, this.player.getIndexSongCurrent());
        if (playlist_id === playlist_new.id
            && playlist_new.songsPlayer.length > 2) {
            this.shufflePlaylist();
        }
        this.player.loadSongPlayer(this.player.songPlayer, playlist_new);
        this.$context.trigger(PlayerPlaylist.EVENT_UPDATE_PLAYLIST);
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
        this.$context.removeClass('disabled');
        if (playlist.id === this.playlist_id)
            return;
        this.$context.find('.playlist').empty();
        this._playlist_id = playlist.id;
        this.$context.find('.playlist').append(this.render(playlist));
        this.$context.find('.music_title').text(playlist.title);
        BtnPlayer.create(this.$context.find('.playlist'));
    }
    get playlist_id() {
        return this._playlist_id;
    }
    render(playlist) {
        let html_playlist;
        playlist.songsPlayer.forEach((song_player) => {
            html_playlist = !html_playlist ? this.getHtml(song_player) : html_playlist + (this.getHtml(song_player));
        });
        html_playlist = html_playlist + '<div style="height: 80px"> </div>';
        return html_playlist;
    }
    getHtml(song) {
        return `
            <li class="item">
                <div class="popular-play">
                    <div class="btn_player">    
                        <button class="play popular-play__item"
                        data-song-id=" ${song.songId}"
                        data-url="${song.url}"
                        data-url_hq="${song.url_hq}"
                        >
                            <span class="icon-music-player-play icon-js"></span>
                        </button>
                        
                    </div>

                    <div class="song_title">
                        <div class="wrap_song popular-play-author" >
                            <a href="${song.urlSongPage}" class="inner_song">
                                ${song.songName}
                            </a>
                        </div>
                        <div class="wrap_author popular-play-composition">
                            ${song.artistHtml}
                        </div>
                    </div>
                </div>

                <div class="wrap_right">
                    <div class="song_time">
                        <span>${song.songTime}</span>
                    </div>

                    <div class="download elem">
                        <a class="download_song" href="${song.urlSongPage}">
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
    static shufflePlaylist(playlist, index_active) {
        let playlist_copy = new Playlist(playlist.songsPlayer.map((song_player) => {
            return Object.assign({}, song_player);
        }), playlist.title);
        let activeElement = playlist_copy.songsPlayer[index_active];
        delete playlist_copy.songsPlayer[index_active];
        playlist_copy.songsPlayer = PlayerPlaylist.shuffleArray(playlist_copy.songsPlayer);
        playlist_copy.songsPlayer.unshift(activeElement);
        return playlist_copy;
    }
    static shuffleArray(array) {
        array = array.filter(element => element != null);
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }
    static create($context = $('.b_player_playlist')) {
        return new PlayerPlaylist($context);
    }
}
PlayerPlaylist.EVENT_UPDATE_PLAYLIST = 'PlayerPlaylist.EVENT_UPDATE_PLAYLIST';
