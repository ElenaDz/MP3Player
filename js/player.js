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
        this.$context.on(Player.EVENT_ERROR, () => {
            // fixme перенеси этот код в метод alert, я его создал ниже ok
            this.alert('Ошибка', 'Трек не доступен или ссылка устарела. Пожалуйста, обновите сраницу.');
        });
        this.$context.find('.alert').on('click', (alert) => {
            $(alert.currentTarget).removeClass('show');
        });
        this.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            // можно ли в этом случае обращаться к dom элементу?
            this.$context.find('.alert').removeClass('show');
        });
    }
    initCreate() {
        PlayerControls.create();
        PlayerProgress.create();
        PlayerVolume.create();
        PlayerInfo.create();
        PlayerPlaylist.create();
        PlayerHQ.create();
        PlayerEQ.create();
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
    }
    get songPlayer() {
        return this._songPlayer;
    }
    get playlist() {
        return this._playlist;
    }
    play() {
        this.audio.play().then(() => {
        }).catch(error => {
            this.$context.trigger(Player.EVENT_ERROR);
        });
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
        this.$context.find('.alert').addClass('show');
        this.$context.find('.alert .title').text(title);
        this.$context.find('.alert .msg').text(msg);
        setTimeout(() => {
            this.$context.find('.alert').removeClass('show');
        }, 6000);
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
Player.EVENT_ERROR = 'Player.EVENT_ERROR';
Player.EVENT_ENDED = 'Player.EVENT_ENDED';
