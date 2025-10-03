// fixme не начинает играть следующая песня после того как закончила играть предыдущая ok
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

            // fixme не нужно выносить в отдельную функцию так как не представляю когда я должен захотеть ее вызывать
            // fixme и делать это нужно не здесь а когда сработало событие обновления repeat_playlist, то что собираешься
            //  помнить что каждый раз когда ты устанавливаешь repeat_playlist тебе нужно не забыть вызвать эту функцию? ok
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
        // fixme магия какая-то, просто сохрани здесь json плейлиста раз уж ты сравниваешь json ы ok
        const prev_playlist = JSON.stringify(this.player.playlist.songsPlayer)

        // fixme не правильно, ты должна перемешивать здесь копию плейлиста, а не тот плейлист что уже в плеере, так как
        //  мы хотим загружать плейлист с помощью метода loadPlaylist который как раз принимает аргумент playlist,
        //  а у тебя получает ты загружает тот же плейлист что ты уже перемешала получается ни какой загрузки на самом деле
        //  так как он уже там, все работает но логика нарушена, нужно делать правильно чтобы все работало правильно всегда, а не пока (ok)
        PlayerPlaylist.shufflePlaylist(this.player.playlist, this.player.getIndexSongCurrent());

        if (   prev_playlist == JSON.stringify(this.player.playlist.songsPlayer)
            &&  this.player.playlist.songsPlayer.length > 2
        ) {
            this.shufflePlaylist();
        }

        this.player.loadSongPlayer(this.player.songPlayer, this.player.playlist)
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
                            <!-- fixme на drivemusic ссылка при наведении меняет цвет, у тебя нет ок -->
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
                        <!-- todo это иконку можно взять на drivemusic она там сделана на css (не вижу клики, может убрали?) -->
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

        let activeElement = playlist.songsPlayer[active_index];

        delete playlist.songsPlayer[active_index];

        playlist.songsPlayer = PlayerPlaylist.shuffleArray(playlist.songsPlayer);

        playlist.songsPlayer.unshift(activeElement);

        return playlist
    }

    // fixme не правильно, этот метод просто перемешивает любой массив,
    //  он может быть использован в любом проекте где нужен shuffle, а ты перенесла сюда логику "всплывания" текущей песни
    //  на первое место, что специфично конкретно для этого проекта, для этой логики я завел метод shufflePlaylist выше, реализуй его (ok)
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