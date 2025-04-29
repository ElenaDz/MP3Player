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
        this.player.$context.on(Player.EVENT_UPDATE_ACTION, () => {
            if (this.player.song_id == this.song_id) {
                // fixme синхронизируй с состоянием плеера, а не просто пиши сомнительную логику, которая завтра сломается
                this.playing = !this.playing;
            }
            else {
                this.playing = false;
            }
        });
    }
    // fixme тоже самое что я писал в блоке плеер
    // @ts-ignore
    get song_id() {
        return this.$context.data('url');
    }
    play() {
        // fixme из за этой строчки плеер работает не так как на https://muzyara.com/, нужно продолжать воспроизведение,
        //  а не начинать сначала, если песня уже загружена в плеер
        this.player.song_id = this.song_id;
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
