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

<div class="inline_player_playlist_main">
    <?php
    $file_name = '5УТРА - Ромашки.mp3';
    require __DIR__ . '/assets/btn_player.php';

    $file_name = 'Niletto - Счастливым (длинное название).mp3';
    require __DIR__ . '/assets/btn_player.php';

    $file_name = '5УТРА - Ромашки.mp3';
    require __DIR__ . '/assets/btn_player.php';

    // fixme заблокирована кнопка скачивания песни, а не должна
    $file_name = '5УТРА - Test.mp3';
    require __DIR__ . '/assets/btn_player.php';
    ?>
</div>


<hr>

<div class="inline_player_playlist_main">
    <?php
    $file_name = '5УТРА - Ромашки.mp3';
    require __DIR__ . '/assets/btn_player.php';

    $file_name = 'Niletto - Счастливым (длинное название).mp3';
    require __DIR__ . '/assets/btn_player.php';
    ?>
</div>

    <div class="b_player">

        <div class="audio">
            <audio id="audio_player" controls="controls" preload="metadata"></audio>
        </div>

        <div class="inner_player">

	        <?php require __DIR__.'/assets/controls.php'; ?>

	        <?php require __DIR__.'/assets/playlist.php'; ?>

            <?php require __DIR__.'/assets/progress.php'; ?>

            <?php require __DIR__.'/assets/volume.php'; ?>

            <?php require __DIR__.'/assets/info.php'; ?>

        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<?php
    require 'builder.php';

    builder_assets(
        [
	        __DIR__ . '/js/slider.js',
	        __DIR__ . '/js/player.js',
	        __DIR__ . '/js/btn_player.js',
	        __DIR__ . '/js/controls.js',
	        __DIR__ . '/js/progress.js',
	        __DIR__ . '/js/volume.js',
	        __DIR__ . '/js/info.js',
	        __DIR__ . '/js/playlist.js'
        ],
	    __DIR__ . '/js/player.one_file.js'
    );
?>

    <script src="<?= $getUrl(__DIR__ . '/js/player.one_file.js'); ?>"></script>
    <script>
        $(function() {
            BtnPlayer.create();
        });
    </script>
</body>
</html>