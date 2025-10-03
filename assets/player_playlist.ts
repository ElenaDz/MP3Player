
class PlayerPlaylist
{
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

        this.player = Player.create();

        this.player.$context.on(Player.EVENT_ERROR, () =>
        {
            this.disabled();
        });

        this.player.$context.on(Player.EVENT_UPDATE_REPEAT_PLAYLIST, () =>
        {
            this.setActiveRepeat();
        });

        this.initPlaylist();
        this.initRepeat();
        this.initShuffle();
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

        this.player.$context.on(Player.EVENT_LOADED_META_DATA,() =>
        {
            this.loadPlaylist(this.player.playlist);
        });
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

            this.loadPlaylist(this.player.playlist);
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

        this.player.loadSongPlayer(this.player.songPlayer, playlist_new);

        if (    playlist_id === playlist_new.id
            &&  playlist_new.songsPlayer.length > 2
        ) {
            this.shufflePlaylist();
        }
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

        playlist.songsPlayer.forEach((song_player: SongPlayer) =>
        {
            this.$context.find('.playlist')
                .append(this.getHtml(song_player))
        })

        this.$context.find('.music_title').text(playlist.title);

        BtnPlayer.create(this.$context.find('.playlist'));
    }

    private get playlist_id()
    {
        return this._playlist_id;
    }

    private getHtml(song: SongPlayer): string
    {
        return `
            <li class="item">
                <div class="popular-play">
                    <div
                        class="btn_player"
                        data-song_id=" ${song.songId}"
                        data-song_name=" ${song.songName}"
                        data-artist_html="${song.artistHtml}"
                        data-url_song="${song.urlSong}"
                        data-url="${song.url}"
                        data-clicks="${song.clicks}"
                    >    
                        <button class="play"></button>
                    </div>

                    <div class="song_title">
                        <div class="wrap_song">
                            <a href="#" class="inner_song">
                                ${song.songName}
                            </a>
                        </div>
                        <div class="wrap_author">
                            <a href="#">
                                ${song.artistHtml}
                            </a>
                        </div>
                    </div>
                </div>

                <div class="wrap_right">
                    <div class="count_clicks">
                        <!-- todo это иконку можно взять на drivemusic она там сделана на css (ищи класс .icon-vol2) -->
                        <i></i>
                        <span>${song.clicks}</span>
                    </div>

                    <div class="download elem">
                        <a class="download_song" href="${song.urlSong}">
                            <i></i>
                        </a>
                    </div>
                </div>
            </li>
        `;
    }

    private open()
    {
        this.$context.addClass('open');
    }

    private close()
    {
        this.$context.removeClass('open');
    }

    private get isOpen()
    {
        return this.$context.hasClass('open');
    }


    private static shufflePlaylist(playlist: Playlist, active_index: number): Playlist
    {
        let playlist_copy = new Playlist(playlist.songsPlayer, playlist.title);

        let activeElement = playlist_copy.songsPlayer[active_index];

        delete playlist_copy.songsPlayer[active_index];

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