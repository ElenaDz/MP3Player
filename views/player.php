<div class="b_player">

    <div class="audio">
        <audio id="audio_player" controls="controls"  crossorigin="anonymous" preload="metadata"></audio>
    </div>

    <div class="inner_player">
        <div class="inner_controls">
            <?php require __DIR__ . '/player_controls.php'; ?>
            <?php require __DIR__ . '/player_playlist.php'; ?>
            <div class="stub"></div>
        </div>

        <?php require __DIR__ . '/player_progress.php'; ?>

        <div class="inner_setting">
            <!-- здесь подключить hq-->
            <?php require __DIR__ . '/player_eq.php'; ?>
        </div>

        <?php require __DIR__ . '/player_volume.php'; ?>
        <?php require __DIR__ . '/player_info.php'; ?>
    </div>

</div>
<div class="modal"></div>
<div class="main-music" style="width: 800px"></div>