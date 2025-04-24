<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="<?= '/css/player.css?v='.filemtime(__DIR__.'/css/player.css'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0, user-scalable=no">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet">

    <title>Mp3Player</title>
</head>

<body>
<div class="b_player ">
    <div class="inner_player">

        <div class="b_player_controls ">
            <button class="prev elem"></button>
            <button class="play elem"></button>
            <button class="next elem"></button>
        </div>

        <div class="b_player_playlist">
            <div class="order">
                <button class="shuffle  elem"></button>
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
                    <a class="">Улетаю yf rhskmz[</a>
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
<script>
    $(function() {
        let slider = Slider.create()
    });
</script>
</body>
</html>