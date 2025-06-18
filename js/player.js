class Player {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Player)
            return this.$context[0].Player;
        // @ts-ignore
        this.$context[0].Player = this;
        this.audio = this.$context.find('audio')[0];
        this.initCreate();
        this.initEventsAudio();
    }
    initCreate() {
        PlayerControls.create();
        PlayerProgress.create();
        PlayerVolume.create();
        PlayerInfo.create();
        PlayerPlaylist.create();
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
    hesNextSong() {
        let has_next_song;
        this._playlist.songsPlayer.map((song_player, index) => {
            if (this.songId == song_player.song_id) {
                has_next_song = index != this.getLastIndex();
            }
        });
        return has_next_song;
    }
    hesPreviousSong() {
        let has_previous_song;
        this._playlist.songsPlayer.map((song_player, index) => {
            if (this.songId == song_player.song_id) {
                has_previous_song = index != 0;
            }
        });
        return has_previous_song;
    }
    getLastIndex() {
        return this._playlist.songsPlayer.length - 1;
    }
    next() {
        let target_index = this.getIndexSong() + 1;
        this.loadSongPlayer(this.getTargetSong(target_index), this._playlist);
    }
    previous() {
        let target_index = this.getIndexSong() - 1;
        this.loadSongPlayer(this.getTargetSong(target_index), this._playlist);
    }
    getTargetSong(target_index) {
        let target_song;
        this._playlist.songsPlayer.map((song_player, index) => {
            if (index == target_index) {
                target_song = song_player;
            }
        });
        return target_song;
    }
    getIndexSong() {
        let index_active_song;
        this._playlist.songsPlayer.map((song_player, index) => {
            if (song_player.song_id == this.songId) {
                index_active_song = index;
                return;
            }
        });
        return index_active_song;
    }
    get songId() {
        return this.songPlayer ? this.songPlayer.song_id : null;
    }
    get url() {
        return this.audio.src;
    }
    set url(url) {
        this.audio.src = url;
    }
    loadSongPlayer(songPlayer, playlist) {
        this._songPlayer = songPlayer;
        this._playlist = playlist;
        this.url = songPlayer.url;
    }
    get songPlayer() {
        return this._songPlayer;
    }
    get playlist() {
        return this._playlist;
    }
    // fixme удали, задаем плейлист в методе loadSongPlayer ok
    play() {
        this.audio.play();
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
        this.audio.volume = volume;
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
    static create($context = $('.b_player')) {
        return new Player($context);
    }
}
Player.EVENT_UPDATE_PLAYING = 'Player.EVENT_UPDATE_PLAYING';
Player.EVENT_UPDATE_TIME = 'Player.EVENT_UPDATE_TIME';
Player.EVENT_UPDATE_VOLUME = 'Player.EVENT_UPDATE_VOLUME';
Player.EVENT_LOADED_META_DATA = 'Player.EVENT_LOADED_META_DATA';
Player.EVENT_ERROR = 'Player.EVENT_ERROR';
Player.EVENT_ENDED = 'Player.EVENT_ENDED';
