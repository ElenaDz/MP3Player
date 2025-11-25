
<div class="b_player_eq show">
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
                        // fixme нельзя так писать, бывает верблюжья нотация, а бывает подчеркивания, а тут и то и то ok
                        // fixme я просил для этого использовать имя custom ok
                        // fixme мои настройки отображаются на выпадающем списке, а не должны на сколько я понял ok
                        'Minimal' => 'Минимал',
                        'Funk' => 'Фонк'
                    ];


                    // fixme не корректно работает, 4 показывает 4, а 6 показывает 5, проблема с скрытом пункте в середине списка,
                    //  должно работать так, 4 должно показывать 4, а 6 должно показывать 6 ok
                    // fixme плохое имя переменной, лучше show ok
                    $show = 5;

                    // fixme нотация подчеркивания для переменных ok
                    // fixme лучше styles show ( сделала со словом presets)
                    $presets_show = array_slice($presets, 0, $show+1);
                    // fixme лучше styles hide ( сделала со словом presets)
                    $presets_hide = array_slice($presets, $show+1);

                    // fixme index не подходящее имя подумай какое имя переменной здесь правильное ok
                    ?>
                    <?php foreach ($presets_show as $preset_name_eng => $preset_name_rus): ?>

                        <div class="preset <?= $preset_name_eng == 'Custom' ? 'hide' : '' ?>">
                            <label>
                                <input
                                    name="preset"
                                    data-preset_name="<?= $preset_name_eng?>"
                                    type="radio"
                                />
                                <span><?= $preset_name_rus?></span>
                            </label>
                        </div>

                    <?php endforeach; ?>

                    <div class="inner_dots">
                        <button  class="dots elem"></button>
                        <div class="other_presets">

                            <?php foreach ($presets_hide as $preset_name_eng => $preset_name_rus): ?>

                                <div class="preset" <?= $preset_name_eng == 'Custom' ? 'hide' : '' ?>>
                                    <label>
                                        <input
                                            name="preset"
                                            data-preset_name="<?= $preset_name_eng?>"
                                            type="radio"
                                        />
                                        <span><?= $preset_name_rus?></span>
                                    </label>
                                </div>

                            <?php endforeach; ?>

                        </div>
                    </div>

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