class PlayerControls {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Controls)
            return this.$context[0].Controls;
        // @ts-ignore
        this.$context[0].Controls = this;
        this.player = Player.create();
        this.disabled();
        this.player.$context.on(Player.EVENT_LOADED_META_DATA + ' ' + Player.EVENT_UPDATE_REPEAT_PLAYLIST + ' ' + PlayerPlaylist.EVENT_UPDATE_PLAYLIST, () => {
            this.updateDisabled();
        });
        this.initPlay();
        this.initNext();
        this.initPrev();
    }
    initPlay() {
        this.$context.find('button.play').on('click', () => {
            if (!this.player.url) {
                throw new Error('Не задан url');
            }
            this.player.playing ? this.player.pause() : this.player.play();
        });
    }
    initNext() {
        this.$context.find('button.next').on('click', () => {
            this.player.next();
            this.player.play();
        });
    }
    initPrev() {
        this.$context.find('button.prev').on('click', () => {
            this.player.previous();
            this.player.play();
        });
    }
    disabled() {
        this.$context.find('button.play').attr('disabled', 1);
        this.$context.find('button.prev').attr('disabled', 1);
        this.$context.find('button.next').attr('disabled', 1);
    }
    updateDisabled() {
        this.disabled();
        this.$context.find('button.play').removeAttr('disabled');
        if (this.player.hasNextSong()) {
            this.$context.find('button.next').removeAttr('disabled');
        }
        if (this.player.hasPreviousSong()) {
            this.$context.find('button.prev').removeAttr('disabled');
        }
    }
    static create($context = $('.b_player_controls')) {
        return new PlayerControls($context);
    }
}
