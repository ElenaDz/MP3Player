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
        this.disabled();
        this.volume = Player_store.getVolume();
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.$context.find('.b_slider').removeClass('disabled');
            this.volume = Player_store.getVolume() ? Player_store.getVolume() : this.player.volume;
        });
        this.slider.context.on(SliderEvents.ValueUpdate, () => {
            if (this.muted && this.volume === 0) {
                this.mute = true;
                return;
            }
            else {
                this.mute = false;
            }
            this.player.volume = this.volume;
            return;
        });
        this.player.$context.on(Player.EVENT_UPDATE_VOLUME, () => {
            if (this.muted && this.volume === 0) {
                this.mute = true;
                return;
            }
            this.volume = this.player.volume;
            Player_store.setVolume(this.volume);
            return;
        });
        this.$context.find('button.volume_mute').on('click', () => {
            this.mute = !this.mute;
        });
        this.player.$context.on(Player.EVENT_ERROR, () => {
            this.disabled();
        });
        // todo необходимо сохранять уровень громкости localStore для того чтобы он восстанавливался при повторном отрытии страницы ok
    }
    disabled() {
        this.$context.find('.b_slider').addClass('disabled');
    }
    get mute() {
        return this.player.mute;
    }
    set mute(mute) {
        this.player.mute = mute;
        if (mute) {
            this.volume = 0;
            this.$context.addClass('mute');
        }
        else {
            this.volume = this.player.volume;
            this.$context.removeClass('mute');
        }
    }
    muted() {
        this.mute = this.player.volume == 0;
    }
    get volume() {
        return this.slider.value;
    }
    set volume(volume) {
        if (volume < 0 || volume > 1) {
            throw new Error(`Invalid volume "${volume}"`);
        }
        this.slider.value = volume;
    }
    static create($context = $('.b_player_volume')) {
        return new Volume($context);
    }
}
