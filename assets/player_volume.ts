class PlayerVolume
{
    private readonly $context: JQuery;
    private player: Player;
    private slider: Slider;

    private KEY_LOCAL_STORE_VOLUME = 'volume';

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Volume) return this.$context[0].Volume;

        // @ts-ignore
        this.$context[0].Volume = this;

        this.player = Player.create();

        this.slider = Slider.create(this.$context)[0];

        this.disabled();

        this.volume =  this.volume;

        this.player.$context.on(Player.EVENT_LOADED_META_DATA,() =>
        {
            this.removeDisabled();
        });

        this.slider.$context.on(SliderEvents.ValueUpdate, () =>
        {
            if (this.mute && this.slider.value === 0) {
                return;
            } else  {
                this.mute = false;
            }

            this.volume = this.slider.value;
        });

        this.player.$context.on(Player.EVENT_UPDATE_VOLUME,() =>
        {
            if (this.mute || this.volume === 0) {
                this.mute = true;
                return;

            } else {
                this.mute = false;
            }

            this.volume = this.player.volume;
        });

        this.$context.find('button.volume_mute').on('click', () =>
        {
            this.mute = ! this.mute;
        });

        this.player.$context.on(Player.EVENT_ERROR,() =>
        {
            this.disabled();
        })
    }

    private disabled()
    {
        this.$context.addClass('disabled');
    }

    private removeDisabled()
    {
        this.$context.removeClass('disabled');
        this.slider.$context.removeClass('disabled');
    }

    private get mute() {
        return this.player.mute;
    }

    private set mute(mute)
    {
        this.player.mute = mute;

        if (mute) {
            this.slider.value = 0;
            this.$context.addClass('mute');
            return;

        } else {
            this.$context.removeClass('mute');
        }
    }


    private get volume()
    {
        return this.volumeStore ?  this.volumeStore : this.player.volume;
    }

    private get volumeStore(): number
    {
        return parseFloat(localStorage.getItem(this.KEY_LOCAL_STORE_VOLUME));
    }

    private set volumeStore(volume)
    {
        localStorage.setItem(this.KEY_LOCAL_STORE_VOLUME, String(volume));
    }

    private set volume(volume)
    {
        if (volume < 0 || volume > 1) {
            throw new Error(`Invalid volume "${volume}"`);
        }

        if (this.slider.value != this.player.volume) {
            this.slider.value = volume;
        }

        if (this.player.volume.toFixed(2) != volume.toFixed(2)) {
            this.player.volume = volume;
        }

        this.volumeStore = volume;
    }

    public static create($context = $('.b_player_volume')): PlayerVolume
    {
        return new PlayerVolume($context);
    }
}