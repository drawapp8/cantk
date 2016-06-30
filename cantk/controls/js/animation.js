/*
 * File: ui_animation.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: ui animation.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

//////////////////////////////////////////////////

VelocityTracker.prototype.HISTORY_SIZE = 20;
VelocityTracker.prototype.HORIZON = 200 * 1000000;
VelocityTracker.prototype.MIN_DURATION = 10 * 1000000;

function Movement() {
	this.eventTime = 0;
	this.point = new Point(0, 0);

	this.getPoint = function() {
		return this.point;
	}

	return this;
}

function VelocityTracker() {
    this.clear();

    return this;
}

VelocityTracker.prototype.clear = function() {
    this.index = 0;
	
	var HISTORY_SIZE = this.HISTORY_SIZE;
    if(!this.movements) {
		this.movements = new Array();
		for(var i = 0; i < HISTORY_SIZE; i++) {
			this.movements.push(new Movement());
		}
    }

	for(var i = 0; i < HISTORY_SIZE; i++) {
		var iter = this.movements[i];
		iter.eventTime = 0;
		iter.point = {x:0, y:0};
	}

    return;
}

VelocityTracker.prototype.addMovement = function(eventTime, point) {
    if (++this.index == this.HISTORY_SIZE) {
        this.index = 0;
    }

    this.movements[this.index].eventTime = eventTime;
    this.movements[this.index].point = point;

    return;
}

VelocityTracker.prototype.getVelocity = function() {
	var velocity = {x:0, y:0};

	this.estimate();

	velocity.x = this.xVelocity;
	velocity.y = this.yVelocity;

	return velocity;
}

VelocityTracker.prototype.estimate = function() {
	var HORIZON = this.HORIZON;
	var MIN_DURATION = this.MIN_DURATION;
	var HISTORY_SIZE = this.HISTORY_SIZE;
    var newestMovement = this.movements[this.index];
    var minTime = newestMovement.eventTime - HORIZON;
    var oldestIndex = this.index;
    var numTouches = 1;

    do {
        var nextOldestIndex = (oldestIndex == 0 ? HISTORY_SIZE : oldestIndex) - 1;
        var nextOldestMovement = this.movements[nextOldestIndex];
        if (nextOldestMovement.eventTime < minTime) {
            break;
        }
        oldestIndex = nextOldestIndex;
    } while (++numTouches < HISTORY_SIZE);

    var accumVx = 0;
    var accumVy = 0;
    var index = oldestIndex;
    var samplesUsed = 0;
    var oldestMovement = this.movements[oldestIndex];
   	var oldestPosition = oldestMovement.getPoint();
    var lastDuration = 0;

    while (numTouches-- > 1) {
        if (++index == HISTORY_SIZE) {
            index = 0;
        }
        var movement = this.movements[index];
        var duration = movement.eventTime - oldestMovement.eventTime;

        if (duration >= MIN_DURATION) {
            var position = movement.getPoint();
            var scale = 1000000000.0 / duration; // one over time delta in seconds
            var vx = (position.x - oldestPosition.x) * scale;
            var vy = (position.y - oldestPosition.y) * scale;
            accumVx = (accumVx * lastDuration + vx * duration) / (duration + lastDuration);
            accumVy = (accumVy * lastDuration + vy * duration) / (duration + lastDuration);
            lastDuration = duration;
            samplesUsed += 1;
        }
    }

    // Report velocity.
    if (samplesUsed) {
		this.xVelocity = accumVx;
		this.yVelocity = accumVy;
    } else {
		this.xVelocity = 0;
		this.yVelocity = 0;
    }

    return true;
}

function testVelocityTracker() {
	var v = null;
	var vt = new VelocityTracker();
	function toNs(ms) {
		return ms * 1000000;
	}

	for(var i = 0; i < 20; i++) {
		vt.addMovement(toNs(10 * i), {x:10*i, y:10*i*i/2});
	}

	v = vt.getVelocity();

	console.log("xv: " + v.x + " yv: " + v.y);

	return;
}

//testVelocityTracker();

//////////////////////////////////////////////////////////////////////

/**
 * @class Interpolator 
 * 插值算法接口。它的基本功能就是将时间进度(0-1)变换成任务实际进度(0,1)，重而实现加速，减速，先加速再减速和回弹等效果。
 */
