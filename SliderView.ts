
enum SliderEvents
{
	ValueUpdate = 'SliderEventValueUpdate',
	StopMove    = 'SliderEventStopMove',
	StartMove   = 'SliderEventStartMove'
}

class Slider
{
	private static SELECTOR = '.b_slider';

	public context:JQuery;

	private _start_move:boolean = false;

	private _value_min:number;
	private _value_max:number;


	constructor(context)
	{
		this.context = context;

		this.context.data('Slider', this);

		this.init();

		this.context.on(
			SliderEvents.StartMove,
			() => {
				$('body').css('user-select', 'none');
			}
		);

		this.context.on(
			SliderEvents.StopMove,
			() => {
				$('body').css('user-select', 'inherit');
			}
		);
	}

	public static create(context)
	{
		let sliders = [];

		$(this.SELECTOR, context).each((index, elem) =>
		{
			console.log(elem)
			sliders.push(new this($(elem)));
		});

		return sliders;
	}


	private init()
	{
		this.context.mousedown((e:JQueryMouseEventObject) =>
		{
			if (e.which !== 1) return;

			this.start_move = true;

			this.position = e.offsetX;

			return this;
		});

		$('body')
			.mouseup((e:JQueryMouseEventObject) =>
			{
				if (e.which !== 1 || ! this.start_move) return;

				this.start_move = false;

				return this;
			})
			.mousemove((e:JQueryMouseEventObject) =>
			{
				if ( ! this.start_move) return;

				let position = e.pageX - this.context.offset().left ;

				this.position = position;
			});
	}


	get value_min()
	{
		return this._value_min || this.context.data('value_min') || 0;
	}

	set value_min(value)
	{
		this._value_min = value;
	}


	get value_max()
	{
		return this._value_max || this.context.data('value_max') || this.position_max;
	}

	set value_max(value)
	{
		this._value_max = value;
	}


	get value()
	{
		let position = this.position;
		let position_rate = position / this.position_max;

		let range = this.value_max - this.value_min;

		return (range * position_rate) + this.value_min;
	}

	set value(value:number)
	{
		if (this.start_move) return;

		if (value < this.value_min || value > this.value_max) {
			throw new RangeError();
		}

		let range = this.value_max - this.value_min;
		let value_rate = ((value - this.value_min) / range);

		let position = value_rate * this.position_max;

		if (this.position === position) return;

		this.position = position;
	}


	public get start_move()
	{
		return this._start_move;
	}

	public set start_move(value)
	{
		if (this.start_move === true && value === false)
		{
			this.context.trigger(SliderEvents.StopMove);
		}

		if (this.start_move === false && value === true)
		{
			this.context.trigger(SliderEvents.StartMove);
		}

		this._start_move = value;
	}


	private get position()
	{
		let position = this.context.find('.value').data('position');

		return position || this.context.find('.value').width();
	}

	private set position(position)
	{
		position = position < 0 ? 0 : position;
		position = position > this.position_max ? this.position_max : position;

		if (position === this.position) return;

		this.context.find('.value').width(position+'px');
		this.context.find('.value').data('position', position);

		this.context.trigger(SliderEvents.ValueUpdate);
	}


	private get position_max()
	{
		return this.context.width();
	}
}