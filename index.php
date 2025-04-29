<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Mp3Player</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0, user-scalable=no">

    <link rel="stylesheet" href="<?= '/css/player.css?v='.filemtime(__DIR__.'/css/player.css'); ?>">
    <link rel="stylesheet" href="<?= '/css/btns_player.css?v='.filemtime(__DIR__.'/css/btns_player.css'); ?>">
</head>

<body>

    <?php
    $file_name = '5УТРА - Ромашки.mp3';
    require __DIR__ . '/assets/btns_player.php';

    $file_name = 'Niletto - Счастливым.mp3';
    require __DIR__ . '/assets/btns_player.php';

    $file_name = '5УТРА - Ромашки.mp3';
    require __DIR__ . '/assets/btns_player.php';
    ?>

    <div class="b_player">
        <div class="audio">
            <audio id="audio_player" controls="controls" preload="metadata"></audio>
        </div>

        <div class="inner_player">

            <div class="b_player_controls">
                <button class="prev elem" disabled></button>
                <button class="play elem"></button>
                <button class="next elem" disabled></button>
            </div>

            <div class="b_player_playlist">
                <div class="order">
                    <button class="shuffle elem"></button>
                    <button class="repeat_playlist elem"></button>
                </div>
                <button  class="playlist elem"></button>
            </div>

            <?php require __DIR__.'/assets/progress.php'; ?>

            <div class="b_player_volume">
                <button  class="volume_inner elem"></button>
                <?php
                $class = 'mini';
                $min = 0;
                $max = 1;
                require __DIR__.'/assets/slider.php';
                ?>
            </div>

            <div class="b_player_info">
                <div class="artist_img elem"></div>

                <div class="names">
                    <div class="song_name">
                        <a class="">Улетаю</a>
                    </div>
                    <div class="artist_name">
                       <a href="#">Маракеш</a>
                        feat. &nbsp
                        <a href="#">T1One</a>
                    </div>
                </div>
            </div>

            <div class="b_player_download elem">
                <a class="download">
                    <i></i>
                </a>
            </div>

        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
            integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
            crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    <script src="<?= '/js/slider.js?v='.filemtime(__DIR__.'/js/slider.js') ?>"></script>
    <script src="<?= '/js/player.js?v='.filemtime(__DIR__ . '/js/player.js') ?>"></script>
    <script src="<?= '/js/btns_player.js?v='.filemtime(__DIR__ . '/js/btns_player.js') ?>"></script>
    <script src="<?= '/js/controls.js?v='.filemtime(__DIR__ . '/js/controls.js') ?>"></script>
    <script src="<?= '/js/progress.js?v='.filemtime(__DIR__ . '/js/progress.js') ?>"></script>
    <script src="<?= '/js/volume.js?v='.filemtime(__DIR__ . '/js/volume.js') ?>"></script>
    <script>
        $(function() {
			// fixme слайдер должен создавать плеер как и все другие компоненты из которых он состоит ok
            let slider = Slider.create();
            let controls = Controls.create();
            let progress = Progress.create();
            let volume = Volume.create();
            let btns_player = BtnsPlayer.create();
        });
    </script>
</body>
</html>