
<div class="b_player_eq show">
    <button class="eq elem""></button>

    <div class="popup">
        <div class="inner_eq">

            <div class="music_presets">

                <!-- fixme заменить на foreach, json кодировать с помощью json_encode -->
                <!-- fixme так как у нас два списка пресетов, массив с пересетами нужно разбить на две части с помощью функции array_slice -->


                <form class="presets">
                    <?php
                    $styles = [
                        'Default' => 'По умолчанию',
                        'Disco' => 'Диско',
                        'Rok' => 'Рок',
                        'Dance' => 'Dance',
                        'Rap' => 'Рэп',
                        'Minimal' => 'Минимал',
                        'Funk' => 'Фонк'
                    ];
                    ?>

                    <?php foreach ($styles as $index => $style): ?>

                        <div class="preset">
                            <label>
                                <input
                                       data-preset="<?= $index?>"
                                       type="radio"
                                />
                                <span><?= $style?></span>
                            </label>
                        </div>
                    <?php endforeach; ?>

                    <div class="preset">
                        <label>
                            <input checked
                                    name="preset"
                                    data-preset='{"preamp": -0.5, "bands": [-0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -3.5, -3.5, -3.5, -4.5]}'
                                    type="radio"
                            />
                            <span>По умолчания</span>
                        </label>
                    </div>
                    <div class="preset">
                        <label>
                            <input
                                    name="preset"
                                    data-preamp="-3.36"
                                    data-bands="[-0.5, -0.5, 4, 2.5, 2.5, 2.5, 1.5, -0.5, -0.5, -0.5]"
                                    data-preset='{"preamp": -3.36, "bands": [-0.5, -0.5, 4, 2.5, 2.5, 2.5, 1.5, -0.5, -0.5, -0.5]}'
                                    type="radio"
                            />
                            <span>Диско </span>
                        </label>
                    </div>

                    <div class="preset">
                        <label >
                            <input
                                    name="preset"
                                    data-preamp="-2.84"
                                    data-bands="[4, 2.5, -0.5, -2.5, -2, -0.5, 4, 4.5, 4.5, 4]"
                                    data-preset='{"preamp": -2.36, "bands": [-0.5, -1, 4, 2.5, 2.5, 1, 1.5, -0.5, -0.5, -0.5]}'
                                    type="radio"
                            />
                            <span>Рок</span>
                        </label>
                    </div>

                    <div class="preset">
                        <label>
                            <input
                                    name="preset"
                                    data-preset='{"preamp": -4, "bands": [-0.5, -0.5, -4.5, 2.5, 3.4, 2.5, -3.5, -1.5, -4.5, -0.5]}'
                                    type="radio"
                            />
                            <span>Dance</span>
                        </label>
                    </div>

                    <div class="preset">
                        <label>
                            <input
                                    name="preset"
                                    data-preset='{"preamp": 3.12, "bands": [-2.6, -0.5, 1.5,  3.3, 1.5, -0.5, 2.5, -4.5, -2.8, -0.9]}'
                                    type="radio"
                            />
                            <span>Рэп</span>
                        </label>
                    </div>

                    <div class="inner_dots">
                        <button  class="dots elem"></button>
                        <div class="other_presets">

                            <div class="preset">
                                <label >
                                    <input
                                            name="preset"
                                            data-preset='{"preamp": -3.84, "bands": [2, 2.5, -0.5, -2.5, -2, -0.5, 4, -4.5, -4.5, 4]}'
                                            type="radio"
                                    />
                                    <span>Минимал</span>
                                </label>
                            </div>
                            <div class="preset">
                                <label >
                                    <input
                                            name="preset"
                                            data-preset='{"preamp": -3.84, "bands": [4.1, 2.5, -0.5, -2.5, -2, -0.5, 4, 4.5, 4.5, 4]}'
                                            type="radio"
                                    />
                                    <span>Фонк</span>
                                </label>
                            </div>
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