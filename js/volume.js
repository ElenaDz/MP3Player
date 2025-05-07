class Volume {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Volume)
            return this.$context[0].Volume;
        // @ts-ignore
        this.$context[0].Volume = this;
        this.player = Player.create();
        this.slider = Slider.create(this.$context)[0];
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.slider.value = this.player.volume;
        });
        // fixme нужно чтобы уровень громкости менялся сразу при передвижении slider без необходимости отпускать кнопку мыши,
        //  так как это происходить в самом audio
        this.slider.context.on(SliderEvents.StopMove, () => {
            // todo заведи свойство volume в этом классе и помети ниже стоящий код туда
            this.player.volume = this.slider.value;
            this.removeMute();
            if (this.player.volume == 0) {
                this.addMute();
            }
        });
        this.$context.find('button.volume_inner').on('click', () => {
            this.player.mute ? this.removeMute() : this.addMute();
        });
        // todo необходимо сохранять уровень громкости localStore для того чтобы он восстанавливался при повторном отрытии страницы
        // fixme когда меняешь громкость а audio в player она не меняется, тоже с muted
    }
    // fixme заменить эти два метода на свойство mute
    addMute() {
        this.player.mute = true;
        this.$context.addClass('mute');
        this.slider.value = 0;
    }
    removeMute() {
        this.player.mute = false;
        this.$context.removeClass('mute');
        this.slider.value = this.player.volume;
    }
    static create($context = $('.b_player_volume')) {
        return new Volume($context);
    }
}
