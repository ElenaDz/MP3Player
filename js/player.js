class Player {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Player)
            return this.$context[0].Player;
        // @ts-ignore
        this.$context[0].Player = this;
        this.audio = this.$context.find('audio')[0];
        this.initEventsAudio();
    }
    initEventsAudio() {
        this.audio.onplay = () => {
            // fixme лучше синхронизировать состояние твоего плеера с audio, чем просто надеяться на логику работы, которая
            //  сейчас работает, а завтра нет, потому что что то изменилось, для синхронизации используй свойство audio.paused
            //  это касается все 3х обработчиков
            console.log('play', this.audio.paused);
            this.playing = !this.playing;
            this.$context.trigger(Player.EVENT_UPDATE_ACTION);
        };
        this.audio.onpause = () => {
            console.log('pause', this.audio.paused);
            this.playing = !this.playing;
            this.$context.trigger(Player.EVENT_UPDATE_ACTION);
        };
        this.audio.onloadedmetadata = () => {
            console.log('load', this.audio.paused);
            this.playing = true;
        };
    }
    // fixme заведи свойство url
    // @ts-ignore
    get song_id() {
        // fixme url нужно брать из тега audio, нельзя хранить одно и тоже в двух местах
        return this.$context.data('url');
    }
    // fixme удалить сеттер, у нас song id берется из url, его нельзя присвоить
    // @ts-ignore
    set song_id(url) {
        this.$context.data('url', url);
    }
    play() {
        // fixme завтра song id будет цифрой, здесь должно быть обращение к свойству url
        this.audio.src = this.song_id;
        this.audio.play();
    }
    pause() {
        this.audio.pause();
    }
    set playing(playing) {
        playing
            ? this.$context.addClass('playing')
            : this.$context.removeClass('playing');
    }
    get playing() {
        return this.$context.hasClass('playing');
    }
    static create($context = $('.b_player')) {
        return new Player($context);
    }
}
Player.EVENT_UPDATE_ACTION = 'Player.EVENT_UPDATE_ACTION';
