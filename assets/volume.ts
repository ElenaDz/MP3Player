class Volume
{
    private readonly $context: JQuery;
    private player: Player;
    private slider: Slider;

    static keyLocalStore = 'volume';

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
            this.$context.find('.b_slider').removeClass('disabled');
        });

        this.slider.context.on(SliderEvents.ValueUpdate, () =>
        {
            if (this.mute && this.slider.value === 0) {
                return;
            } else  {
                this.mute = false;
            }

            this.volume = this.slider.value;

            // fixme перенести во внутрь сетера volume ok
        });

        this.player.$context.on(Player.EVENT_UPDATE_VOLUME,() =>
        {
            if (this.mute || this.volume === 0) {
                this.mute = true;
                return;
            } else  {
                this.mute = false;
            }

            this.volume = this.player.volume;

            // fixme перенести во внутрь сетера volume ok
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
        this.$context.find('.b_slider').addClass('disabled');
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

        } else {
            this.slider.value = this.player.volume;
            this.$context.removeClass('mute');
        }
    }


    private get volume() {
        return this.getVolumeStore() ?  this.getVolumeStore() : this.player.volume;
    }

    // fixme перенести все что касается volume store в класс volume и сделай private ok
    private getVolumeStore()
    {
        return JSON.parse(localStorage.getItem(Volume.keyLocalStore));
    }

    public setVolumeStore(volume: string)
    {
        localStorage.setItem(Volume.keyLocalStore, volume);
    }

    private set volume(volume)
    {
        if (volume < 0 || volume > 1) {
            throw new Error(`Invalid volume "${volume}"`);
        }

        this.slider.value = volume;

        this.player.volume = volume;

        this.setVolumeStore(String(volume));
    }

    public static create($context = $('.b_player_volume')): Volume
    {
        return new Volume($context);
    }
}