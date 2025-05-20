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
        this.volume = this.volume;
        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () => {
            this.$context.find('.b_slider').removeClass('disabled');
        });
        this.slider.context.on(SliderEvents.ValueUpdate, () => {
            if (this.mute && this.slider.value === 0) {
                return;
            }
            else {
                this.mute = false;
            }
            this.volume = this.slider.value;
        });
        this.player.$context.on(Player.EVENT_UPDATE_VOLUME, () => {
            if (this.mute || this.volume === 0) {
                this.mute = true;
                return;
            }
            else {
                this.mute = false;
            }
            this.volume = this.player.volume;
        });
        this.$context.find('button.volume_mute').on('click', () => {
            this.mute = !this.mute;
        });
        this.player.$context.on(Player.EVENT_ERROR, () => {
            this.disabled();
        });
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
            this.slider.value = 0;
            this.$context.addClass('mute');
        }
        else {
            this.slider.value = this.player.volume;
            this.$context.removeClass('mute');
        }
    }
    get volume() {
        return this.volumeStore ? this.volumeStore : this.player.volume;
    }
    get volumeStore() {
        return parseFloat(localStorage.getItem(Volume.keyLocalStore));
    }
    set volumeStore(volume) {
        localStorage.setItem(Volume.keyLocalStore, String(volume));
    }
    set volume(volume) {
        if (volume < 0 || volume > 1) {
            throw new Error(`Invalid volume "${volume}"`);
        }
        this.slider.value = volume;
        this.player.volume = volume;
        this.volumeStore = volume;
    }
    static create($context = $('.b_player_volume')) {
        return new Volume($context);
    }
}
// fixme это константа, для констант используется другая нотация
// @see https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Statements/const
Volume.keyLocalStore = 'volume';
