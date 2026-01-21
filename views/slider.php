<?php
/** @var integer $value */
/** @var integer $value_min */
/** @var integer $value_max */
/** @var boolean $vertical */
/** @var string  $class */

if (
        ! is_null($value)
    &&  ! is_null($value_min)
    &&  ! is_null($value_max)
) {
    $range = $value_max - $value_min;
    $value_rate = ($value - $value_min) / $range;
    $value_pct = $value_rate * 100;
}

$data_value = "";
$data_value_min = "";
$data_value_max = "";
if (is_null($value_pct)) {
    if ($value) {
        $data_value = " data-value=".$value;
    }
}

if (!is_null($value_min)) {
    $data_value_min = " data-value_min=".$value_min;
}

if (!is_null($value_max)) {
    $data_value_max = " data-value_max=".$value_max  ;
}
$slider_style = $vertical ? ' ver' : '';
$slider_style.= $class ?' '.$class : '';
?>

<div
    class="b_slider disabled<?= $slider_style; ?>"<?= $data_value; ?><?= $data_value_min; ?><?= $data_value_max; ?>>
    <div class="slider">
        <div
            class="value"<?php if ($value_pct): ?>
                style="<?=
                ( $value_pct )
                    ? $vertical ? "height: {$value_pct}%" : "width: {$value_pct}%"
                    : null;
                ?>"<?php endif; ?>>
            <div class="thumb"></div>
        </div>
    </div>

</div>
