<!-- fixme переименовать все связанное с эквалайзером с equalizer на eq (общепринятое сокращение) -->
<div class="b_player_equalizer ">
    <button class="eq elem""></button>

    <div class="popup">
        <div class="inner_eq">

            <div class="music_styles">
                <button>По умолчания</button>
                <button>Диско</button>
                <button>Рок</button>
                <button>Dance</button>
                <button>Рэп</button>
            </div>

            <div class="settings">

                <!-- fixme заменить этот повторяющийся блок php циклом foreach  -->
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

                    <span class="name">0</span>
                </div>

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
                    <span class="name">60</span>
                </div>

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
                    <span class="name">170</span>
                </div>

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
                    <span class="name">310</span>
                </div>

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
                    <span class="name">600</span>
                </div>

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
                    <span class="name">1k</span>
                </div>

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
                    <span class="name">3k</span>
                </div>

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
                    <span class="name">6k</span>
                </div>

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
                    <span class="name">12k</span>
                </div>

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
                    <span class="name">14k</span>
                </div>

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
                    <span class="name">16k</span>
                </div>

            </div>

            <div class="close"><i></i></div>
        </div>
    </div>
</div>