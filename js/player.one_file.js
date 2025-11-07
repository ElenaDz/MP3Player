

var SliderEvents;
(function (SliderEvents) {
    SliderEvents["ValueUpdate"] = "SliderEventValueUpdate";
    SliderEvents["StopMove"] = "SliderEventStopMove";
    SliderEvents["StartMove"] = "SliderEventStartMove";
})(SliderEvents || (SliderEvents = {}));
class Slider {
    static create($context = $('body')) {
        let sliders = [];
        $(this.SELECTOR, $context).each((index, elem) => {
            sliders.push(new this($(elem)));
        });
        return sliders;
    }
    constructor($context) {
        this._start_move = false;
        this._offset_left = null;
        this._offset_top = null;
        this.$context = $context;
        if (this.$context.data('Slider'))
            return this.$context.data('Slider');
        this.$context.data('Slider', this);
        this.value = this.$context.data('value');
        this.$context.mousedown((e) => {
            if (e.which !== 1)
                return;
            this.start_move = true;
            this.value_pct = this.getValuePctFromEvent(e);
            $(window)
                .on('mousemove.slider', (e) => {
                if (!this.start_move)
                    return;
                this.value_pct = this.getValuePctFromEvent(e);
            });
            return this;
        });
        $(window)
            .on('mouseup', (e) => {
            if (e.which !== 1 || !this.start_move)
                return;
            this.start_move = false;
            $(window).off('mousemove.slider');
            return this;
        });
        this.$context.on(SliderEvents.StartMove, () => {
            $('body').css('user-select', 'none');
        });
        this.$context.on(SliderEvents.StopMove, () => {
            $('body').css('user-select', 'inherit');
        });
    }
    set vertical(vertical) {
        if (vertical) {
            this.$context.addClass('ver');
        }
        else {
            this.$context.removeClass('ver');
        }
    }
    get vertical() {
        return this.$context.hasClass('ver');
    }
    set disabled(disabled) {
        if (disabled) {
            this.$context.addClass('disabled');
        }
        else {
            this.$context.removeClass('disabled');
        }
    }
    get disabled() {
        return this.$context.hasClass('disabled');
    }
    get value_min() {
        return parseFloat(this.$context.data('value_min')) || 0;
    }
    set value_min(value_min) {
        if (this.value_min == value_min)
            return;
        this.$context.data('value_min', value_min);
        this.value = this._value;
    }
    get value_max() {
        return parseFloat(this.$context.data('value_max')) || 1;
    }
    set value_max(value_max) {
        if (this.value_max == value_max)
            return;
        this.$context.data('value_max', value_max);
        this.value = this._value;
    }
    get value() {
        return (this.value_max - this.value_min) * (this.value_pct / 100) + this.value_min;
    }
    set value(value) {
        if (this.start_move)
            return;
        if (value < this.value_min || value > this.value_max) {
            throw new RangeError();
        }
        let range = this.value_max - this.value_min;
        let value_rate = ((value - this.value_min) / range);
        this.value_pct = value_rate * 100;
    }
    get value_pct() {
        return (this.length_value / this.length_slider) * 100;
    }
    set value_pct(value_pct) {
        value_pct = value_pct < 0 ? 0 : value_pct;
        value_pct = value_pct > 100 ? 100 : value_pct;
        if (value_pct === this.value_pct && this._value === this.value)
            return;
        let $value = this.$context.find('.value');
        if (this.vertical) {
            $value.height(value_pct + '%');
        }
        else {
            $value.width(value_pct + '%');
        }
        this._value = this.value;
        this.$context.trigger(SliderEvents.ValueUpdate);
    }
    get start_move() {
        return this._start_move;
    }
    set start_move(value) {
        if (this.start_move === true && value === false) {
            this.$context.trigger(SliderEvents.StopMove);
        }
        if (this.start_move === false && value === true) {
            this.$context.trigger(SliderEvents.StartMove);
        }
        this._start_move = value;
    }
    get length_value() {
        let $value = this.$context.find('.value');
        return this.vertical ? $value.height() : $value.width();
    }
    get length_slider() {
        let $slider = this.$context.find('.slider');
        return this.vertical ? $slider.height() : $slider.width();
    }
    getValuePctFromEvent(e) {
        let offset = this.vertical
            ? e.pageY - this.$context.offset().top - this.offset_top
            : e.pageX - this.$context.offset().left - this.offset_left;
        return (offset / this.length_slider) * 100;
    }
    get offset_left() {
        if (this._offset_left === null) {
            this._offset_left = parseInt(getComputedStyle(this.$context.find('.slider')[0]).borderLeft) || 0;
        }
        return this._offset_left;
    }
    get offset_top() {
        if (this._offset_top === null) {
            this._offset_top = parseInt(getComputedStyle(this.$context.find('.slider')[0]).borderTop) || 0;
        }
        return this._offset_top;
    }
}
Slider.SELECTOR = '.b_slider';


