

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


class Player {
    constructor($context) {
        this._playlist = [];
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
        Controls.create();
        Progress.create();
        Volume.create();
        Info.create();
        Playlist.create();
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
        this.audio.addEventListener('error', () => {
            this.$context.trigger(Player.EVENT_ERROR);
        });
    }
    get songId() {
        let filename = this.url ? this.url.split('/').reverse()[0] : null;
        return filename;
    }
    get url() {
        return this.audio.src;
    }
    set url(url) {
        this.audio.src = url;
    }
    // todo передавать плейлист вместе с песней ok
    loadSongPlayer(songPlayer, playlist) {
        this.songPlayer = songPlayer;
        // this.playlist = playlist;
        this.url = songPlayer.url;
    }
    getSongPlayer() {
        return this.songPlayer;
    }
    get playlist() {
        return this._playlist;
    }
    set playlist(playlist) {
        this._playlist = playlist;
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
    // todo использовать только его для получения плейлист айди ok
    static getPlaylistId(playlist) {
        return playlist.map((songPlayer) => {
            songPlayer.songName;
        })
            .join(' ');
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


class BtnPlayer {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].BtnPlayer)
            return this.$context[0].BtnPlayer;
        // @ts-ignore
        this.$context[0].BtnPlayer = this;
        this.player = Player.create();
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
        let filename = this.url ? this.url.split('/').reverse()[0] : null;
        return filename;
    }
    // @ts-ignore
    get url() {
        return this.$context.data('url');
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
        let btns_player = BtnPlayer.create($(this.$context.parents('.inline_player_playlist_main')));
        let playlist = [];
        btns_player.forEach((btn_player) => {
            playlist.push(btn_player.songPlayer);
        });
        this.player.playlist = playlist;
        if (this.player.songId !== this.songId) {
            if (this.url) {
                this.player.loadSongPlayer(this.songPlayer, playlist);
            }
        }
    }
    get songPlayer() {
        return {
            url: this.url,
            artistHtml: this.artistHtml,
            songName: this.songName,
            urlSong: this.urlSong
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
    // fixme не правильно здесь определен $context, $context это контекст в котором мы хотим найти все btn player и создать их например body или плейлист(ok?)
    // @ts-ignore
    static create($context = $('.inline_player_playlist_main')) {
        let $playlists = $context;
        let btns_player = [];
        $playlists.find('.btn_player').each((index, element) => {
            btns_player.push(new BtnPlayer($(element)));
        });
        return btns_player;
    }
}


class Controls {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Controls)
            return this.$context[0].Controls;
        // @ts-ignore
        this.$context[0].Controls = this;
        this.player = Player.create();
        this.disabled();
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.$context.find('button.play').removeAttr('disabled');
        });
        this.player.$context.on(Player.EVENT_ERROR, () => {
            this.disabled();
        });
        this.$context.find('button.play').on('click', () => {
            if (!this.player.url) {
                throw new Error('Не задан url');
            }
            this.player.playing ? this.player.pause() : this.player.play();
        });
    }
    disabled() {
        this.$context.find('button.play').attr('disabled', 1);
        this.$context.find('button.prev').attr('disabled', 1);
        this.$context.find('button.next').attr('disabled', 1);
    }
    static create($context = $('.b_player_controls')) {
        return new Controls($context);
    }
}


class Progress {
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
        this.$context.find('.time_current').text(Progress.formatTime(current_time));
    }
    set durationText(duration) {
        this.$context.find('.time_duration').text(Progress.formatTime(duration));
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
        return new Progress($context);
    }
}


class Volume {
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
            this.$context.removeClass('disabled');
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
    get mute() {
        return this.player.mute;
    }
    set mute(mute) {
        this.player.mute = mute;
        if (mute) {
            this.slider.value = 0;
            this.$context.addClass('mute');
        }
        else {
            this.slider.value = this.player.volume;
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
        this.player.volume = volume;
        this.volumeStore = volume;
    }
    static create($context = $('.b_player_volume')) {
        return new Volume($context);
    }
}


class Info {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Info)
            return this.$context[0].Info;
        // @ts-ignore
        this.$context[0].Info = this;
        this.player = Player.create();
        this.disabled();
        this.player.$context.on(Player.EVENT_ERROR, () => {
            this.disabled();
            this.setSongPlayer(this.player.getSongPlayer());
        });
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.setSongPlayer(this.player.getSongPlayer());
            this.$context.removeClass('disabled');
        });
    }
    disabled() {
        this.$context.addClass('disabled');
    }
    setSongPlayer(song) {
        this.$context.find('.wrap_author').text(song.artistHtml);
        this.$context.find('.inner_song').text(song.songName);
        this.$context.find('.inner_song').attr('href', song.urlSong);
        this.$context.find('.download_song').attr('href', song.urlSong);
        if (navigator.mediaSession) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.songName,
                artist: song.artistHtml,
            });
        }
    }
    static create($context = $('.b_player_info')) {
        return new Info($context);
    }
}


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
            // fixme загрузка плейлиста должна быть вынесена в отдельную функцию load ok
            this.load();
        });
    }
    // todo
    load() {
        // данные какие именно песни загружать должно быть взяты из плеера, а туда они попадут из Btn Player ok
        this.$context.find('.playlist').empty();
        console.log(this.player.playlist);
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
