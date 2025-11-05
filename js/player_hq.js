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
            // fixme эта строчка какая то ерунда, не должно быть таких строчек ok
            this.is_active = !this.is_active;
            this.player.hq = this.is_active;
        });
    }
    // fixme кажется ты здесь тут закладываешься на будущее что кроме hd появятся другие режимы поэтому выбрала такое имя,
    //  предлагаю не делать этот так как это усложняет понимание кода, я вот только что сидел и несколько минут думал почему ты так назвала
    //  давай сделаем просто active или нет и класс соответственно active, это максимально просто и понятно, а понадобятся другие режимы
    //  тут в любом случае все переписывать придётся ok
    set is_active(is_active) {
        // fixme вот здесь ошибка логики, я не понимаю что ты вкладывала в is, я его игнорирую, я вижу что если hd передать true
        //  то он перестанет быть hd так как класс будет удален, это явная ошибка ok
        is_active
            ? this.$context.addClass('active')
            : this.$context.removeClass('active');
    }
    get is_active() {
        return this.$context.hasClass('active');
    }
    disabled(disabled = true) {
        disabled ? this.$context.addClass('disabled') : this.$context.removeClass('disabled');
    }
    static create($context = $('.b_player_hq')) {
        return new PlayerHQ($context);
    }
}
