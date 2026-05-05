class PlayerInfo
{
    public $context: JQuery;
    private player: Player;
    private eq: PlayerEQ;

    constructor($context: JQuery) {

        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Info) return this.$context[0].Info;

        // @ts-ignore
        this.$context[0].Info = this;

        this.player = Player.create();
        this.eq = PlayerEQ.create()

        this.disabled();

        this.player.$context.on(Player.EVENT_ERROR + " || " + Player.EVENT_LOADED_SONG_PLAYER,() =>
        {
            this.load();
            this.initComment();
        })

        this.initDots();
        this.initFavorite();
        this.initEq();
        this.initHq();

        this.eq.$context.on(PlayerEQ.EVENT_CLOSE, () =>
        {
            this.$context.find('.eq').removeClass('show');
        });

        $('body').on('click',(e) =>
        {
            if (!$(e.target).hasClass('b_popup')
                && !$(e.target).hasClass('dots')
                && !$(e.target).parents().hasClass('b_popup'))
            {
                this.closeDots();
            }
        });

        this.initCopy();
        this.initClickComment();
        this.initRepeat()
    }

    private initRepeat()
    {
        let $btn_repeat_playlist =  this.$context.find('.repeat_playlist');

        $btn_repeat_playlist.on('click',() =>
        {
            this.player.repeat_playlist = ! this.player.repeat_playlist;

            this.player.repeat_playlist
                ? $btn_repeat_playlist.addClass('active')
                : $btn_repeat_playlist.removeClass('active');

            this.player.repeat_playlist
                ? this.updateRepeat('.is_repeat')
                : this.updateRepeat('.is_repeat_off');

        });
    }

    public updateRepeat(name_class: string)
    {
        this.closeDots();

        this.addActiveForClass(name_class);

        setTimeout(
            () => {
                this.removeActiveForClass(name_class);
            },
            2*1000
        );

        setTimeout(
            () => {
                $('body').on('click',(e) =>
                {
                    if (!$(e.target).hasClass('repeat_playlist')){
                        this.removeActiveForClass(name_class);
                        $('body').off('click')
                    }
                });
            },
            0
        );
    }

    private initClickComment()
    {
        this.$context.find('.wrap_comment').on('click',() =>
        {
            this.closeDots();
        });
    }
    private initCopy()
    {
        this.$context.find('.copy').on('click',() =>
        {
            let hostname = window.location.hostname;

            let url_song_page = hostname + '/' + this.player.songPlayer.urlSongPage;

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(url_song_page);
            }

            this.closeDots();

            this.addActiveForClass('.is_copy');

            setTimeout(
                () => {
                   this.removeActiveForClass('.is_copy');
                },
                2*1000
            );

            setTimeout(
                () => {
                    $('html').on('click',(e) =>
                    {
                        if (!$(e.target).hasClass('copy')){
                            this.removeActiveForClass('.is_copy');
                            $('html').off('click')
                        }
                    });
                },
                0
            );

        });
    }

    private removeActiveForClass (name_class: string)
    {
        this.$context.find(name_class).removeClass('active');
    }

    private addActiveForClass (name_class: string)
    {
        this.$context.find(name_class).addClass('active');
    }

    private initComment()
    {
        let url = this.player.songPlayer.urlSongPage + '#song-comments';

        this.$context.find('.wrap_comment').attr('href', url);
    }


    private initHq()
    {
        this.$context.find('.hq').on('click',() =>
        {
            this.player.$context.trigger(Player.EVENT_UPDATE_HQ);
        });

        this.player.$context.on(Player.EVENT_UPDATE_HQ,() =>
        {
            let  $hq = this.$context.find('.hq');

            this.player.hq ? $hq.addClass('active') : $hq.removeClass('active');
        });
    }

    private initEq()
    {
        let  $eq = this.$context.find('.eq');

        $eq.on('click',() =>
        {
            this.eq.isShow ? this.eq.close() : this.eq.show();

            this.eq.isShow ? $eq.addClass('show') : $eq.removeClass('show');

            this.closeDots();
        });
    }

    private initDots()
    {
        this.renderPopup();

        this.$context.find('button.dots').on('click',() =>
        {
            this.isOpenDots ? this.closeDots() : this.openDots();
        });
    }

    private renderPopup()
    {
        this.$context.find('.inner_dots').append(this.addHtmlPopup)
    }

    private addHtmlPopup()
    {
       return `<div class="b_popup">
                <div class="eq">
                    <i></i>
                    <span>Эквалайзер</span>
                </div>
                <div class="repeat_playlist">
                    <i></i>
                    <span>
                        Повторять плейлист
                    </span>
                </div>
                <div class="copy">
                    <i></i>
                    <span>
                        Скопировать ссылку
                    </span>
                </div>
                <a class="wrap_comment" href="">
                    <div class="comment">
                        <i></i>
                        <span>
                            Оставить отзыв
                        </span>
                    </div>
                </a>

            </div>
            <div class="b_popup is_copy">
                <span>Ссылка скопирована</span>
            </div>
            <div class="b_popup is_repeat">
                <span>Режим повтора активирован</span>
            </div>
            <div class="b_popup is_repeat_off">
                <span>Режим повтора снят</span>
            </div>
        `;
    }
    private initFavorite()
    {
        this.$context.find('button.favorite').on('click',() =>
        {
            this.is_favorite = this.is_favorite;
        });
    }

    private load()
    {
        let songPlayer = this.player.songPlayer;

        songPlayer.artistHtml
            ? this.$context.find('.wrap_author').html(songPlayer.artistHtml)
            :  this.$context.find('.wrap_author').text(this.player.playlist.title);

        this.$context.find('.inner_song').text(songPlayer.songName);

        this.$context.find('.inner_song').attr('href', songPlayer.urlSongPage);

        this.$context.find('.download_song').attr('href', songPlayer.urlSongPage);

        this.$context.find('.artist_img img').attr('src', songPlayer.urlSongImg);

        if (navigator.mediaSession)
        {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: songPlayer.songName,
                artist: songPlayer.artistHtml,
            });
        }

        this.disabled(false);
    }

    public setSongName(song_name: string) {
        this.$context.find('.inner_song').text(song_name);
    }

    public setArtistHtml(artist_html) {
        artist_html
            ? this.$context.find('.wrap_author').html(artist_html)
            :  this.$context.find('.wrap_author').text('Название плейлиста');
    }

    private disabled(disabled: boolean = true)
    {
        if (disabled) {
            this.$context.addClass('disabled');
            this.$context.find('button').attr('disabled', 1);

        } else {
            this.$context.removeClass('disabled');
            this.$context.find('button').removeAttr('disabled');
        }
    }

    private openDots()
    {
        this.$context.find('.inner_dots').addClass('open');
    }

    private closeDots()
    {
        this.$context.find('.inner_dots').removeClass('open');
    }

    private get isOpenDots()
    {
        return this.$context.find('.inner_dots').hasClass('open');
    }

    private set is_favorite(is_favorite)
    {
        is_favorite
            ? this.$context.find('.inner_favorite').removeClass('is_favorite')
            : this.$context.find('.inner_favorite').addClass('is_favorite');

        is_favorite
            ? this.$context.find('.inner_favorite .text').text('')
            : this.$context.find('.inner_favorite .text').append('Трек добавлен в <a href="">Мои лайки</a>');
    }

    private get is_favorite()
    {
        return this.$context.find('.inner_favorite').hasClass('is_favorite');
    }

    public static create($context = $('.b_player_info')): PlayerInfo
    {
        return new PlayerInfo($context);
    }
}