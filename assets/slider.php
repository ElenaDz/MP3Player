<?php
/** @var integer $value */
/** @var integer $value_min */
/** @var integer $value_max */
/** @var boolean $vertical */
/** @var string $class */

if (
    ! is_null($value)
    &&  ! is_null($value_min)
    &&  ! is_null($value_max)
) {
    $range = $value_max - $value_min;
    $value_rate = ($value - $value_min) / $range;

    $value_pct = $value_rate * 100;
}
?>

<div
        class="b_slider <?= $vertical ? 'ver' : null; ?> <?= $class; ?>"

    <?php if (is_null($value_pct)): ?>

        data-value="<?= $value; ?>"

    <?php endif; ?>

    <?php if ( ! is_null($value_min)): ?>

        data-value_min="<?= $value_min; ?>"

    <?php endif; ?>

    <?php if ( ! is_null($value_max)): ?>

        data-value_max="<?= $value_max; ?>"

    <?php endif; ?>
>
    <div class="slider">
        <div
                class="value"
                style="<?=
                ( $value_pct )
                    ? $vertical ? "height: {$value_pct}%" : "width: {$value_pct}%"
                    : null;
                ?>"
        >
            <div class="thumb"></div>
        </div>
    </div>

</div>
