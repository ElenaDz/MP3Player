class Player {
    constructor($context) {
        this.$context = $context;
        this.audio = $('body').find('audio')[0];
        // @ts-ignore
        if (this.$context[0].Player)
            return;
        // @ts-ignore
        this.$context[0].Player = this;
        this.initEventsAudio();
    }
    initEventsAudio() {
        this.audio.onplay = () => {
            this.playing = !this.is_playing;
            this.$context.trigger(Player.EVENT_UPDATE_ACTION);
        };
        this.audio.onpause = () => {
            this.playing = !this.is_playing;
            this.$context.trigger(Player.EVENT_UPDATE_ACTION);
        };
        this.audio.onloadedmetadata = () => {
            this.playing = true;
        };
    }
    // @ts-ignore
    get song_id() {
        // fixme так где все такие у нас храниться Url? ok
        return this.$context.data('url');
    }
    // @ts-ignore
    set song_id(url) {
        // fixme храним состояние в двух местах, не вижу причин создавать такую головную боль, удаляем ok
        this.$context.data('url', url);
    }
    play() {
        this.audio.src = this.song_id;
        this.audio.play();
    }
    pause() {
        this.audio.pause();
    }
    // fixme ерунда какая-то, ошибка логики, set playing=true привет к тому что get  playing вернет false ok
    set playing(playing) {
        playing
            ? this.$context.addClass('playing')
            : this.$context.removeClass('playing');
    }
    get is_playing() {
        return this.$context.hasClass('playing');
    }
    static create($context = $('.b_player')) {
        return new Player($context);
    }
}
Player.EVENT_UPDATE_ACTION = 'Player.EVENT_UPDATE_ACTION';
