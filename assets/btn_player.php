<?php
/** @var string $file_name */

$song_title = strstr($file_name, '.', true);

list($artist_name, $song_name) = explode(' - ', $song_title);
?>
<div class="popular-play">

	<div class="btn_player" data-url="/mp3s/<?= rawurlencode($file_name); ?>">
		<button class="play"></button>
	</div>

	<div class="popular-play-name">
		<a href="#" class="popular-play-author">
			<?= htmlspecialchars($song_name); ?>
		</a>
		<div class="popular-play-composition">
			<a href="#">
				<?= htmlspecialchars($artist_name); ?>
			</a>
		</div>
	</div>

</div>

<?php
unset($file_name);
