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
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.disabled(false);
        });
        this.$context.find('button.hq').on('click', () => {
            this.active = !this.active;
            this.player.hq = this.active;
        });
    }
    // fixme переименовать в active, так как это свойство, если бы был метод тогда бы он назывался isActive ok
    set active(is_active) {
        is_active
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
