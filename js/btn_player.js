class BtnPlayer {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].BtnPlayer)
            return this.$context[0].BtnPlayer;
        // @ts-ignore
        this.$context[0].BtnPlayer = this;
        this.player = Player.create();
        //
        this.$context.on('click', () => {
            this.playing ? this.pause() : this.play();
        });
        this.player.$context.on(Player.EVENT_UPDATE_PLAYING, () => {
            // fixme я просил завести свойство song id и использовать его для такой проверки, url'ов может быть несколько у одной
            //  и той же песни например hd и обычное качество
            if (this.player.url == this.url) {
                this.playing = this.player.playing;
            }
            else {
                this.playing = false;
            }
        });
    }
    get song_id() {
        // fixme не знаю откуда брать song id
        return;
    }
    // @ts-ignore
    get url() {
        return this.$context.data('url');
    }
    play() {
        if (this.player.url !== this.url) {
            this.player.url = this.url;
        }
        this.player.play();
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
    static create($context = $('.btn_player')) {
        // @ts-ignore
        return $context.map((index, element) => {
            return new BtnPlayer($(element));
        });
    }
}
