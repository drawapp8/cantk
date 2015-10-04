var MainContext = (function () {
    function MainContext() {
        this.timeScale = 1;
    	this.drawList = [];
        this.container = null;
        this.rendererContext = null;
        this.texture_scale_factor = 1;
    }

    MainContext.PHASE_DRAW = 'draw';
    MainContext.PHASE_TRANSFORM = 'updateTransform';

    MainContext.prototype.setRenderContext = function(context) {
    	this.rendererContext = context; 
    }

    MainContext.prototype.setObjectContainer = function(container) {
    	this.container = container;	
    }

    MainContext.prototype.addDraw = function(callback, thisObject) {
    	this.drawList.push({callback: callback, thisObject: thisObject});
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
    	this.init(canvas);
        this.startRender();
        MainContext._renderLoopPhase = MainContext.PHASE_TRANSFORM;
        this.container._updateTransform();
        MainContext._renderLoopPhase = MainContext.PHASE_DRAW;
        MainContext.instance.draw(this);
        this.endRender();
    }

    MainContext.prototype.draw = function (context) {
        var length = this.drawList.length;
        for (var i = 0; i < length; i++) {
            var cmd = this.drawList[i];
            context.canvasContext.save();
            cmd.callback.call(cmd.thisObject, context);
            context.canvasContext.restore();
        }
        this.drawList.length = 0;

        return;
    }

    return MainContext;
})();

MainContext.instance = new MainContext;
