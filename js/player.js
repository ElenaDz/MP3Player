class Player {
    constructor($context) {
        this._hq = false;
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Player)
            return this.$context[0].Player;
        // @ts-ignore
        this.$context[0].Player = this;
        this.audio = this.$context.find('audio')[0];
        this.initCreate();
        this.initEventsAudio();
        this.initAlert();
        this.initMediaSession();
        this.initHistory();
    }
    initMediaSession() {
        this.$context.on(Player.EVENT_LOADED_SONG_PLAYER, () => {
            let { protocol, hostname } = window.location;
            let urlImgSong = this.getBaseDomain() || `${protocol}//${hostname}`;
            urlImgSong = urlImgSong + this.songPlayer.urlSongImg;
            if ("mediaSession" in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: this.songPlayer.songName.trim(),
                    artist: this.songPlayer.artistName.trim(),
                    artwork: [{ src: urlImgSong }],
                });
            }
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
            this.next();
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
            this.previous();
        });
    }
    getBaseDomain() {
        let { protocol, hostname } = window.location;
        // localhost или IP
        if (hostname === "localhost" ||
            /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
            return "";
        }
        let parts = hostname.split(".");
        // нет поддоменов (example.com)
        if (parts.length <= 2) {
            return "";
        }
        let subdomain = parts.slice(0, -2).join(".");
        let hasNumberInSubdomain = /\d/.test(subdomain);
        // поддомен есть, но без цифр → пусто
        if (!hasNumberInSubdomain) {
            return "";
        }
        // поддомен есть и содержит цифры → базовый домен
        let baseDomain = parts.slice(-2).join(".");
        return `${protocol}//${baseDomain}`;
    }
    initCreate() {
        PlayerControls.create();
        PlayerProgress.create();
        PlayerVolume.create();
        PlayerInfo.create();
        PlayerPlaylist.create();
        // PlayerHQ.create();
        PlayerEQ.create();
    }
    initAlert() {
        this.$context.on(Player.EVENT_ERROR, () => {
            clearTimeout(this.timeout_alert_id);
            setTimeout(() => {
                if (!this.playing) {
                    this.alert('Ошибка', 'Трек не доступен или ссылка устарела. Пожалуйста, обновите страницу.');
                }
            }, 1 * 1000);
            this.$context.find('.alert').on('click', (alert) => {
                this.alert_close();
            });
        });
        this.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.alert_close();
        });
    }
    alert_close() {
        this.$context.find('.alert').removeClass('show');
    }
    initEventsAudio() {
        this.audio.addEventListener('play', () => {
            this.playing = !this.audio.paused;
        });
        this.audio.addEventListener('pause', () => {
            this.playing = !this.audio.paused;
        });
        this.audio.addEventListener('loadedmetadata', () => {
            this.playing = true;
            this.$context.trigger(Player.EVENT_LOADED_META_DATA);
        });
        this.audio.addEventListener('timeupdate', () => {
            this.$context.trigger(Player.EVENT_UPDATE_TIME);
        });
        this.audio.addEventListener('volumechange', () => {
            this.$context.trigger(Player.EVENT_UPDATE_VOLUME);
        });
        this.audio.addEventListener('ended', () => {
            this.$context.trigger(Player.EVENT_ENDED);
        });
        this.audio.addEventListener('error', () => {
            this.$context.trigger(Player.EVENT_ERROR);
        });
    }
    initHistory() {
        this.$context.on(Player.EVENT_LOADED_SONG_PLAYER, () => {
            if (!LK.is_authorized())
                return;
            let song_id = this.songPlayer.songId;
            $.ajax({
                url: 'http://authorization/Auth/?action=Auth%5CApp%5CAction%5CApi%5CHistoryAdd',
                type: 'POST',
                data: { song_id: song_id },
            });
        });
    }
    getAudio() {
        return this.audio;
    }
    set hq(hq) {
        if (this._hq == hq)
            return;
        this._hq = hq;
        let time = this.currentTime;
        this.loadSongPlayer(this.songPlayer, this.playlist);
        this.currentTime = time;
    }
    get hq() {
        return this._hq;
    }
    set repeat_playlist(repeat_playlist) {
        this._repeat_playlist = repeat_playlist;
        this.$context.trigger(Player.EVENT_UPDATE_REPEAT_PLAYLIST);
    }
    get repeat_playlist() {
        return this._repeat_playlist;
    }
    hasNextSong() {
        return !!this.getNextSong();
    }
    hasPreviousSong() {
        return !!this.getPreviousSong();
    }
    next() {
        this.loadSongPlayer(this.getNextSong(), this.playlist);
    }
    previous() {
        this.loadSongPlayer(this.getPreviousSong(), this.playlist);
    }
    getNextSong() {
        let target_index = (this.repeat_playlist && (this.getIndexSongCurrent() == this.getIndexSongLast()))
            ? 0
            : this.getIndexSongCurrent() + 1;
        return this.playlist.songsPlayer[target_index];
    }
    getPreviousSong() {
        let target_index = (this.repeat_playlist && (this.getIndexSongCurrent() == 0))
            ? this.getIndexSongLast() :
            this.getIndexSongCurrent() - 1;
        return this.playlist.songsPlayer[target_index];
    }
    getIndexSongCurrent() {
        let index_active_song;
        this.playlist.songsPlayer.map((song_player, index) => {
            if (song_player.songId == this.songId) {
                index_active_song = index;
                return;
            }
        });
        return index_active_song;
    }
    getIndexSongLast() {
        return this.playlist.songsPlayer.length - 1;
    }
    get songId() {
        return this.songPlayer ? this.songPlayer.songId : null;
    }
    get url() {
        return this.audio.src;
    }
    set url(url) {
        this.audio.src = url;
    }
    loadSongPlayer(songPlayer, playlist) {
        this._playlist = playlist;
        if (this.songId == songPlayer.songId) {
            return;
        }
        else {
            this.url = this.hq ? songPlayer.url_hq : songPlayer.url;
            this.play();
        }
        this._songPlayer = songPlayer;
        this.$context.trigger(Player.EVENT_LOADED_SONG_PLAYER);
    }
    get songPlayer() {
        return this._songPlayer;
    }
    get playlist() {
        return this._playlist;
    }
    play() {
        this.audio.play()
            .then(() => { })
            .catch(error => { });
    }
    pause() {
        this.audio.pause();
    }
    set currentTime(current_time) {
        this.audio.currentTime = current_time;
    }
    get currentTime() {
        return this.audio.currentTime;
    }
    get duration() {
        return this.audio.duration;
    }
    get volume() {
        return this.audio.volume;
    }
    set volume(volume) {
        this.audio.volume = Number(volume.toFixed(2));
    }
    set mute(mute) {
        this.audio.muted = mute;
    }
    get mute() {
        return this.audio.muted;
    }
    set playing(playing) {
        playing
            ? this.$context.addClass('playing')
            : this.$context.removeClass('playing');
        this.$context.trigger(Player.EVENT_UPDATE_PLAYING);
    }
    get playing() {
        return !this.audio.paused;
    }
    alert(title, msg) {
        let alert = $(`
            <div class="alert b_popup">
                <h3 class="title"></h3>
                <span class="msg"></span>
            </div>
        `);
        if (this.$context.find('.alert').length == 0) {
            this.$context.append(alert);
        }
        let $alert = this.$context.find('.alert');
        $alert.addClass('show');
        $alert.find('.title').text(title);
        $alert.find('.msg').text(msg);
        let timeout_id = setTimeout(() => {
            $alert.removeClass('show');
        }, 6 * 1000);
        this.timeout_alert_id = +timeout_id;
    }
    static create($context = $('.b_player')) {
        return new Player($context);
    }
}
Player.EVENT_UPDATE_PLAYING = 'Player.EVENT_UPDATE_PLAYING';
Player.EVENT_UPDATE_REPEAT_PLAYLIST = 'Player.EVENT_UPDATE_REPEAT_PLAYLIST';
Player.EVENT_UPDATE_TIME = 'Player.EVENT_UPDATE_TIME';
Player.EVENT_UPDATE_VOLUME = 'Player.EVENT_UPDATE_VOLUME';
Player.EVENT_UPDATE_HQ = 'Player.EVENT_UPDATE_HQ';
Player.EVENT_LOADED_META_DATA = 'Player.EVENT_LOADED_META_DATA';
Player.EVENT_LOADED_SONG_PLAYER = 'Player.EVENT_LOADED_SONG_PLAYER';
Player.EVENT_ERROR = 'Player.EVENT_ERROR';
Player.EVENT_ENDED = 'Player.EVENT_ENDED';
