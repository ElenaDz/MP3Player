<div class="b_player_playlist">

    <div class="order">
        <button class="shuffle elem"></button>
        <button class="repeat_playlist elem"></button>
    </div>

    <button  class="playlist_btn elem"></button>

    <div class="popup">
        <div class="inner_popup">

            <div class="header">
                <div class="name_chart">Сейчас играет: Чарт</div>
                <button class="close"></button>
            </div>

            <ul class="playlist">
                <template>
                    <li class="item">
                        <div class="popular-play">
                            <div class="btn_player">
                                <button class="play"></button>
                            </div>

                            <div class="song_title">
                                <div class="wrap_song">
                                    <a href="#" class="inner_song">
                                        ${song.song_name}
                                    </a>
                                </div>
                                <div class="wrap_author">
                                    <a href="#">
                                        ${song.artist_html}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div class="wrap_download">
                            <div class="count_clicks">
                                <i></i>
                                <span>12345</span>
                            </div>

                            <div class="download elem">
                                <a class="download_song" href="{{song.song_name}}">
                                    <i></i>
                                </a>
                            </div>
                        </div>
                    </li>
                </template>

                <li class="item">
                    <div class="popular-play">
                        <div class="btn_player">
                            <button class="play"></button>
                        </div>

                        <div class="song_title">
                            <div class="wrap_song">
                                <a href="#" class="inner_song">
                                    song
                                </a>
                            </div>
                            <div class="wrap_author">
                                <a href="#">
                                    author
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="wrap_download">
                        <div class="count_clicks">
                            <i></i>
                            <span>12345</span>
                        </div>

                        <div class="download ">
                            <a class="download_song">
                                <i></i>
                            </a>
                        </div>
                    </div>
                </li>
            </ul>

        </div>
    </div>

</div>