class Playlist {
    constructor(songsPlayer = [], title = null) {
        this.songsPlayer = songsPlayer;
        this._title = title;
    }
    get id() {
        let id = '';
        this.songsPlayer.map((songPlayer) => {
            id = id + songPlayer.songName + "\n";
        });
        return id;
    }
    get songsPlayer() {
        return this._songsPlayer;
    }
    set songsPlayer(songsPlayer) {
        this._songsPlayer = songsPlayer;
    }
    get title() {
        return this._title;
    }
}


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
        // fixme не нужно выносить это в событие просто делай это в свойстве hd
        this.$context.on(Player.EVENT_UPDATE_HQ, () => {
            // поменять песню, но с той жу секунды, что и проигрывалось до
            let time = this.currentTime;
            this.loadSongPlayer(this.songPlayer, this.playlist);
            this.currentTime = time;
        });
    }
    initCreate() {
        PlayerControls.create();
        PlayerProgress.create();
        PlayerVolume.create();
        PlayerInfo.create();
        PlayerPlaylist.create();
        PlayerHQ.create();
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
    set hq(hq) {
        this._hq = hq;
        this.$context.trigger(Player.EVENT_UPDATE_HQ);
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
        this.url = this.hq ? songPlayer.url_hq : songPlayer.url;
        this.play();
        this._songPlayer = songPlayer;
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


class BtnPlayer {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].BtnPlayer)
            return this.$context[0].BtnPlayer;
        // @ts-ignore
        this.$context[0].BtnPlayer = this;
        this.player = Player.create();
        if (this.player.songPlayer
            && this.player.playing
            && this.player.songPlayer.songId === this.songId) {
            this.playing = true;
        }
        this.$context.on('click', () => {
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
    get songId() {
        return parseInt(this.$context.data('song_id'));
    }
    // @ts-ignore
    get url() {
        return this.$context.data('url');
    }
    get url_hq() {
        return this.$context.data('url_hq');
    }
    get clicks() {
        return parseInt(this.$context.data('clicks'));
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
        this.load();
        this.player.play();
    }
    load() {
        if (this.player.songId !== this.songId || this.getPlaylist().id !== this.player.playlist.id) {
            if (this.url) {
                this.player.loadSongPlayer(this.songPlayer, this.getPlaylist());
            }
        }
    }
    getPlaylist() {
        let btns_player = BtnPlayer.create($(this.$context.parents('.inline_player_playlist_main')));
        let songs_player = [];
        btns_player.forEach((btn_player) => {
            songs_player.push(btn_player.songPlayer);
        });
        let title = this.$context
            .parents('.inline_player_playlist_main')
            .parent()
            .find('h2')
            .text();
        return new Playlist(songs_player, title);
    }
    get songPlayer() {
        return {
            songId: this.songId,
            url: this.url,
            url_hq: this.url_hq,
            artistHtml: this.artistHtml,
            songName: this.songName,
            urlSong: this.urlSong,
            clicks: this.clicks
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
    static create($context) {
        let btns_player = [];
        $context.find('.btn_player').each((index, element) => {
            btns_player.push(new BtnPlayer($(element)));
        });
        return btns_player;
    }
}


class PlayerControls {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Controls)
            return this.$context[0].Controls;
        // @ts-ignore
        this.$context[0].Controls = this;
        this.player = Player.create();
        this.disabled();
        this.player.$context.on(Player.EVENT_LOADED_META_DATA + ' ' + Player.EVENT_UPDATE_REPEAT_PLAYLIST + ' ' + PlayerPlaylist.EVENT_UPDATE_PLAYLIST, () => {
            this.updateDisabled();
        });
        this.player.$context.on(Player.EVENT_ERROR, () => {
            this.disabled();
        });
        this.initPlay();
        this.initNext();
        this.initPrev();
    }
    initPlay() {
        this.$context.find('button.play').on('click', () => {
            if (!this.player.url) {
                throw new Error('Не задан url');
            }
            this.player.playing ? this.player.pause() : this.player.play();
        });
    }
    initNext() {
        this.$context.find('button.next').on('click', () => {
            this.player.next();
            this.player.play();
        });
    }
    initPrev() {
        this.$context.find('button.prev').on('click', () => {
            this.player.previous();
            this.player.play();
        });
    }
    disabled() {
        this.$context.find('button.play').attr('disabled', 1);
        this.$context.find('button.prev').attr('disabled', 1);
        this.$context.find('button.next').attr('disabled', 1);
    }
    updateDisabled() {
        this.disabled();
        this.$context.find('button.play').removeAttr('disabled');
        if (this.player.hasNextSong()) {
            this.$context.find('button.next').removeAttr('disabled');
        }
        if (this.player.hasPreviousSong()) {
            this.$context.find('button.prev').removeAttr('disabled');
        }
    }
    static create($context = $('.b_player_controls')) {
        return new PlayerControls($context);
    }
}


class PlayerProgress {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Progress)
            return this.$context[0].Progress;
        // @ts-ignore
        this.$context[0].Progress = this;
        this.player = Player.create();
        this.slider = Slider.create(this.$context)[0];
        this.disabled();
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.$context.find('.b_slider').removeClass('disabled');
            this.slider.value_max = this.player.duration;
            this.currentTimeText = this.player.currentTime;
            this.durationText = this.player.duration;
        });
        this.player.$context.on(Player.EVENT_UPDATE_TIME, () => {
            this.currentTimeText = this.player.currentTime;
            this.slider.value = this.player.currentTime;
        });
        this.slider.$context.on(SliderEvents.StopMove, () => {
            this.player.currentTime = this.slider.value;
        });
        this.player.$context.on(Player.EVENT_ERROR, () => {
            this.disabled();
        });
    }
    disabled() {
        this.$context.find('.b_slider').addClass('disabled');
    }
    set currentTimeText(current_time) {
        this.$context.find('.time_current').text(PlayerProgress.formatTime(current_time));
    }
    set durationText(duration) {
        this.$context.find('.time_duration').text(PlayerProgress.formatTime(duration));
    }
    static formatTime(sec = 0) {
        let min = (Math.floor(Math.trunc(sec / 60))).toString();
        if (+min < 10) {
            min = '0' + min;
        }
        sec = Math.floor(sec % 60);
        if (sec < 10) {
            return min + ':0' + sec;
        }
        else {
            return min + ':' + sec;
        }
    }
    static create($context = $('.b_player_progress')) {
        return new PlayerProgress($context);
    }
}


