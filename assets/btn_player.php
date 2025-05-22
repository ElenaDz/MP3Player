<?php
/** @var string $file_name */

$song_title = strstr($file_name, '.', true);

list($artist_name, $song_name) = explode(' - ', $song_title);
?>
<div class="popular-play">

	<div
        class="btn_player"
        data-song_name="<?= htmlspecialchars($song_name); ?>"
        data-artist_html="<?= htmlspecialchars($artist_name)?>"
        data-url_song="/mp3s/<?= rawurlencode($file_name); ?>"
        data-url="/mp3s/<?= rawurlencode($file_name); ?>"
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

</div>
<?php
unset($file_name);
