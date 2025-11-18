
<div class="b_player_eq show">
    <button class="eq elem""></button>

    <div class="b_popup">
        <div class="inner_eq">

            <div class="music_presets">

                <!-- fixme заменить на foreach, json кодировать с помощью json_encode  ok-->
                <!-- fixme так как у нас два списка пресетов, массив с пересетами нужно разбить на две части с помощью функции array_slice  ok-->


                <form class="presets">
                    <?php
                    $styles = [
                        'Default' => 'По умолчанию',
                        'Disco' => 'Диско',
                        'Rok' => 'Рок',
                        'Dance' => 'Dance',
                        'Rap' => 'Рэп',
                        'My_options' => 'Моя настройка',
                        'Minimal' => 'Минимал',
                        'Funk' => 'Фонк'
                    ];

                    $offset = 6;
                    $stylesTo = array_slice($styles, 0, $offset);
                    $stylesAfter = array_slice($styles, $offset);
                    ?>

                    <?php foreach ($stylesTo as $index => $style): ?>

                        <div class="preset <?= $index == 'My_options' ? 'hide' : '' ?>">
                            <label>
                                <input
                                        name="preset"
                                        data-preset_name="<?= $index?>"
                                        type="radio"
                                />
                                <span><?= $style?></span>
                            </label>
                        </div>
                    <?php endforeach; ?>

                    <div class="inner_dots">
                        <button  class="dots elem"></button>
                        <div class="other_presets">

                            <?php foreach ($stylesAfter as $index => $style): ?>

                                <div class="preset">
                                    <label>
                                        <input
                                                name="preset"
                                                data-preset_name="<?= $index?>"
                                                type="radio"
                                        />
                                        <span><?= $style?></span>
                                    </label>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </form>
            </div>

            <div class="settings">

                <div class="setting" style="width: 45px">
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

                    <span class="name">Уровень</span>
                </div>

                <?php
                 $frequencies = [
                     '60', '170', '310', '600', '1к', '3к', '6к', '12к', '14к', '16к'
                 ];
                ?>
                <?php foreach ($frequencies as $index => $frequency): ?>

                    <div class="setting">
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