function Interpolator() {

/**
 * @method get 
 * 获取任务实际进度。
 * @param {Number} percent 时间进度(0-1)。
 * @return {Number} 返回任务实际进度。
 */
	this.get = function(percent) {
		return 0;
	}

	return this;
}

/**
 * @class Interpolator 
 * 插值算法接口。它的基本功能就是将时间进度(0-1)变换成任务实际进度(0,1)，重而实现加速，减速，先加速再减速和回弹等效果。
 */
function LinearInterpolator() {
	this.get = function(percent) {
		return percent;
	}

	return this;
}

/**
 * @method create 
 * 创建插值算法对象。
 * @param {String} name 插值算法的名称。
 * @return {Interpolator} 返回插值算法对象。
 *
 *     @example small frame
 *     //创建线形插值算法（l|linear):
 *     var interpolator = Interpolator.create('l');
 *     //创建回弹插值算法 (b|bounce)
 *     var interpolator = Interpolator.create('b');
 *     //创建加速插值算法 (a|accelerate)
 *     var interpolator = Interpolator.create('a');
 *     //创建先加速再加速插值算法(ad|accelerate-decelerate)
 *     var interpolator = Interpolator.create('ad');
 *     //创建减速插值算法(d|decelerate)
 *     var interpolator = Interpolator.create('d');
 */
Interpolator.create = function(name, args) { 
	return AnimationFactory.createInterpolator(name, args);	
}

function BounceInterpolator() {
	function bounce(percent) {
		return 8 * percent * percent;
	}

	this.get = function(percent) {
		percent *= 1.1226;
        if (percent < 0.3535) return bounce(percent);
        else if (percent < 0.7408) return bounce(percent - 0.54719) + 0.7;
        else if (percent < 0.9644) return bounce(percent - 0.8526) + 0.9;
        else return bounce(percent - 1.0435) + 0.95;
	}

	return this;
}

function AccelerateInterpolator() {
	this.get = function(percent) {
		return percent * percent;
	}

	return this;
}

function AccDecelerateInterpolator() {
	this.get = function(percent) {
		return ((Math.cos((percent + 1) * Math.PI) / 2.0) + 0.5);
	}

	return this;
}

function DecelerateInterpolator(factor) {
	this.factor = factor ? factor : 2;
	this.get = function(percent) {
		if(this.factor === 1) {
			return (1.0 - (1.0 - percent) * (1.0 - percent));
		}
		else {
			return (1.0 - Math.pow((1.0 - percent), 2 * this.factor));
		}
	}

	return this;
}

function SineAccelerateInterpolator() {
	this.get = function(percent) {
		return -Math.cos(percent * (Math.PI / 2)) + 1;
	}

	return this;
}

function SineAccDecelerateInterpolator() {
	this.get = function(percent) {
		return (-0.5 * (Math.cos(Math.PI * percent) - 1));
	}

	return this;
}

function SineDecelerateInterpolator() {
	this.get = function(percent) {
		return Math.sin(percent * (Math.PI / 2));
	}

	return this;
}

//////////////////////////////////////////////////////////////////////
function AnimationFactory() {
	this.createAnimation = function(name, duration) {
		UIElement.getMainCanvasScale(true);
		var defaultDuration = isIPhone() ? 400 : 600;
		duration = duration ? duration : defaultDuration;
		switch(name) {
			case "anim-forward": {
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationHTranslate(true);
				animation.toLeft();
				animation.init(duration, interpolator);
				break;
			}
			case "anim-backward": {
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationHTranslate(false);
				animation.toRight();
				animation.init(duration, interpolator);
				break;
			}
			case "anim-upward": {
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationVTranslate(true);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-downward": {
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationVTranslate(false);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-scale-show-win": {
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationScale(true);
				animation.setRange(0.9, 1.0);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-scale-hide-win": {
				var interpolator =  new AccelerateInterpolator();
				animation = new AnimationScale(false);
				animation.setRange(1.0, 0.9);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-scale-show-dialog": {
				duration = duration ? duration : 300;
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationScale(true);
				animation.setRange(0.9, 1.0);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-scale-hide-dialog": {
				duration = duration ? duration : 300;
				var interpolator =  new AccelerateInterpolator();
				animation = new AnimationScale(false);
				animation.setRange(1.0, 0.9);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-fade-in": {
				var interpolator =  new AccelerateInterpolator();
				animation = new AnimationAlpha(true);
				animation.setRange(0.1, 1.0);
				animation.init(800, interpolator);
				break;
			}
			case "anim-fade-out": {
				var interpolator =  new AccelerateInterpolator();
				animation = new AnimationAlpha(false);
				animation.setRange(1.0, 0.1);
				animation.init(300, interpolator);
				break;
			}
			case "anim-move-up": {
				var interpolator =  new DecelerateInterpolator();
				animation = new AnimationMove(true);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-move-down": {
				var interpolator =  new AccelerateInterpolator();
				animation = new AnimationMove(false);
				animation.init(duration, interpolator);
				break;
			}
		}
		
		return animation;
	}

	return this;
}