class PlayerVolume {
    constructor($context) {
        this.KEY_LOCAL_STORE_VOLUME = 'volume';
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Volume)
            return this.$context[0].Volume;
        // @ts-ignore
        this.$context[0].Volume = this;
        this.player = Player.create();
        this.slider = Slider.create(this.$context)[0];
        this.disabled();
        this.volume = this.volume;
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.removeDisabled();
        });
        this.slider.$context.on(SliderEvents.ValueUpdate, () => {
            if (this.mute && this.slider.value === 0) {
                return;
            }
            else {
                this.mute = false;
            }
            this.volume = this.slider.value;
        });
        this.player.$context.on(Player.EVENT_UPDATE_VOLUME, () => {
            if (this.mute || this.volume === 0) {
                this.mute = true;
                return;
            }
            else {
                this.mute = false;
            }
            this.volume = this.player.volume;
        });
        this.$context.find('button.volume_mute').on('click', () => {
            this.mute = !this.mute;
        });
        this.player.$context.on(Player.EVENT_ERROR, () => {
            this.disabled();
        });
    }
    disabled() {
        this.$context.addClass('disabled');
    }
    removeDisabled() {
        this.$context.removeClass('disabled');
        this.slider.$context.removeClass('disabled');
    }
    get mute() {
        return this.player.mute;
    }
    set mute(mute) {
        this.player.mute = mute;
        if (mute) {
            this.slider.value = 0;
            this.$context.addClass('mute');
            return;
        }
        else {
            this.$context.removeClass('mute');
        }
    }
    get volume() {
        return this.volumeStore ? this.volumeStore : this.player.volume;
    }
    get volumeStore() {
        return parseFloat(localStorage.getItem(this.KEY_LOCAL_STORE_VOLUME));
    }
    set volumeStore(volume) {
        localStorage.setItem(this.KEY_LOCAL_STORE_VOLUME, String(volume));
    }
    set volume(volume) {
        if (volume < 0 || volume > 1) {
            throw new Error(`Invalid volume "${volume}"`);
        }
        this.slider.value = volume;
        if (this.player.volume != volume) {
            this.player.volume = volume;
        }
        this.volumeStore = volume;
    }
    static create($context = $('.b_player_volume')) {
        return new PlayerVolume($context);
    }
}


