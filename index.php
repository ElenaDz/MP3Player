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
<div>
    <h2 class="music-title"> Заголовок 2</h2>
    <div class="inline_player_playlist_main">
        <?php
        $file_name = '5УТРА - Ромашки.mp3';
        $file_name_hq = '5УТРА - Ромашки 320.mp3';
        $song_id = '1';
        $clicks = 1;
        require __DIR__ . '/views/btn_player.php';

        $song_id = '2';
        $clicks = 2;
        $file_name = 'Niletto - Счастливым (длинное название).mp3';
        $file_name_hq = 'Niletto - Счастливым 320.mp3';
        require __DIR__ . '/views/btn_player.php';

        $song_id = '4';
        $clicks = 3;
        $file_name = '5УТРА - Test.mp3';
        $file_name_hq = '5УТРА - Test 320.mp3';
        require __DIR__ . '/views/btn_player.php';

        $file_name = 'А-Студио - Так же как все.mp3';
        $file_name_hq = 'А-Студио - Так же как все  320.mp3';
        $song_id = '3';
        $clicks = 4;
        require __DIR__ . '/views/btn_player.php';
        ?>
    </div>
</div>

<hr>
<div>
    БызфтЮ
    <h2 class="music-title"> Заголовок 1</h2>
    <div class="inline_player_playlist_main">
        <?php
        $file_name = 'Niletto - Счастливым (длинное название).mp3';
        $file_name_hq = 'Niletto - Счастливым 320.mp3';
        $song_id = '2';
        $clicks = 2;
        require __DIR__ . '/views/btn_player.php';

        $file_name = '5УТРА - Ромашки.mp3';
        $file_name_hq = '5УТРА - Ромашки 320.mp3';
        $song_id = '1';
        $clicks = 3;
        require __DIR__ . '/views/btn_player.php';

        //
        $file_name = 'А-Студио - Так же как все.mp3';
        $file_name_hq = 'А-Студио - Так же как все  320.mp3';
        $song_id = '3';
        $clicks = 4;
        require __DIR__ . '/views/btn_player.php';
        ?>
    </div>

</div>

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
	        __DIR__ . '/js/player_eq.js'
        ],
	    __DIR__ . '/js/player.one_file.js'
    );
?>

    <script src="<?= $getUrl(__DIR__ . '/js/player.one_file.js'); ?>"></script>
    <script>
        $(function() {
            BtnPlayer.create($('body'));
        });
    </script>
</body>
</html>

<!-- здесь что-то новое -->