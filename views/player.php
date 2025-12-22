<div class="b_player">

    <div class="audio">
        <audio id="audio_player" controls="controls" preload="metadata"></audio>
    </div>

    <div class="inner_player">
        <div class="inner_controls">
            <?php require __DIR__ . '/player_controls.php'; ?>
            <?php require __DIR__ . '/player_playlist.php'; ?>
            <div class="stub"></div>
        </div>

        <?php require __DIR__ . '/player_progress.php'; ?>

        <div class="inner_setting">
<!--            --><?php //require __DIR__ . '/player_hq.php'; ?>
            <?php require __DIR__ . '/player_eq.php'; ?>
        </div>

        <?php require __DIR__ . '/player_volume.php'; ?>
        <?php require __DIR__ . '/player_info.php'; ?>
    </div>

    <div class="alert b_popup">
        <h3 class="title"></h3>
        <span class="msg"></span>
    </div>
</div>