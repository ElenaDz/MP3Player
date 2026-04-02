class PlayerVolume {
    constructor($context) {
        this.KEY_LOCAL_STORE_VOLUME = 'volume';
        this.KEY_LOCAL_STORE_MUTE = 'mute';
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
        this.mute = this.mute;
        this.player.$context.on(Player.EVENT_LOADED_SONG_PLAYER, () => {
            this.removeDisabled();
        });
        this.slider.$context.on(SliderEvents.ValueUpdate, () => {
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
            console.log(this.volume);
        });
        this.$context.find('button.volume_mute').on('click', () => {
            this.mute = !this.mute;
        });
    }
    disabled() {
        this.$context.addClass('disabled');
    }
    removeDisabled() {
        this.$context.removeClass('disabled');
        this.slider.$context.removeClass('disabled');
    }
    set mute(mute) {
        this.player.mute = mute;
        this.muteStore = mute;
        if (mute) {
            this.slider.value = 0;
            this.$context.addClass('mute');
            return;
        }
        else {
            this.$context.removeClass('mute');
        }
    }
    get volume() {
        return this.volumeStore ? this.volumeStore : this.player.volume;
    }
    get mute() {
        return this.muteStore || false;
    }
    get volumeStore() {
        return parseFloat(localStorage.getItem(this.KEY_LOCAL_STORE_VOLUME));
    }
    set volumeStore(volume) {
        localStorage.setItem(this.KEY_LOCAL_STORE_VOLUME, String(volume));
    }
    get muteStore() {
        return JSON.parse(localStorage.getItem(this.KEY_LOCAL_STORE_MUTE));
    }
    set muteStore(mute) {
        localStorage.setItem(this.KEY_LOCAL_STORE_MUTE, String(mute));
    }
    set volume(volume) {
        if (volume < this.slider.value_min || volume > this.slider.value_max) {
            throw new Error(`Invalid volume "${volume}"`);
        }
        this.slider.value = volume;
        if (this.player.volume != volume) {
            this.player.volume = volume;
        }
        this.volumeStore = volume;
    }
    static create($context = $('.b_player_volume')) {
        return new PlayerVolume($context);
    }
}
