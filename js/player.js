class Player {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Player)
            return this.$context[0].Player;
        // @ts-ignore
        this.$context[0].Player = this;
        this.audio = this.$context.find('audio')[0];
        Controls.create();
        Progress.create();
        Volume.create();
        this.initEventsAudio();
    }
    initEventsAudio() {
        this.audio.onplay = () => {
            // fixme лучше синхронизировать состояние твоего плеера с audio, чем просто надеяться на логику работы, которая
            //  сейчас работает, а завтра нет, потому что что то изменилось, для синхронизации используй свойство audio.paused
            //  это касается все 3х обработчиков ok
            // console.log('play');
            this.playing = !this.audio.paused;
            this.$context.trigger(Player.EVENT_UPDATE_PLAYING);
        };
        this.audio.onpause = () => {
            // console.log('pause');
            this.playing = !this.audio.paused;
            this.$context.trigger(Player.EVENT_UPDATE_PLAYING);
        };
        this.audio.onloadedmetadata = () => {
            // console.log('load', this.audio.paused);
            this.playing = true;
            this.$context.trigger(Player.EVENT_UPDATE_PLAYING);
        };
        this.audio.ontimeupdate = () => {
            this.$context.trigger(Player.EVENT_UPDATE_TIME);
        };
    }
    // fixme заведи свойство url ok
    get url() {
        return this.audio.src;
    }
    set url(url) {
        this.audio.src = url;
    }
    play() {
        // fixme завтра song id будет цифрой, здесь должно быть обращение к свойству url ok
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
    set playing(playing) {
        playing
            ? this.$context.addClass('playing')
            : this.$context.removeClass('playing');
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
