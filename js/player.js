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
            this.playing = this.playing;
        };
        this.audio.onpause = () => {
            this.playing = this.playing;
        };
    }
    updateAction() {
        this.playing
            ? this.pause()
            : this.play();
    }
    // @ts-ignore
    get url() {
        return this.$context.data('btn_player_url');
    }
    // @ts-ignore
    set url(url) {
        this.$context.data('btn_player_url');
        this.audio.src = url;
    }
    play() {
        this.audio.play();
    }
    pause() {
        this.audio.pause();
    }
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
