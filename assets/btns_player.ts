class BtnsPlayer
{
    private $context: JQuery;
    private player: Player;
    private url: string;


    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].BtnsPlayer) return;

        // @ts-ignore
        this.$context[0].BtnsPlayer = this;

        this.player = Player.create();

        this.$context.on('click',() =>
        {
            // fixme не правильно, правильно создать здесь методы play, pause и isPlaying и воспользоваться ими ok
            this.is_playing ? this.pause() : this.play();
        });

        this.player.$context.on(Player.EVENT_UPDATE_ACTION,() =>
        {
            if (this.player.song_id == this.song_id) {
                this.playing = !this.is_playing;
            } else  {
                this.playing = false;
            }
        })
    }

    // @ts-ignore
    private get song_id(): string
    {
        return this.$context.data('url');
    }

    private play()
    {
        this.player.song_id = this.song_id;
        this.player.play();
    }

    private pause()
    {
        this.player.pause();
    }

    private set playing(playing: boolean)
    {
        playing
            ? this.$context.addClass('playing')
            : this.$context.removeClass('playing');
    }

    private get is_playing(): boolean
    {
        return this.$context.hasClass('playing');
    }

    public static create($context = $('.btn_player')): BtnsPlayer[]
    {
        let $mini_players: JQuery  = $context;
        let mini_players: BtnsPlayer[] = [];

        $mini_players.each((index, element) => {
            let mini_player: JQuery = $(element);
            mini_players.push(new BtnsPlayer(mini_player));
        })

        return mini_players;
    }
}