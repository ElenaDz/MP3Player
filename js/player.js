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
    // https://www.google.com/search?q=%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%88%D0%B0%D1%82%D1%8C+%D0%BC%D0%B0%D1%81%D1%81%D0%B8%D0%B2+%D1%81%D1%82%D1%80%D0%BE%D0%BA+jquery&sca_esv=eee3cc9543ede721&sxsrf=AE3TifOXsQIy-ouBYZA-M4VXuTQWdnzhWw%3A1750415220958&ei=dDdVaIWdOsmn1fIPkbGvyQM&oq=%D0%BF%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%88%D0%B0%D1%82%D1%8C+%D0%BC%D0%B0%D1%81%D1%81%D0%B8%D0%B2+cnhjr&gs_lp=Egxnd3Mtd2l6LXNlcnAiJ9C_0LXRgNC10LzQtdGI0LDRgtGMINC80LDRgdGB0LjQsiBjbmhqcioCCAAyCRAhGKABGAoYKjIHECEYoAEYCjIHECEYoAEYCkj-MlDuHVi8KnABeAOQAQCYAVqgAYQDqgEBNrgBA8gBAPgBAZgCCaAClAPCAgQQABhHwgIFEAAYgATCAggQABiABBiiBMICBRAAGO8FmAMA4gMFEgExIECIBgGQBgiSBwE5oAfGHrIHATa4B40DwgcDNS40yAcK&sclient=gws-wiz-serp
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }
    shufflePlaylist() {
        this.shuffleArray(this.playlist.songsPlayer);
        this.loadSongPlayer(this.songPlayer, this.playlist);
    }
    set repeat_playlist(repeat_playlist) {
        this._repeat_playlist = repeat_playlist;
    }
    get repeat_playlist() {
        return this._repeat_playlist;
    }
    hesNextSong() {
        let has_next_song;
        this._playlist.songsPlayer.map((song_player, index) => {
            if (this.songId == song_player.songId) {
                has_next_song = index != this.getLastIndex();
            }
        });
        return this._repeat_playlist ? true : has_next_song;
    }
    hesPreviousSong() {
        let has_previous_song;
        this._playlist.songsPlayer.map((song_player, index) => {
            if (this.songId == song_player.songId) {
                has_previous_song = index != 0;
            }
        });
        return this._repeat_playlist ? true : has_previous_song;
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
            if (song_player.songId == this.songId) {
                index_active_song = index;
                return;
            }
        });
        return index_active_song;
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
