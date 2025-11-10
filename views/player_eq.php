<!-- fixme переименовать все связанное с эквалайзером с equalizer на eq (общепринятое сокращение) ok-->
<div class="b_player_eq ">
    <button class="eq elem""></button>

    <div class="popup">
        <div class="inner_eq">

            <div class="music_presets">
                <form class="presets">
                    <div class="preset">
                        <label>
                            <input
                                    data-preamp="-0.5"
                                    data-bands="[-0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -3.5, -3.5, -3.5, -4.5]"
                                    type="radio"/>
                            По умолчания
                        </label>
                    </div>
                    <div class="preset">
                        <label>
                            <input
                                    data-preamp="-3.36"
                                    data-bands="[-0.5, -0.5, 4, 2.5, 2.5, 2.5, 1.5, -0.5, -0.5, -0.5]"
                                    type="radio"/>
                            Диско
                        </label>
                    </div>

                    <div class="preset">
                        <label >
                            <input
                                    data-preamp="-3.84"
                                    data-bands="[4, 2.5, -0.5, -2.5, -2, -0.5, 4, 4.5, 4.5, 4]"
                                    type="radio"/>
                            Рок
                        </label>
                    </div>

                    <div class="preset">
                        <label>
                            <input
                                    data-preamp="-3.84"
                                    data-bands="[4, 2.5, -0.5, -2.5, -2, -0.5, 4, 4.5, 4.5, 4]"
                                    type="radio"/>
                            Dance
                        </label>
                    </div>

                    <div class="preset">
                        <label>
                            <input type="radio"/>
                            Рэп
                        </label>
                    </div>
                    <div class="inner_dots">
                        <button class="dots elem""></button>

                        <div class="other_presets">
                            <div class="preset">
                                <label >
                                    <input type="radio"/>
                                    Минимал
                                </label>
                            </div>
                            <div class="preset">
                                <label >
                                    <input type="radio"/>
                                    Фонк
                                </label>
                            </div>
                        </div>
                    </div>
                </form>

            </div>

            <div class="settings">
            <?php
             $frequencies = [
                 '0','60', '170', '310', '600', '1к', '3к', '6к', '12к', '14к', '16к'
             ]
            ?>
                            <!-- fixme заменить этот повторяющийся блок php циклом foreach ok -->

                <?php foreach ($frequencies as $index => $frequency): ?>
                <div class="setting"
                    <?php if($index == 0) : ?>
                     data-preamp="0"
                    <?php else: ?>
                     data-bands="0"
                    <?php endif; ?>
                    >
                    <div class="slider_eq">

                        <?php
                        $class = 'mini';
                        $value_min = 5;
                        $value_max = -5;
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