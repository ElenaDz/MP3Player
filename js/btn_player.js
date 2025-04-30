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
            if (this.player.url == this.url) {
                // fixme синхронизируй с состоянием плеера, а не просто пиши сомнительную логику, которая завтра сломается ok
                this.playing = this.player.playing;
            }
            else {
                this.playing = false;
            }
        });
    }
    // fixme тоже самое что я писал в блоке плеер ok
    // @ts-ignore
    get url() {
        return this.$context.data('url');
    }
    play() {
        // fixme из за этой строчки плеер работает не так как на https://muzyara.com/, нужно продолжать воспроизведение,
        //  а не начинать сначала, если песня уже загружена в плеер ok
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
