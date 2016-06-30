var MainContext = (function () {
    function MainContext() {
        this.timeScale = 1;
        this.container = null;
    }

    MainContext.prototype.setObjectContainer = function(container) {
    	this.container = container;
    }

    MainContext.prototype.run = function() {
		var me = this;
		var oldTime = Date.now();

		function doEnter() {
			var currentTime = Date.now();
			var advanceTime = currentTime - oldTime;

			me.renderLoop(advanceTime);
        	dragonBones.WorldClock.clock.advanceTime(advanceTime / 1000);

			window.requestAnimationFrame(doEnter);
			oldTime = currentTime;
		}

		window.requestAnimationFrame(doEnter);
	}

	MainContext.prototype.setScale = function(scaleX, scaleY) {
		this.container.scaleX = scaleX;
		this.container.scaleY = scaleY;
	}

	MainContext.prototype.setPosition = function(x, y) {
		this.container.x = x;
		this.container.y = y;
	}

    MainContext.prototype.renderLoop = function (canvas) {
        this.container.updateTransform(canvas);
    }

    return MainContext;
})();

MainContext.instance = new MainContext;
