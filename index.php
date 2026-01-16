<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Mp3Player</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0, user-scalable=no">

	<?php
	$getUrl = function ($file_path)
	{
		$_file_path = realpath($file_path);
        if (empty($_file_path)) {
            throw new Exception(
                sprintf(
                    'Файл не найден "%s"',
	                $file_path
                )
            );
        }

		$url = substr(
			$_file_path,
			strlen(realpath(__DIR__))
		);

		$url = str_replace('\\', '/', $url);

		return $url.'?v='.(new \DateTime())->setTimestamp(filemtime($_file_path))->format('Y-m-d_H:i:s');
	}
	?>
    <link rel="stylesheet" href="<?= $getUrl(__DIR__.'/css/player.css'); ?>">
    <link rel="stylesheet" href="<?= $getUrl(__DIR__.'/css/btn_player.css'); ?>">
</head>

<body>

<div class="song-author-btn-box">
    <a class="song-author-btn btn-play">
        <span class="icon-music-player-play"></span>
        Слушать
    </a>
    <a href="https://d11.drivemusic.me/dl/ji74HkWb6AsAIjjw5BJbDQ/1766867218/download_music/2014/05/oleg-gazmanov-detstvo-mojo.mp3" class="song-author-btn btn-download">
        <span class="icon-download-arrow-with-bar"></span>
        Скачать
        <span class="add_word">
            mp3
        </span>
    </a>
</div>

<hr>

<div class="c-playlist-content__controls">
    <button class="c-button js-btn-play-playlist">
        <span class="icon-music-player-play"></span>
        <span class="text-listen">
            Слушать
        </span>
    </button>

    <button
            aria-label="Перемешать список"
            title="Перемешать список"
            class="c-button c-button--shuffle js-btn-shuffle">
        <span class="icon-image icon-image--shuffle"></span>
    </button>
</div>

