<?php
/** @var string $file_name */
/** @var string $clicks */
/** @var string $song_id */

$song_title = strstr($file_name, '.', true);

list($artist_name, $song_name) = explode(' - ', $song_title);
?>
<div class="music-popular-wrapper">
    <div class="music-popular__item">
        <div class="popular-play">

            <!-- todo добавить еще один дата атрибут с song_id, нужен везде, отказываемся от url в качестве song id -->
            <!-- todo добавить еще один дата атрибут с количеством прослушиваний, нужно для плейлиста-->
            <div
                class="btn_player"
                data-song_id="<?= rawurlencode($song_id); ?>"
                data-song_name="<?= htmlspecialchars($song_name); ?>"
                data-artist_html="<?= htmlspecialchars($artist_name)?>"
                data-url_song="/mp3s/<?= rawurlencode($file_name); ?>"
                data-url="/mp3s/<?= rawurlencode($file_name); ?>"
                data-clicks="<?= rawurlencode($clicks); ?>"
            >
                <button class="play"></button>
            </div>

            <div class="wrap_song">
                <a href="/mp3s/<?= rawurlencode($file_name); ?>" class="popular-play-author">
                    <?= htmlspecialchars($song_name); ?>
                </a>
                <div class="wrap_author">
                    <a href="#">
                        <?= htmlspecialchars($artist_name); ?>
                    </a>
                </div>
            </div>

            <div class="wrap_right">
                <div class="count_clicks">
                    <i></i>
                    <span><?= rawurlencode($clicks); ?></span>
                </div>

                <div class="download elem">
                    <a class="download_song" href="/mp3s/<?= rawurlencode($file_name); ?>">
                        <i></i>
                    </a>
                </div>
            </div>

        </div>
    </div>
</div>

<?php
unset($file_name);