AnimationFactory.createInterpolator = function(name, args) {
	switch(name) {
		case 'l': 
		case 'linear': {
			return new LinearInterpolator();
		}
		case 'b':
		case 'bounce': {
			return new BounceInterpolator();
		}
		case 'a':
		case 'accelerate': {
			return new AccelerateInterpolator();
		}
		case 'ad':
		case 'accelerate-decelerate': {
			return new AccDecelerateInterpolator();
		}
		case 'sa':
		case 'sine-accelerate': {
			return new SineAccelerateInterpolator();
		}
		case 'sd':
		case 'sine-decelerate': {
			return new SineDecelerateInterpolator();
		}
		case 'sad':
		case 'sine-accelerate-decelerate': {
			return new SineAccDecelerateInterpolator();
		}
		default: {
			return new DecelerateInterpolator();
		}
	}
}

AnimationFactory.create = function(name, duration) {
	if(!AnimationFactory.instance) {
		AnimationFactory.instance = new AnimationFactory();
	}

	return AnimationFactory.instance.createAnimation(name, duration);
}

Animation.getCanvas = function() {
    return UIElement.getMainCanvas();
}

function Animation(showWin) {
	this.scale = 1;
	this.visible = false;
	this.showWin = showWin;

	this.init = function(duration, interpolator) {
		this.duration = duration ? duration : 500;
		this.interpolator = interpolator;

		return;
	}

    this.setWins = function(oldWin, newWin) {
        this.oldWin = oldWin;
        this.newWin = newWin;
        this.wm = oldWin.getWindowManager();
    }

	this.setRectOfFront = function(x, y, w, h) {
		this.frontX = x;
		this.frontY = y;
		this.frontW = w;
		this.frontH = h;

		return;
	}

	this.setScale = function(scale) {
		this.scale = scale;

		return;
	}

	this.prepare = function(x, y, w, h, onFinish) {
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.w = Math.round(w);
		this.h = Math.round(h);
		this.onFinish = onFinish;

		this.setRectOfFront(0, 0, w, h);

		this.show();

		return true;
	}

	this.show = function() {
		var w = this.w * this.scale;
		var h = this.h * this.scale;

		this.visible = true;
		this.canvasElement = Animation.getCanvas();

		return true;
	}

	this.hide = function() {
		this.visible = false;
		if(this.canvasElement && this.canvasElement.parentNode) {
			this.canvasElement = null;
		}

		return true;
	}

	this.getTimePercent = function() {
		var date = new Date();
		var elapsed = date.getTime() - this.startTime;

		return elapsed/this.duration;
	}

	this.getPercent = function(timePercent) {
		return this.interpolator.get(timePercent);	
	}

	this.step = function(percent) {
		/*Overwrite it*/
		return true;
	}
	
	this.beforeRun = function() {
		/*Optional Overwrite it*/
		return true;
	}
	
	this.afterRun = function() {
		/*Optional Overwrite it*/
		return true;
	}

	this.drawBackground = function(canvas) {
		return;
	}

	this.doStep = function(percent) {
		this.canvas.save();
		this.canvas.scale(this.scale, this.scale);
		this.step(percent);
		this.canvas.restore();

		return;
	}
	
	this.run = function() {
		var date = new Date();
		var animation = this;
		this.startTime = date.getTime();
		animation.isFirstStep = true;

		this.beforeRun();
		WWindowManager.getInstance().setPaintEnable(false); 
		this.wm.setEnable(false); 
		function animStep() {
			var percent = 0;
			var timePercent = animation.getTimePercent();

			if(timePercent < 1) {
				percent = animation.getPercent(timePercent);
				animation.doStep(percent);

				requestAnimationFrame(animStep);
			}
			else {
				animation.cleanup();
				animation.afterRun();
				WWindowManager.getInstance().setPaintEnable(true);
				console.log("Animation done.");
			}
			animation.isFirstStep = false;
		}
		
		animStep();

		return;
	}

	this.cleanup = function() {
		var animation = this;
		var onFinish = this.onFinish;

		setTimeout(function() {
			animation.hide();
		    animation.wm.setEnable(true); 
		}, 100);

		if(onFinish) {
			onFinish();
		}
	}

	this.hide();

	return this;
}

