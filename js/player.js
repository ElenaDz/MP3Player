class Player {
    constructor($context) {
        this.$context = $context;
        this.audio = $('body').find('audio')[0];
        // @ts-ignore
        if (this.$context[0].Player)
            return;
        // @ts-ignore
        this.$context[0].Player = this;
        this.audio = $('body').find('audio')[0];
        this.initEventsAudio();
    }
    initEventsAudio() {
        this.audio.onplay = () => {
            // fixme наверное здесь ты хотели синхронизировать состоянии плеера audio с состоянием нашего плеером или что
            this.playing = this.playing;
        };
        this.audio.onpause = () => {
            this.playing = this.playing;
        };
    }
    // fixme ерунда какая-то, удалить, не нужно для такой проверки заводить отдельный метод делай ее в том месте где она понадобиться
    updateAction() {
        this.playing
            ? this.pause()
            : this.play();
    }
    // @ts-ignore
    get url() {
        // fixme так где все такие у нас храниться Url?
        return this.$context.data('btn_player_url');
    }
    // @ts-ignore
    set url(url) {
        // fixme храним состояние в двух местах, не вижу причин создавать такую головную боль, удаляем
        this.$context.data('btn_player_url');
        this.audio.src = url;
    }
    play() {
        this.audio.play();
    }
    pause() {
        this.audio.pause();
    }
    // fixme ерунда какая-то, ошибка логики, set playing=true привет к тому что get  playing вернет false
    set playing(playing) {
        playing
            ? this.$context.removeClass('playing')
            : this.$context.addClass('playing');
    }
    get playing() {
        return this.$context.hasClass('playing');
    }
    static create($context = $('.b_player')) {
        return new Player($context);
    }
}
