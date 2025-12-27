<?php
/** @var string $file_name */
/** @var string $file_name_hq */
/** @var string $clicks */
/** @var string $song_id */
/** @var string $url_song_img */

$song_title = strstr($file_name, '.', true);

list($artist_name, $song_name) = explode(' - ', $song_title);
?>
<div class="music-popular-wrapper">
    <div class="music-popular__item" style="display: flex">
        <div class="popular-play">

            <div
                class="btn_player"
            >
                <button class="play popular-play__item icon-music-player-pla js-btn-play-playlist song-author-btn"
                        data-song-id="<?= rawurlencode($song_id); ?>"
                        data-url="/mp3s/<?= rawurlencode($file_name); ?>"
                        data-url_hq="/mp3s/<?= rawurlencode($file_name_hq); ?>"
                ></button>
            </div>

            <div class="wrap_song popular-play-name">
                <a href="/mp3s/<?= rawurlencode($file_name); ?>" class="popular-play-author">
                    <?= htmlspecialchars($song_name); ?>
                </a>
                <div class="wrap_author popular-play-composition">
                    <a href="">
                        <?= htmlspecialchars($artist_name); ?>
                    </a>
                </div>
            </div>
        </div>

        <div class="popular-download" style="margin-left: 20px">
            <div class="popular-download-number">
                <span class="time-hover">04:44</span>
            </div>

            <a href="<?= rawurlencode($file_name); ?>" class="popular-download-link">
                <span class="icon-download-arrow-with-bar"></span>
                <span class="popular-download-text" style="display: none">Скачать</span>
            </a>
        </div>
    </div>
</div>

<?php
unset($file_name);

