class PlayerHQ {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].HQ)
            return this.$context[0].HQ;
        // @ts-ignore
        this.$context[0].HQ = this;
        this.player = Player.create();
        this.disabled();
        this.player.$context.on(Player.EVENT_LOADED_SONG_PLAYER, () => {
            this.disabled(false);
        });
        this.player.$context.on(Player.EVENT_UPDATE_HQ, () => {
            this.setActive();
        });
        this.$context.find('button.hq').on('click', () => {
            this.setActive();
        });
    }
    setActive() {
        this.active = !this.active;
        this.player.hq = this.active;
    }
    set active(active) {
        active
            ? this.$context.addClass('active')
            : this.$context.removeClass('active');
    }
    get active() {
        return this.$context.hasClass('active');
    }
    disabled(disabled = true) {
        disabled ? this.$context.addClass('disabled') : this.$context.removeClass('disabled');
    }
    static create($context = $('.b_player_hq')) {
        return new PlayerHQ($context);
    }
}
