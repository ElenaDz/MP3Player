<?php

/** @var integer $value */
/** @var integer $value_min */
/** @var integer $value_max */

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="/assets/css/b_player_drive.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1.0, user-scalable=no">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet">

    <title>Проигрыватель</title>
</head>
<body>
<div class="b_player">
    <div class="btns_play">
        <div class="prev">
            <button>
                <span></span>
            </button>
        </div>
        <div class="play">
            <button>
                <span></span>
            </button>
        </div>
        <div class="next">
            <button>
                <span></span>
            </button>
        </div>
    </div>

    <div class="wrap_shuffle">
        <div class="shuffle">
            <button>
                <span></span>
            </button>
        </div>
        <div class="repeat_playlist">
            <button>
                <span></span>
            </button>
        </div>
    </div>

    <div class="playlist">
        <button>
            <span></span>
        </button>
    </div>

    <div class="progress">
        <div class="time_current">
            00:51
        </div>
        <div
                id="slider_"
                class="b_slider"
                data-value_min="0"
                data-value_max="100"
        >
            <div class="value" style="width: 50%;"></div>
        </div>

        <div class="time_duration">
            03:57
        </div>
    </div>

    <div class="wrap_hq">
        <div class="hq">
            <button>
                <span></span>
            </button>
        </div>

        <div class="equalizer">
            <button>
                <span></span>
            </button>
        </div>
    </div>

    <div class="volume">
        <button  class="volume_inner">
            <span></span>
        </button>

        <div
                id="slider_"
                class="b_slider"
                data-value_min="0"
                data-value_max="15"
        >
            <div class="value" style="width: 50%;"></div>
        </div>
    </div>
    <div class="info">

    </div>
    <div class="like">
        <button>
            <span></span>
        </button>
    </div>
    <div class="download">
        <a>
            <span></span>
        </a>
    </div>
    <div class="options">
        <button>
            <span></span>
        </button>
    </div>
</div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<script src="SliderView.ts"></script>
<script>
    $(function() {
        let slader = Slider.create()

    });
</script>
</body>
</html>