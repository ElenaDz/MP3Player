class Progress
{
    private $context: JQuery;
    private player: Player;
    private slider: Slider;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Progress) return this.$context[0].Progress;

        // @ts-ignore
        this.$context[0].Progress = this;

        this.player = Player.create();

        this.slider = Slider.create(this.$context)[0];

        this.disabled();

        this.player.$context.on(Player.EVENT_LOADED_META_DATA,() =>
        {
            this.$context.find('.b_slider').removeClass('disabled');

            this.slider.value_max = this.player.duration;
            this.currentTimeText = this.player.currentTime;
            this.durationText = this.player.duration;
        });

        this.player.$context.on(Player.EVENT_UPDATE_TIME,() =>
        {
            this.currentTimeText = this.player.currentTime;
            this.slider.value = this.player.currentTime;
        });

        this.slider.context.on(SliderEvents.StopMove, () =>
        {
            this.player.currentTime = this.slider.value;
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

    private set currentTimeText(current_time: number)
    {
        this.$context.find('.time_current').text(Progress.formatTime(current_time));
    }

    private set durationText(duration: number)
    {
        this.$context.find('.time_duration').text(Progress.formatTime(duration));
    }

    private static formatTime(sec = 0)
    {
        let min = (Math.floor(Math.trunc(sec / 60))).toString();

        if (+min < 10) {
            min = '0' + min;
        }

        sec  = Math.floor(sec % 60);

        if (sec < 10) {
            return min + ':0' + sec
        } else {
            return min + ':' +  sec;
        }
    }

    public static create($context = $('.b_player_progress')): Progress
    {
        return new Progress($context);
    }
}