function setElementPosition(element, x, y) {
	var scale = UIElement.getMainCanvasScale();

	x = x/scale.x;
	y = y/scale.y;
	element.style.position = "absolute";
	element.style.left = Math.round(x) + "px";
	element.style.top = Math.round(y) + "px";
	element.style["opacity"] = 1.0;

	return;
}

function moveElement(element, x, y) {
	setElementPosition(element, x, y);

	return;
}

function alphaElement(element, opacity) {
	element.style["opacity"] = opacity;

	return;
}

function showElement(element) {
	element.style["opacity"] = 1;
}

function hideElement(element) {
	element.style["opacity"] = 0;
}

function scaleElement(element, scale, opacity, xOrigin, yOrigin) {
	var origin = (xOrigin && yOrigin) ? xOrigin + " " + yOrigin : "50% 50%";
	var transforms = ["transform", "-ms-transform", "-webkit-transform", "-o-transform", "-moz-transform"];

	element.style['transform-style'] = "preserve-3d";
	for(var i = 0; i < transforms.length; i++) {
		var trans = transforms[i];
		element.style[trans + "-origin"] = origin;
		element.style[trans] = "scale("+scale+")";
	}
	element.style["opacity"] = opacity;

	return;
}

function rotateElement(element, deg) {
	var origin = "50% 50%";
	var transforms = ["transform", "-ms-transform", "-webkit-transform", "-o-transform", "-moz-transform"];

	element.style['transform-style'] = "preserve-3d";
	for(var i = 0; i < transforms.length; i++) {
		var trans = transforms[i];
		element.style[trans + "-origin"] = origin;
		element.style[trans] = "rotate("+deg+"deg)";
	}

	return;
}

function AnimationVTranslate(showWin) {
	Animation.apply(this, arguments);

	this.beforeRun = function() {
		this.range = this.frontH;
		this.canvas = this.canvasElement.getContext("2d");

		return true;;
	}

	this.step = function(percent) {
 		var x = this.frontX;
		var y = this.frontY;
		var w = this.frontW;
		var dy = this.range * percent;
		var h = this.showWin ? dy : (this.range - dy);		
		var oy = this.showWin ? (this.frontY + this.range - dy) : (this.frontY + dy);

        var canvas = this.canvas;
        canvas.save();
        var wm = this.oldWin.getWindowManager();
        canvas.translate(wm.x, wm.y);
 
        if(this.showWin) {
            canvas.translate(0, oy - this.h);
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.oldWin.paintSelf(canvas);
            canvas.restore();

            canvas.translate(0, this.h);
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.newWin.paintSelf(canvas);
            canvas.restore();
        } else {
            canvas.translate(0, oy - this.h);
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.newWin.paintSelf(canvas);
            canvas.restore();
            
            canvas.translate(0, this.h);
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.oldWin.paintSelf(canvas);
            canvas.restore();
        }
        canvas.restore();
    
		return true;
	}
}

function AnimationHTranslate() {
	Animation.apply(this, arguments);
	
	this.leftToRight = true;

	this.beforeRun = function() {
		var range = this.newWin.w;
	
		this.range = range;

		this.start = range - this.range;
		this.canvas = this.canvasElement.getContext("2d");
	}

	this.toLeft = function() {
		this.leftToRight = true;

		return;
	}
	
	this.toRight = function() {
		this.leftToRight = false;

		return;
	}

	this.step = function(percent) {
		var ox = 0;
        if(this.leftToRight) {
			ox = this.start + this.range * percent;
		}
		else {
			ox = this.w - this.range * percent - this.start;
		}

		if(this.lastOffset === ox) {
			return true;
		}
        var canvas = this.canvas;
        canvas.save();
        var wm = this.oldWin.getWindowManager();
        canvas.translate(wm.x, wm.y);

        if(this.leftToRight) {
            canvas.translate(-ox, 0); 
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.oldWin.paintSelf(canvas);
			canvas.restore();

            canvas.translate(this.w, 0); 
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.newWin.paintSelf(canvas);
			canvas.restore();
        } else {
            canvas.translate(-ox, 0); 
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.newWin.paintSelf(canvas);
			canvas.restore();

            canvas.translate(this.w, 0); 
            canvas.save();
        	canvas.clipRect(0, 0, this.w, this.h);
            this.oldWin.paintSelf(canvas);
			canvas.restore();
        }
        canvas.restore();
		this.lastOffset = ox;
		return true;
	}
}

