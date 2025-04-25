class BtnPlayer {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].BtnPlayer)
            return;
        // @ts-ignore
        this.$context[0].BtnPlayer = this;
        this.player = Player.create();
        this.$context.find('button.play').on('click', () => {
            // fixme не правильно, правильно создать здесь методы play, pause и isPlaying и воспользоваться ими
            this.player.url = this.url;
            this.player.updateAction();
        });
    }
    get url() {
        return this.$context.data('url');
    }
    static create($context = $('.btn_player')) {
        return new BtnPlayer($context);
    }
}
