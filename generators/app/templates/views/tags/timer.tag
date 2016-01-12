<timer>
	<div id='timer'>
		<div>
			<div>{minute}</div>
			<div>Minutes</div>
		</div>
		<div>
			<div>{second}</div>
			<div>Seconds</div>
		</div>
	</div>

	<script>
	    this.time;
		this.state = 0;
		this.timer = null;

	    this.tick = (function () {
	    	this.time.subtract(1, 'second');
	    	this.update({
	    		hour : this.time.hours(),
				minute : this.beautifyTime(this.time.minutes()),
				second : this.beautifyTime(this.time.seconds())
	    	});
			if (this.time == 0) {
				console.log('timer done');
				this.stop();
                this.done();
			}
	    }).bind(this);

	    this.on('unmount', function () {
	        console.info('timer cleared');
	        clearInterval(this.timer);
	    });

	    start(newTime, callback) {
            this.done = callback;
	    	this.time = moment.duration(newTime, 'seconds');
	    	this.update({
	    		hour : this.time.hours(),
				minute : this.beautifyTime(this.time.minutes()),
				second : this.beautifyTime(this.time.seconds()),
				state: 1
	    	});
	    	this.timer = setInterval(this.tick, 1000);
	    }

	    beautifyTime(time) {
	    	return time < 10 ? '0'+ time : time;
	    }

	    stop() {
			console.log('stop');
	    	clearInterval(this.timer);
	    	this.timer = null;
			this.state = 0;
	    }

		window.onunload = function (e) {
			this.stop();
		}.bind(this);
	</script>
</timer>