function AnimationScale() {
	Animation.apply(this, arguments);

	this.to = 1.0;
	this.from = 0;
	this.frontX = 0;
	this.frontY = 0;
	this.frontW = 0;
	this.frontH = 0;

	this.setRange = function(from, to) {
		this.to = to;
		this.from = from;

		return;
	}

	this.beforeRun = function() {
		this.canvas = this.canvasElement.getContext("2d");
	}

	this.step = function(percent) {
		var scale = this.from + percent * (this.to - this.from);
		var alpha = this.to > this.from ? percent : (1-percent);
		var canvas = this.canvas;
        var dx = (this.w >> 1);
        var dy = (this.h >> 1);
        
        canvas.save();
        var wm = this.oldWin.getWindowManager();
        canvas.translate(wm.x, wm.y);
        canvas.clipRect(0, 0, this.w, this.h);
        
        if(this.to > this.from) { 
            this.oldWin.paintSelf(canvas);

            canvas.globalAlpha = alpha; 
            canvas.translate(dx, dy);
            canvas.scale(scale, scale);
            canvas.translate(-dx, -dy);
            this.newWin.paintSelf(canvas);
        } else {
            this.newWin.paintSelf(canvas);

            canvas.globalAlpha = alpha; 
            canvas.translate(dx, dy);
            canvas.scale(scale, scale);
            canvas.translate(-dx, -dy);
            this.oldWin.paintSelf(canvas);
        }
        canvas.restore();
		//console.log("Step: " + percent + " alpha=" + alpha + " scale=" + scale);
		return true;
	}
}

function AnimationAlpha() {
	Animation.apply(this, arguments);

	this.to = 1.0;
	this.from = 0;
	this.frontX = 0;
	this.frontY = 0;
	this.frontW = 0;
	this.frontH = 0;

	this.setRange = function(from, to) {
		this.to = to;
		this.from = from;

		return;
	}

	this.beforeRun = function() {
		this.canvas = this.canvasElement.getContext("2d");
	}

	this.step = function(percent) {
		var alpha = this.from + percent * (this.to - this.from);

		var canvas = this.canvas;
		canvas.save();
        var wm = this.oldWin.getWindowManager();
        canvas.translate(wm.x, wm.y);
        canvas.clipRect(0, 0, this.w, this.h);
 
        if(this.to > this.from) {
            this.oldWin.paintSelf(canvas);
            canvas.globalAlpha = alpha;
            this.newWin.paintSelf(canvas);
        } else {
            this.newWin.paintSelf(canvas);
            canvas.globalAlpha = alpha;
            this.oldWin.paintSelf(canvas);
        }
        canvas.restore();
		return true;
	}
}

function AnimationMove(showWin) {
	Animation.apply(this, arguments);

	this.beforeRun = function() {
		this.range = this.frontH;
		this.canvas = this.canvasElement.getContext("2d");

		return true;;
	}

	this.step = function(percent) {
		var x = this.frontX;
		var y = this.frontY;
		var w = this.frontW;
		var dy = this.range * percent;
		var h = this.showWin ? dy : (this.range - dy);		
		var oy = this.showWin ? (this.frontY + this.range - dy) : (this.frontY + dy);
	
        var canvas = this.canvas;
        canvas.save();
        var wm = this.oldWin.getWindowManager();
        canvas.translate(wm.x, wm.y);
        canvas.clipRect(0, 0, this.w, this.h);
 
        if(showWin) {
            this.oldWin.paintSelf(canvas);
            canvas.translate(0, oy);
            this.newWin.paintSelf(canvas);
        } else {
            this.newWin.paintSelf(canvas);
            canvas.translate(0, oy);
            this.oldWin.paintSelf(canvas);
        }
        canvas.restore();    

		return true;
	}
}
