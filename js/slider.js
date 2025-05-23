var SliderEvents;
(function (SliderEvents) {
    SliderEvents["ValueUpdate"] = "SliderEventValueUpdate";
    SliderEvents["StopMove"] = "SliderEventStopMove";
    SliderEvents["StartMove"] = "SliderEventStartMove";
})(SliderEvents || (SliderEvents = {}));
class Slider {
    static create($context = $('body')) {
        let sliders = [];
        $(this.SELECTOR, $context).each((index, elem) => {
            sliders.push(new this($(elem)));
        });
        return sliders;
    }
    constructor($context) {
        this._start_move = false;
        this._offset_left = null;
        this._offset_top = null;
        this.$context = $context;
        if (this.$context.data('Slider'))
            return this.$context.data('Slider');
        this.$context.data('Slider', this);
        this.value = this.$context.data('value');
        this.$context.mousedown((e) => {
            if (e.which !== 1)
                return;
            this.start_move = true;
            this.value_pct = this.getValuePctFromEvent(e);
            $(window)
                .on('mousemove.slider', (e) => {
                if (!this.start_move)
                    return;
                this.value_pct = this.getValuePctFromEvent(e);
            });
            return this;
        });
        $(window)
            .on('mouseup', (e) => {
            if (e.which !== 1 || !this.start_move)
                return;
            this.start_move = false;
            $(window).off('mousemove.slider');
            return this;
        });
        this.$context.on(SliderEvents.StartMove, () => {
            $('body').css('user-select', 'none');
        });
        this.$context.on(SliderEvents.StopMove, () => {
            $('body').css('user-select', 'inherit');
        });
    }
    set vertical(vertical) {
        if (vertical) {
            this.$context.addClass('ver');
        }
        else {
            this.$context.removeClass('ver');
        }
    }
    get vertical() {
        return this.$context.hasClass('ver');
    }
    set disabled(disabled) {
        if (disabled) {
            this.$context.addClass('disabled');
        }
        else {
            this.$context.removeClass('disabled');
        }
    }
    get disabled() {
        return this.$context.hasClass('disabled');
    }
    get value_min() {
        return parseFloat(this.$context.data('value_min')) || 0;
    }
    set value_min(value_min) {
        if (this.value_min == value_min)
            return;
        this.$context.data('value_min', value_min);
        this.value = this._value;
    }
    get value_max() {
        return parseFloat(this.$context.data('value_max')) || 1;
    }
    set value_max(value_max) {
        if (this.value_max == value_max)
            return;
        this.$context.data('value_max', value_max);
        this.value = this._value;
    }
    get value() {
        return (this.value_max - this.value_min) * (this.value_pct / 100) + this.value_min;
    }
    set value(value) {
        if (this.start_move)
            return;
        if (value < this.value_min || value > this.value_max) {
            throw new RangeError();
        }
        let range = this.value_max - this.value_min;
        let value_rate = ((value - this.value_min) / range);
        this.value_pct = value_rate * 100;
    }
    get value_pct() {
        return (this.length_value / this.length_slider) * 100;
    }
    set value_pct(value_pct) {
        value_pct = value_pct < 0 ? 0 : value_pct;
        value_pct = value_pct > 100 ? 100 : value_pct;
        if (value_pct === this.value_pct && this._value === this.value)
            return;
        let $value = this.$context.find('.value');
        if (this.vertical) {
            $value.height(value_pct + '%');
        }
        else {
            $value.width(value_pct + '%');
        }
        this._value = this.value;
        this.$context.trigger(SliderEvents.ValueUpdate);
    }
    get start_move() {
        return this._start_move;
    }
    set start_move(value) {
        if (this.start_move === true && value === false) {
            this.$context.trigger(SliderEvents.StopMove);
        }
        if (this.start_move === false && value === true) {
            this.$context.trigger(SliderEvents.StartMove);
        }
        this._start_move = value;
    }
    get length_value() {
        let $value = this.$context.find('.value');
        return this.vertical ? $value.height() : $value.width();
    }
    get length_slider() {
        let $slider = this.$context.find('.slider');
        return this.vertical ? $slider.height() : $slider.width();
    }
    getValuePctFromEvent(e) {
        let offset = this.vertical
            ? e.pageY - this.$context.offset().top - this.offset_top
            : e.pageX - this.$context.offset().left - this.offset_left;
        return (offset / this.length_slider) * 100;
    }
    get offset_left() {
        if (this._offset_left === null) {
            this._offset_left = parseInt(getComputedStyle(this.$context.find('.slider')[0]).borderLeft) || 0;
        }
        return this._offset_left;
    }
    get offset_top() {
        if (this._offset_top === null) {
            this._offset_top = parseInt(getComputedStyle(this.$context.find('.slider')[0]).borderTop) || 0;
        }
        return this._offset_top;
    }
}
Slider.SELECTOR = '.b_slider';