class PlayerInfo {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Info)
            return this.$context[0].Info;
        // @ts-ignore
        this.$context[0].Info = this;
        this.player = Player.create();
        this.disabled();
        this.player.$context.on(Player.EVENT_ERROR + " || " + Player.EVENT_LOADED_META_DATA, () => {
            this.load();
        });
        this.initDots();
        this.initFavorite();
    }
    initDots() {
        this.$context.find('button.dots').on('click', () => {
            this.isOpenDots ? this.closeDots() : this.openDots();
        });
    }
    initFavorite() {
        this.$context.find('button.favorite').on('click', () => {
            this.is_favorite = this.is_favorite;
        });
    }
    load() {
        let songPlayer = this.player.songPlayer;
        this.$context.find('.wrap_author').text(songPlayer.artistHtml);
        this.$context.find('.inner_song').text(songPlayer.songName);
        this.$context.find('.inner_song').attr('href', songPlayer.urlSong);
        this.$context.find('.download_song').attr('href', songPlayer.urlSong);
        if (navigator.mediaSession) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: songPlayer.songName,
                artist: songPlayer.artistHtml,
            });
        }
        this.disabled(false);
    }
    disabled(disabled = true) {
        if (disabled) {
            this.$context.addClass('disabled');
            this.$context.find('button').attr('disabled', 1);
        }
        else {
            this.$context.removeClass('disabled');
            this.$context.find('button').removeAttr('disabled');
        }
    }
    openDots() {
        this.$context.find('.inner_dots').addClass('open');
    }
    closeDots() {
        this.$context.find('.inner_dots').removeClass('open');
    }
    get isOpenDots() {
        return this.$context.find('.inner_dots').hasClass('open');
    }
    set is_favorite(is_favorite) {
        is_favorite
            ? this.$context.find('.inner_favorite').removeClass('is_favorite')
            : this.$context.find('.inner_favorite').addClass('is_favorite');
        is_favorite
            ? this.$context.find('.inner_favorite .text').text('')
            : this.$context.find('.inner_favorite .text').append('Трек добавлен в <a href="">Мои лайки</a>');
    }
    get is_favorite() {
        return this.$context.find('.inner_favorite').hasClass('is_favorite');
    }
    static create($context = $('.b_player_info')) {
        return new PlayerInfo($context);
    }
}


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
            this.disabled();
        });
        this.player.$context.on(Player.EVENT_UPDATE_REPEAT_PLAYLIST, () => {
            this.setActiveRepeat();
        });
        this.player.$context.on(Player.EVENT_ENDED + ' || ' + Player.EVENT_ERROR, () => {
            this.player.next();
            this.player.play();
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
        this.player.loadSongPlayer(this.player.songPlayer, playlist_new);
        if (playlist_id === playlist_new.id
            && playlist_new.songsPlayer.length > 2) {
            this.shufflePlaylist();
        }
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
        return html_playlist;
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
                        <span class="icon-vol2"></span>
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


class PlayerHQ {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].HQ)
            return this.$context[0].HQ;
        // @ts-ignore
        this.$context[0].HQ = this;
        this.player = Player.create();
        this.disabled();
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.disabled(false);
        });
        this.$context.find('button.hq').on('click', () => {
            this.is_active = !this.is_active;
            this.player.hq = this.is_active;
        });
    }
    // fixme переименовать в active, так как это свойство, если бы был метод тогда бы он назывался isActive
    set is_active(is_active) {
        is_active
            ? this.$context.addClass('active')
            : this.$context.removeClass('active');
    }
    get is_active() {
        return this.$context.hasClass('active');
    }
    disabled(disabled = true) {
        disabled ? this.$context.addClass('disabled') : this.$context.removeClass('disabled');
    }
    static create($context = $('.b_player_hq')) {
        return new PlayerHQ($context);
    }
}
