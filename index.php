<?php

/** @var integer $value */
/** @var integer $value_min */
/** @var integer $value_max */

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/assets/css/player.css?v=<?= filemtime(__DIR__.'/assets/css/player.css') ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0, user-scalable=no">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet">

    <title>Проигрыватель</title>
</head>
<body>
<div class="b_player d_flex_center">
    <div class="inner_player">
        <div class="b_player_controls d_flex_center">
            <button class="prev element_min_player"></button>
            <button class="play element_min_player"></button>
            <button class="next element_min_player"></button>
        </div>

        <div class="b_player_playlist_order d_flex_center">
            <button class="shuffle  element_min_player"></button>
            <button class="repeat_playlist element_min_player"></button>
        </div>

        <div class="b_player_playlist">
            <button  class="playlist element_min_player"></button>
        </div>

        <div class="b_player_progress d_flex_center">
            <div class="time_current">00:51</div>
            <div
                    id="slider_progress"
                    class="b_slider"
                    data-value_min="0"
                    data-value_max="100"
            >

                <div class="slider"></div>
                <div class="value" style="width: 50%;"></div>
            </div>

            <div class="time_duration">03:57</div>
        </div>

        <div class="b_player_hq d_flex_center">
            <div class="hq element_min_player ">
                <!-- Не нужны здесь кнопки пока -->
            </div>

            <button class="equalizer element_min_player">
            </button>
        </div>

        <div class="b_player_volume mini d_flex_center ">
            <button  class="volume_inner element_min_player"></button>

            <div
                    id="slider_volume"
                    class="b_slider"
                    data-value_min="0"
                    data-value_max="16"
            >

                <div class="slider"></div>
                <div class="value" style="width: 50%;"></div>
            </div>
        </div>
        <div class="b_player_info d_flex_center">
            <div class="artist_img d_flex_center element_min_player"></div>

            <div class="names d_flex_center">
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

        <div class="b_player_like">
            <button class="like element_min_player"></button>
        </div>

        <div class="b_player_download d_flex_center element_min_player">
            <a class="download  d_flex_center">
                <i></i>
            </a>
        </div>

        <div class="b_player_options">
            <button class="options element_min_player"></button>
        </div>
    </div>
</div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<script src="/assets/js/slider.js?v=<?= filemtime(__DIR__.'/assets/js/slider.js') ?>"></script>
<script>
    $(function() {
        let slider = Slider.create()

    });
</script>
</body>
</html>