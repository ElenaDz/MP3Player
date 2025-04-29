class BtnsPlayer {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].BtnsPlayer)
            return;
        // @ts-ignore
        this.$context[0].BtnsPlayer = this;
        this.player = Player.create();
        this.$context.on('click', () => {
            // fixme не правильно, правильно создать здесь методы play, pause и isPlaying и воспользоваться ими ok
            this.is_playing ? this.pause() : this.play();
        });
        this.player.$context.on(Player.EVENT_UPDATE_ACTION, () => {
            if (this.player.song_id == this.song_id) {
                this.playing = !this.is_playing;
            }
            else {
                this.playing = false;
            }
        });
    }
    // @ts-ignore
    get song_id() {
        return this.$context.data('url');
    }
    play() {
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
    get is_playing() {
        return this.$context.hasClass('playing');
    }
    static create($context = $('.btn_player')) {
        let $mini_players = $context;
        let mini_players = [];
        $mini_players.each((index, element) => {
            let mini_player = $(element);
            mini_players.push(new BtnsPlayer(mini_player));
        });
        return mini_players;
    }
}
