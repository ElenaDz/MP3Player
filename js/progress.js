class Progress {
    constructor($context) {
        this.$context = $context;
        // @ts-ignore
        if (this.$context[0].Progress)
            return this.$context[0].Progress;
        // @ts-ignore
        this.$context[0].Progress = this;
        this.player = Player.create();
        // @ts-ignore
        this.slider = Slider.create(this.$context)[0];
        console.log(this.slider);
        this.player.$context.on(Player.EVENT_UPDATE_PLAYING, () => {
            this.currentTimeText = this.player.currentTime;
            this.durationText = this.player.duration;
        });
        this.player.$context.on(Player.EVENT_UPDATE_TIME, () => {
            this.currentTimeText = this.player.currentTime;
            this.slider.value = this.player.currentTime;
        });
        // разбираюсь
        this.$context.on('click', (e) => {
            // this.player.currentTime = this.slider.value;
        });
    }
    set currentTimeText(current_time) {
        this.$context.find('.time_current').text(Progress.formatTime(current_time));
    }
    set durationText(duration) {
        this.$context.find('.time_duration').text(Progress.formatTime(duration));
    }
    // код взят из проекта Player
    static formatTime(sec = 0) {
        let min = (Math.floor(Math.trunc(sec / 60))).toString();
        if (+min < 10) {
            min = '0' + min;
        }
        sec = Math.floor(sec % 60);
        if (sec < 10) {
            return min + ':0' + sec;
        }
        else {
            return min + ':' + sec;
        }
    }
    static create($context = $('.b_player_progress')) {
        return new Progress($context);
    }
}
