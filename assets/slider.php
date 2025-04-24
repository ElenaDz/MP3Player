<?php
/** @var string $class */
/** @var int $min */
/** @var int $max */
?>

<div
	class="b_slider <?= $class; ?>"
	<?= isset($min) ? 'data-value_min="'.$min.'"' : ''; ?>
	<?= isset($max) ? 'data-value_max="'.$max.'"' : ''; ?>
>
	<div class="slider"></div>
	<div class="value" style="width: 50%;"></div>
</div>

<?php
unset($class);
unset($min);
unset($max);
