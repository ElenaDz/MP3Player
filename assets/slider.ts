
enum SliderEvents
{
	ValueUpdate = 'SliderEventValueUpdate',
	StopMove    = 'SliderEventStopMove',
	StartMove   = 'SliderEventStartMove'
}

class Slider
{
	private static SELECTOR = '.b_slider';

	public $context:JQuery;

	private _start_move:boolean = false;
	private _offset_left:number = null;
	private _offset_top:number = null;
	private _value:number;


	public static create($context:JQuery = $('body'))
	{
		let sliders = [];

		$(this.SELECTOR, $context).each((index, elem) =>
		{
			sliders.push(new this($(elem)));
		});

		return sliders;
	}

	private constructor($context:JQuery)
	{
		this.$context = $context;

		if (this.$context.data('Slider')) return this.$context.data('Slider');

		this.$context.data('Slider', this);

		this.value = this.$context.data('value');

		this.$context.mousedown((e:JQueryMouseEventObject) =>
		{
			if (e.which !== 1) return;

			this.start_move = true;

			this.value_pct = this.getValuePctFromEvent(e);

			$(window)
				.on('mousemove.slider', (e:JQueryMouseEventObject) =>
				{
					if ( ! this.start_move) return;

					this.value_pct = this.getValuePctFromEvent(e);
				});

			return this;
		});

		$(window)
			.on('mouseup', (e:JQueryMouseEventObject) =>
			{
				if (e.which !== 1 || ! this.start_move) return;

				this.start_move = false;

				$(window).off('mousemove.slider')

				return this;
			});

		this.$context.on(
			SliderEvents.StartMove,
			() => {
				$('body').css('user-select', 'none');
			}
		);

		this.$context.on(
			SliderEvents.StopMove,
			() => {
				$('body').css('user-select', 'inherit');
			}
		);
	}


	public set vertical(vertical:boolean)
	{
		if (vertical) {
			this.$context.addClass('ver');
		} else {
			this.$context.removeClass('ver');
		}
	}

	public get vertical()
	{
		return this.$context.hasClass('ver');
	}


	public set disabled(disabled:boolean)
	{
		if (disabled) {
			this.$context.addClass('disabled');

		} else {
			this.$context.removeClass('disabled');
		}
	}

	public get disabled()
	{
		return this.$context.hasClass('disabled');
	}


	public get value_min()
	{
		return parseFloat(this.$context.data('value_min')) || 0;
	}

	public set value_min(value_min:number)
	{
		if (this.value_min == value_min) return;

		this.$context.data('value_min', value_min);

		this.value = this._value;
	}


	public get value_max()
	{
		return parseFloat(this.$context.data('value_max')) || 1;
	}

	public set value_max(value_max:number)
	{
		if (this.value_max == value_max) return;

		this.$context.data('value_max', value_max);

		this.value = this._value;
	}


	public get value()
	{
		return (this.value_max - this.value_min) * (this.value_pct / 100) + this.value_min;
	}

	public set value(value:number)
	{
		if (this.start_move) return;

		if (value < this.value_min || value > this.value_max) {
			throw new RangeError();
		}

		let range = this.value_max - this.value_min;
		let value_rate = ((value - this.value_min) / range);

		this.value_pct = value_rate * 100;
	}

	private get value_pct()
	{
		return (this.length_value / this.length_slider) * 100;
	}


	private set value_pct(value_pct:number)
	{
		value_pct = value_pct < 0 ? 0 : value_pct;
		value_pct = value_pct > 100 ? 100 : value_pct;

		if (value_pct === this.value_pct && this._value === this.value) return;

		let $value = this.$context.find('.value');
		if (this.vertical) {
			$value.height(value_pct+'%');
		} else {
			$value.width(value_pct+'%');
		}

		this._value = this.value;

		this.$context.trigger(SliderEvents.ValueUpdate);
	}


	private get start_move()
	{
		return this._start_move;
	}

	private set start_move(value)
	{
		if (this.start_move === true && value === false)
		{
			this.$context.trigger(SliderEvents.StopMove);
		}

		if (this.start_move === false && value === true)
		{
			this.$context.trigger(SliderEvents.StartMove);
		}

		this._start_move = value;
	}


	private get length_value()
	{
		let $value = this.$context.find('.value');

		return this.vertical ? $value.height() : $value.width();
	}

	private get length_slider()
	{
		let $slider = this.$context.find('.slider');

		return this.vertical ? $slider.height() : $slider.width();
	}


	private getValuePctFromEvent(e:JQueryMouseEventObject)
	{
		let offset = this.vertical
			? e.pageY - this.$context.offset().top - this.offset_top
			: e.pageX - this.$context.offset().left - this.offset_left;

		return (offset / this.length_slider) * 100;
	}

	private get offset_left()
	{
		if (this._offset_left === null) {
			this._offset_left = parseInt(getComputedStyle(this.$context.find('.slider')[0]).borderLeft) || 0;
		}
		return this._offset_left;
	}

	private get offset_top()
	{
		if (this._offset_top === null) {
			this._offset_top = parseInt(getComputedStyle(this.$context.find('.slider')[0]).borderTop) || 0;
		}
		return this._offset_top;
	}
}