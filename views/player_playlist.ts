class PlayerPlaylist
{
    static readonly EVENT_UPDATE_PLAYLIST = 'PlayerPlaylist.EVENT_UPDATE_PLAYLIST';

    private $context: JQuery;
    private player: Player;
    private _playlist_id: string;

    constructor($context: JQuery)
    {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Playlist) return this.$context[0].Playlist;

        // @ts-ignore
        this.$context[0].Playlist = this;

        this.disabled();

        this.$context.find('.b_popup').append(this.renderPopup);

        let width_playlist = $('body').find('.main-music').innerWidth();

        this.$context.find('.b_popup').css('width', width_playlist);

        this.player = Player.create();

        $('html').on('click',(e) =>
        {
            if (!$(e.target).hasClass('b_popup')
                && !$(e.target).hasClass('playlist_btn')
                && !$(e.target).parents().hasClass('item_playlist')
                && !$(e.target).hasClass('shuffle')
                && !$(e.target).hasClass('prev elem')
                && !$(e.target).hasClass('play elem')
                && !$(e.target).hasClass('next elem')
                && !$(e.target).hasClass('repeat_playlist')
                && !$(e.target).parents().hasClass('b_popup'))
            {
                this.close();
                this.$context.find('.inner_dots').removeClass('open');
            }
        });

        this.player.$context.on(Player.EVENT_UPDATE_REPEAT_PLAYLIST, () =>
        {
            this.setActiveRepeat();
        });

        this.player.$context.on(Player.EVENT_ENDED ,() =>
        {
            this.player.next();
            this.player.play();
        });

        this.player.$context.on(Player.EVENT_ERROR,() =>
        {
            this.player.pause();
        });

        this.$context.on(PlayerPlaylist.EVENT_UPDATE_PLAYLIST, () =>
        {
            this.loadPlaylist(this.player.playlist);
        });

        this.initPlaylist();
        this.initRepeat();
        this.initShuffle();

        this.player.$context.on(Player.EVENT_LOADED_META_DATA, () =>
        {
            if (!this.isElementPartiallyVisible(this.$context.find('.playing ').parents('.item_playlist'), this.$context.find('.playlist '))){
                if (!this.$context.find('.playing')[0])  return;
                this.$context.find('.playing')[0].scrollIntoView({
                    block: "center",
                    behavior: "smooth"
                });
            }
        })
    }

    private isElementPartiallyVisible($el, $container) {
        if (!$el.length || !$container.length) {
            return false;
        }

        // Позиция контейнера и элемента относительно документа
        const containerOffsetTop = $container.offset().top;
        const containerOffsetBottom = $container.offset().bottom;
        const containerHeight = $container.innerHeight();

        const elOffsetTop = $el.offset().top;
        const elOffsetBottom = $el.offset().bottom;
        const elHeight = $el.outerHeight();

        // Сравниваем с видимой частью контейнера
        return (
            elOffsetTop  > containerOffsetTop &&
            elOffsetTop < containerOffsetTop + containerHeight
        );
    }

    private initPlaylist()
    {
        this.$context.find('button.close').on('click',() =>
        {
            this.close();
        });

        this.$context.find('button.playlist_btn').on('click',() =>
        {
            this.isOpen ? this.close() : this.open();
        });

        this.player.$context.on(Player.EVENT_LOADED_SONG_PLAYER,() =>
        {
            this.loadPlaylist(this.player.playlist);
        });
    }

    renderPopup()
    {
        return `<div class="inner_popup">
            <div class="header">
                <div class="name_chart">

                    <h2>Сейчас играет: </h2>
                    <h2 class="music_title"></h2>
                </div>
                <button class="close"></button>
            </div>

            <ul class="playlist inline_player_playlist_main">
            </ul>
        </div>
        `;
    }

    private initRepeat()
    {
        this.$context.find('button.repeat_playlist').on('click',() =>
        {
            this.player.repeat_playlist = ! this.player.repeat_playlist;
        });
    }

    private initShuffle()
    {
        this.$context.find('button.shuffle').on('click',() =>
        {
            this.shufflePlaylist();
        });
    }

    private shufflePlaylist()
    {
        this.open();

        let playlist_id = this.player.playlist.id;

        let playlist_new = PlayerPlaylist.shufflePlaylist(
            this.player.playlist,
            this.player.getIndexSongCurrent()
        );

        if (    playlist_id === playlist_new.id
            &&  playlist_new.songsPlayer.length > 2
        ) {
            this.shufflePlaylist();
        }

        this.player.loadSongPlayer(this.player.songPlayer, playlist_new);

        this.$context.trigger(PlayerPlaylist.EVENT_UPDATE_PLAYLIST);
    }


    private setActiveRepeat()
    {
        this.player.repeat_playlist
            ? this.$context.find('button.repeat_playlist').addClass('active')
            : this.$context.find('button.repeat_playlist').removeClass('active');
    }

    private disabled()
    {
        this.$context.addClass('disabled');
    }

    private loadPlaylist(playlist: Playlist)
    {
        this.$context.removeClass('disabled');

        if (playlist.id === this.playlist_id) return;

        this.$context.find('.playlist').empty();

        this._playlist_id = playlist.id;

        this.$context.find('.playlist').append(this.render(playlist));
        this.$context.find('.music_title').text(playlist.title);

        BtnPlayer.create(this.$context.find('.playlist'));
    }

    private get playlist_id()
    {
        return this._playlist_id;
    }

    private render(playlist: Playlist) {

        let html_playlist: string;

        playlist.songsPlayer.forEach((song_player: SongPlayer) =>
        {
            html_playlist = !html_playlist ? this.getHtml(song_player) : html_playlist + (this.getHtml(song_player));
        })

        html_playlist = html_playlist + '<div style="height: 80px"> </div>';

        return html_playlist;
    }
    private getHtml(song: SongPlayer): string
    {
        return `
            <li class="item item_playlist">
                <div class="popular-play">
                    <div class="btn_player">    
                        <button class="play popular-play__item"
                        data-song-id=" ${song.songId}"
                        data-url="${song.url}"
                        data-url_hq="${song.url_hq}"
                        >
                            <span class="icon-music-player-play icon-js"></span>
                        </button>
                        
                    </div>

                    <div class="song_title">
                        <div class="wrap_song popular-play-author" >
                            <a href="${song.urlSongPage}" class="inner_song">
                                ${song.songName}
                            </a>
                        </div>
                        <div class="wrap_author popular-play-composition">
                            ${song.artistHtml}
                        </div>
                    </div>
                </div>

                <div class="wrap_right">
                    <div class="song_time">
                        <span>${song.songTime}</span>
                    </div>

                    <div class="download elem">
                        <a class="download_song" href="${song.urlSongPage}">
                            <i></i>
                        </a>
                    </div>
                </div>
            </li>
        `;
    }

    private open()
    {
        $('body').find('.modal').show();

        this.$context.addClass('open');
    }

    private close()
    {
        this.$context.removeClass('open');

        $('body').find('.modal').hide();
    }

    private get isOpen()
    {
        return this.$context.hasClass('open');
    }


    private static shufflePlaylist(playlist: Playlist, index_active: number): Playlist
    {
        let playlist_copy = new Playlist(
            playlist.songsPlayer.map((song_player) =>
            {
                return Object.assign({}, song_player);
            }),
            playlist.title
        );

        let activeElement = playlist_copy.songsPlayer[index_active];

        delete playlist_copy.songsPlayer[index_active];

        playlist_copy.songsPlayer = PlayerPlaylist.shuffleArray(playlist_copy.songsPlayer);

        playlist_copy.songsPlayer.unshift(activeElement);

        return playlist_copy;
    }

    private static shuffleArray(array)
    {
        array = array.filter(element => element != null)

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }

        return array;
    }

    public static create($context = $('.b_player_playlist')): PlayerPlaylist
    {
        return new PlayerPlaylist($context);
    }
}