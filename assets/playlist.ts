class Playlist
{
    private $context: JQuery;
    private player: Player;

    constructor($context: JQuery) {
        this.$context = $context;

        // @ts-ignore
        if (this.$context[0].Playlist) return this.$context[0].Playlist;

        // @ts-ignore
        this.$context[0].Playlist = this;

        this.player = Player.create();

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
            // fixme загрузка плейлиста должна быть вынесена в отдельную функцию load
            $('.inline_player_playlist_main').each((i, playlist) =>
            {
                let inline_playlist = $(playlist);

                // fixme мы не работаем с dom мы работаем с объектами, здесь как то полный треш обращение к какому то inline_player_playlist_main
                //  для которого у нас даже нету объекта
                if (inline_playlist.data('playlist_id') == this.player.playlist_id && this.$context.find('.playlist').empty()) {

                    let btns_player = BtnPlayer.create(inline_playlist.find('.btn_player'))

                    $(btns_player).each((i, btn_player: BtnPlayer) =>
                    {
                        // fixme использовать метод getSongPlayer
                        this.$context.find('.playlist').append(this.getHtml({
                            url: btn_player.url,
                            artistHtml: btn_player.artistHtml,
                            songName: btn_player.songName,
                            urlSong: btn_player.urlSong
                        }));
                    });
                }
            })
        });
    }

    // todo
    private load()
    {
        // данные какие именно песни загружать должно быть взяты из плеера, а туда они попадут из Btn Player
    }

    private getHtml(song: SongPlayer): string
    {
        return `
            <li class="item">
                <div class="popular-play">
                    <div class="btn_player">
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
                        <i></i>
                        <span>12345</span>
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

    public static create($context = $('.b_player_playlist')): Playlist
    {
        return new Playlist($context);
    }
}