<div>
    <h1 class="music-title"> Заголовок 2</h1>
    <div class="inline_player_playlist_main">
        <?php
        $file_name = '5УТРА - Ромашки.mp3';
        $file_name_hq = '5УТРА - Ромашки 320.mp3';
        $song_id = '1';
        $clicks = 1;
        $url_song_img = '/img/artist.webp';
        require __DIR__ . '/views/btn_player.php';

        $file_name = '5УТРА - Этой песни нету.mp3';
        $file_name_hq = '5УТРА - Этой песни нету 320.mp3';
        $song_id = '771';
        $clicks = 1;
        $url_song_img = '/img/artist.webp';
        require __DIR__ . '/views/btn_player.php';

        $song_id = '2';
        $clicks = 2;
        $file_name = 'Niletto - Счастливым (длинное название).mp3';
        $file_name_hq = 'Niletto - Счастливым 320.mp3';
        $url_song_img = null;
        require __DIR__ . '/views/btn_player.php';

        $file_name = 'Мояк - Песня 2.mp3';
        $file_name_hq = 'Мояк - Песня 2.mp3';
        $song_id = '12';
        $clicks = 1;
        $url_song_img = '/img/artist.webp';
        require __DIR__ . '/views/btn_player.php';

        $file_name = 'Мояк - Дубль тест.mp3';
        $file_name_hq = 'Мояк - Дубль тест.mp3';
        $song_id = '19';
        $clicks = 1;
        $url_song_img = '/img/artist.webp';
        require __DIR__ . '/views/btn_player.php';

        $file_name = '5УТРА - Ромашки.mp3';
        $file_name_hq = '5УТРА - Ромашки 320.mp3';
        $song_id = '9';
        $clicks = 1;
        $url_song_img = '/img/artist.webp';
        require __DIR__ . '/views/btn_player.php';

        $file_name = 'А-Студио - Так же как все.mp3';
        $file_name_hq = 'А-Студио - Так же как все  320.mp3';
        $song_id = '13';
        $clicks = 4;
        $url_song_img = null;
        require __DIR__ . '/views/btn_player.php';

        $song_id = '15';
        $clicks = 2;
        $file_name = 'Niletto - Счастливым (длинное название).mp3';
        $file_name_hq = 'Niletto - Счастливым 320.mp3';
        $url_song_img = null;
        require __DIR__ . '/views/btn_player.php';

        $file_name = 'Мояк - Песня 2.mp3';
        $file_name_hq = 'Мояк - Песня 2.mp3';
        $song_id = '10';
        $clicks = 1;
        $url_song_img = '/img/artist.webp';
        require __DIR__ . '/views/btn_player.php';

        $file_name = 'Мояк - Дубль тест.mp3';
        $file_name_hq = 'Мояк - Дубль тест.mp3';
        $song_id = '29';
        $clicks = 1;
        $url_song_img = '/img/artist.webp';
        require __DIR__ . '/views/btn_player.php';

        $file_name = 'А-Студио - Так же как все.mp3';
        $file_name_hq = 'А-Студио - Так же как все  320.mp3';
        $song_id = '3';
        $clicks = 4;
        $url_song_img = null;
        require __DIR__ . '/views/btn_player.php';

        $file_name = 'Мояк - Дубль тест.mp3';
        $file_name_hq = 'Мояк - Дубль тест.mp3';
        $song_id = '329';
        $clicks = 1;
        $url_song_img = '/img/artist.webp';
        require __DIR__ . '/views/btn_player.php';

        $file_name = 'Мояк - Песня 2.mp3';
        $file_name_hq = 'Мояк - Песня 2.mp3';
        $song_id = '1554';
        $clicks = 1;
        $url_song_img = '/img/artist.webp';
        require __DIR__ . '/views/btn_player.php';

        $file_name = 'А-Студио - Так же как все.mp3';
        $file_name_hq = 'А-Студио - Так же как все  320.mp3';
        $song_id = '366';
        $clicks = 4;
        $url_song_img = null;
        require __DIR__ . '/views/btn_player.php';

        $song_id = '1544';
        $clicks = 2;
        $file_name = 'Niletto - Счастливым (длинное название).mp3';
        $file_name_hq = 'Niletto - Счастливым 320.mp3';
        $url_song_img = null;
        require __DIR__ . '/views/btn_player.php';

        $file_name = 'Мояк - Песня 2.mp3';
        $file_name_hq = 'Мояк - Песня 2.mp3';
        $song_id = '1034';
        $clicks = 1;
        $url_song_img = '/img/artist.webp';
        require __DIR__ . '/views/btn_player.php';

        $file_name = 'Мояк - Дубль тест.mp3';
        $file_name_hq = 'Мояк - Дубль тест.mp3';
        $song_id = '2229';
        $clicks = 1;
        $url_song_img = '/img/artist.webp';
        require __DIR__ . '/views/btn_player.php';
        ?>
    </div>
</div>

<hr>

<hr>
<?php require __DIR__ . '/views/player.php'; ?>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<?php
    require 'builder.php';

    builder_assets(
        [
	        __DIR__ . '/js/slider.js',
	        __DIR__ . '/js/playlist.js',
	        __DIR__ . '/js/player.js',
	        __DIR__ . '/js/btn_player.js',
	        __DIR__ . '/js/player_controls.js',
	        __DIR__ . '/js/player_progress.js',
	        __DIR__ . '/js/player_volume.js',
	        __DIR__ . '/js/player_info.js',
	        __DIR__ . '/js/player_playlist.js',
	        __DIR__ . '/js/player_hq.js',
	        __DIR__ . '/js/eq.js',
	        __DIR__ . '/js/player_eq.js',
	        __DIR__ . '/js/btn_playlist.js'
        ],
	    __DIR__ . '/js/player.one_file.js'
    );
?>

    <script src="<?= $getUrl(__DIR__ . '/js/player.one_file.js'); ?>"></script>
    <script>
        $(function() {
            BtnPlayer.create($('body'));
            BtnPlaylist.create($('body'));
        });
    </script>
</body>
</html>