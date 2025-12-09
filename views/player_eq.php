
<div class="b_player_eq">
    <button class="eq elem""></button>

    <div class="b_popup">
        <div class="inner_eq">

            <div class="music_presets">
                <form class="presets">

                    <?php
                    $presets = [
                        'Custom' => 'Моя настройка',
                        'Default' => 'По умолчанию',
                        'Disco' => 'Диско',
                        'Rok' => 'Рок',
                        'Dance' => 'Dance',
                        'Rap' => 'Рэп',
                        'Minimal' => 'Минимал',
                        'Funk' => 'Фонк'
                    ];

//                    fixme если ширину экрана до 320 px сделать, то помещается только 3 пресета, чтобы был виден эквалзев полностью
                    $show = 5;

                    $presets_show = array_slice($presets, 0, $show+1);
                    $presets_hide = array_slice($presets, $show+1);
                    ?>
                    <?php foreach ($presets_show as $preset_id => $preset_name): ?>

                        <div class="preset <?= $preset_id == 'Custom' ? 'hide' : '' ?>">
                            <label>
                                <input
                                    name="preset"
                                    data-preset_name="<?= $preset_id?>"
                                    type="radio"
                                />
                                <span><?= $preset_name?></span>
                            </label>
                        </div>

                    <?php endforeach; ?>

                    <?php if (count($presets_hide) > 0) {
                        ?>
                        <div class="inner_dots">
                            <button  class="dots elem"></button>
                            <div class="other_presets">

                                <?php foreach ($presets_hide as $preset_id => $preset_name): ?>

                                    <div class="preset" <?= $preset_id == 'Custom' ? 'hide' : '' ?>>
                                        <label>
                                            <input
                                                    name="preset"
                                                    data-preset_name="<?= $preset_id?>"
                                                    type="radio"
                                            />
                                            <span><?= $preset_name?></span>
                                        </label>
                                    </div>

                                <?php endforeach; ?>

                            </div>
                        </div>
                    <?php } ?>

                </form>
            </div>

            <div class="settings">

                <div class="setting" style="width: 45px">
                    <div class="slider_eq preamp">
                        <?php
                        $class = 'mini';
                        $value_min = -5;
                        $value_max = 5;
                        $vertical = 'ver';
                        $value = 0;
                        require __DIR__.'/slider.php';
                        ?>
                    </div>

                    <span class="name">Уровень</span>
                </div>

                <?php
                 $frequencies = [
                     '60', '170', '310', '600', '1к', '3к', '6к', '12к', '14к', '16к'
                 ];
                ?>
                <?php foreach ($frequencies as $frequency): ?>

                    <div class="setting bands">
                        <div class="slider_eq">

                            <?php
                            $class = 'mini';
                            $value_min = -5;
                            $value_max = 5;
                            $vertical = 'ver';
                            $value = 0;
                            require __DIR__.'/slider.php';
                            ?>
                        </div>

                        <span class="name"><?= $frequency ?></span>
                    </div>

                <?php endforeach; ?>
            </div>

            <div class="close"><i></i></div>
        </div>
    </div>
</div>