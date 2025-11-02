class PlayerHQ {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        // fixme Info?
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
            // fixme эта строчка какая то ерунда, не должно быть таких строчек
            this.is_hq = this.is_hq;
            this.player.hq = this.is_hq;
        });
    }
    // fixme кажется ты здесь тут закладываешься на будущее что кроме hd появятся другие режимы поэтому выбрала такое имя,
    //  предлагаю не делать этот так как это усложняет понимание кода, я вот только что сидел и несколько минут думал почему ты так назвала
    //  давай сделаем просто active или нет и класс соответственно active, это максимально просто и понятно, а понадобятся другие режимы
    //  тут в любом случае все переписывать придётся
    set is_hq(is_hq) {
        // fixme вот здесь ошибка логики, я не понимаю что ты вкладывала в is, я его игнорирую, я вижу что если hd передать true
        //  то он перестанет быть hd так как класс будет удален, это явная ошибка
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
