class PlayerHQ {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].HQ)
            return this.$context[0].Info;
        // @ts-ignore
        this.$context[0].HQ = this;
        this.player = Player.create();
        this.disabled();
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.disabled(false);
        });
        this.$context.find('button.hq').on('click', () => {
            this.is_hq = this.is_hq;
            this.player.hq = this.is_hq;
        });
    }
    set is_hq(is_hq) {
        is_hq
            ? this.$context.removeClass('is_hq')
            : this.$context.addClass('is_hq');
    }
    get is_hq() {
        return this.$context.hasClass('is_hq');
    }
    disabled(disabled = true) {
        disabled ? this.$context.addClass('disabled') : this.$context.removeClass('disabled');
    }
    static create($context = $('.b_player_hq')) {
        return new PlayerHQ($context);
    }
}
