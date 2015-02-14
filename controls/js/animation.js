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

function Interpolator() {
	this.get = function(percent) {
		return 0;
	}

	return this;
}

function LinearInterpolator() {
	this.get = function(percent) {
		return percent;
	}

	return this;
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

//////////////////////////////////////////////////////////////////////
function AnimationFactory() {
	this.createAnimation = function(name, duration) {
		UIElement.getMainCanvasScale(true);
		var defaultDuration = isIPhone() ? 400 : 600;
		duration = duration ? duration : defaultDuration;
		switch(name) {
			case "anim-forward": {
				var interpolator =  new DecelerateInterpolator();
				animation = isAndroid() ? new AnimationHTranslate(true) : new AnimationHTranslate(true);
				animation.toLeft();
				animation.init(duration, interpolator);
				break;
			}
			case "anim-backward": {
				var interpolator =  new DecelerateInterpolator();
				animation = isAndroid() ? new AnimationHTranslate(false) : new AnimationHTranslate(false);
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
				var interpolator =  new DecelerateInterpolator(1);
				if(isMobile()) {
					animation = new AnimationBrowserScaleWin(true);
					animation.setRange(1.2, 1.0);
				}
				else {
					animation = new AnimationScale(true);
					animation.setRange(0.9, 1.0);
				}
				animation.init(duration, interpolator);
				break;
			}
			case "anim-scale-hide-win": {
				var interpolator =  new AccelerateInterpolator();
				if(isMobile()) {
					animation = new AnimationBrowserScaleWin(false);
					animation.setRange(0.9, 1.0);
				}
				else {
					animation = new AnimationScale(false);
					animation.setRange(1.0, 0.9);
				}
				animation.init(duration, interpolator);
				break;
			}
			case "anim-scale-show-dialog": {
				duration = duration ? duration : 300;
				var interpolator =  new DecelerateInterpolator();
				animation = isAndroid() ? new AnimationBrowserScaleDialog(true) : new AnimationScale(true);
				animation.setRange(0.9, 1.0);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-scale-hide-dialog": {
				duration = duration ? duration : 300;
				var interpolator =  new AccelerateInterpolator();
				animation = isAndroid() ? new AnimationBrowserScaleDialog(false) : new AnimationScale(false);
				animation.setRange(1.0, 0.9);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-fade-in": {
				var interpolator =  new AccelerateInterpolator();
				animation = isAndroid() ? new AnimationBrowserAlpha(true) : new AnimationAlpha(true);
				animation.setRange(0.6, 1.0);
				animation.init(500, interpolator);
				break;
			}
			case "anim-fade-out": {
				var interpolator =  new AccelerateInterpolator();
				animation = isAndroid() ? new AnimationBrowserAlpha(false) : new AnimationAlpha(false);
				animation.setRange(1.0, 0.8);
				animation.init(300, interpolator);
				break;
			}
			case "anim-move-up": {
				var interpolator =  new DecelerateInterpolator();
				animation = isMobile() ? new AnimationBrowserMove(true) : new AnimationMove(true);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-move-down": {
				var interpolator =  new AccelerateInterpolator();
				animation = isMobile() ? new AnimationBrowserMove(false) : new AnimationMove(false);
				animation.init(duration, interpolator);
				break;
			}
			case "anim-expand-up": 
			case "anim-expand-left": 
			case "anim-expand-right": 
			case "anim-expand-down": {
				var interpolator =  new DecelerateInterpolator(); 
				animation = new Animation1Expand(true);
				animation.init(400, interpolator);
				break;
			}
			case "anim-collapse-up": 
			case "anim-collapse-left": 
			case "anim-collapse-right": 
			case "anim-collapse-down": {
				var interpolator =  new AccelerateInterpolator(); 
				animation = new Animation1Expand(true);
				animation.init(400, interpolator);
				break;
			}
			case "anim-scale1-show-origin-topleft":
			case "anim-scale1-show-origin-center":
			case "anim-scale1-show-origin-bottomleft":
			case "anim-scale1-show-origin-topright":
			case "anim-scale1-show-origin-bottomright":
			case "anim-scale1-show": {
				var interpolator =  new DecelerateInterpolator(); 
				animation = new Animation1Scale(true);
				animation.init(400, interpolator);
				break;
			}
			case "anim-scale1-hide-origin-topleft":
			case "anim-scale1-hide-origin-center":
			case "anim-scale1-hide-origin-bottomleft":
			case "anim-scale1-hide-origin-topright":
			case "anim-scale1-hide-origin-bottomright":
			case "anim-scale1-hide": {
				var interpolator =  new AccelerateInterpolator(); 
				animation = new Animation1Scale(false);
				animation.init(400, interpolator);
				break;
			}
			case "anim-alpha1-show": {
				var interpolator =  new DecelerateInterpolator(); 
				animation = new Animation1Alpha(true);
				animation.init(400, interpolator);
				break;
			}
			case "anim-alpha1-hide": {
				var interpolator =  new AccelerateInterpolator(); 
				animation = new Animation1Alpha(false);
				animation.init(400, interpolator);
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
	if(!Animation.canvas) {
		Animation.canvas = document.createElement("canvas");
		Animation.canvas.type = "animation_canvas";
	}
	
	Animation.canvas.style.zIndex = 9;
	Animation.canvas.style["opacity"] = 1;
	scaleElement(Animation.canvas, 1, 1);
	
	return Animation.canvas;
}

Animation.getOldWinCanvas = function() {
	if(!Animation.oldWnCanvas) {
		Animation.oldWnCanvas= document.createElement("canvas");
		Animation.oldWnCanvas.type = "animation_canvas";
	}
	
	Animation.oldWnCanvas.style.zIndex = 9;
	Animation.oldWnCanvas.style["opacity"] = 1;
	scaleElement(Animation.oldWnCanvas, 1, 1);
	
	return Animation.oldWnCanvas;
}

Animation.getNewWinCanvas = function() {
	if(!Animation.newWinCanvas) {
		Animation.newWinCanvas= document.createElement("canvas");
		Animation.newWinCanvas.type = "animation_canvas";
	}

	Animation.newWinCanvas.style.zIndex = 9;
	Animation.newWinCanvas.style["opacity"] = 1;
	scaleElement(Animation.newWinCanvas, 1, 1);
	
	return Animation.newWinCanvas;
}

Animation.getBackendCanvas = function(width, height) {
	if(!Animation.backendCanvas) {
		Animation.backendCanvas = document.createElement("canvas");

		Animation.backendCanvas.type = "backend_canvas";
		Animation.backendCanvas.width = width;
		Animation.backendCanvas.height = height;
	}

	if(Animation.backendCanvas) {
		if(Animation.backendCanvas.width != width) {
			Animation.backendCanvas.width = width;
		}

		if(Animation.backendCanvas.height != height) {
			Animation.backendCanvas.height = height;
		}
		Animation.scaleCanvas(Animation.backendCanvas, width, height);
	}
	scaleElement(Animation.backendCanvas, 1, 1);

	return Animation.backendCanvas;
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

	this.prepare = function(x, y, w, h, canvasImage, onFinish) {
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.w = Math.round(w);
		this.h = Math.round(h);
		this.onFinish = onFinish;
		this.canvasImage = canvasImage;

		this.setRectOfFront(0, 0, w, h);
		if(canvasImage) {
			this.sw = canvasImage.width;
			this.sh = canvasImage.height;
		}

		this.show();

		return true;
	}

	this.moveResizeCanvas = function(canvasElement, x, y, w, h) {
		canvasElement.style.position = "absolute";
		canvasElement.width = w;
		canvasElement.height = h;
		setElementPosition(canvasElement, x, y);
		canvasElement.style.visibility = 'visible';

		Animation.scaleCanvas(canvasElement, w, h);

		return;
	}

	this.show = function() {
		var w = this.w * this.scale;
		var h = this.h * this.scale;

		this.visible = true;
		this.canvasElement = Animation.getCanvas();

		this.moveResizeCanvas(this.canvasElement, this.x, this.y, w, h);
		document.body.appendChild(this.canvasElement);
		
		return true;
	}

	this.hide = function() {
		this.visible = false;
		if(this.canvasElement && this.canvasElement.parentNode) {
			document.body.removeChild(this.canvasElement);
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
		if(this.isFirstStep) {
			this.canvas.drawImage(this.canvasImage, 0, 0, this.w, this.h, 0, 0, this.w, this.h);
		}
		else {
			var x = this.frontX;
			var y = this.frontY;
			var w = this.frontW;
			var h = this.frontH;

			this.canvas.drawImage(this.canvasImage, x, y, w, h, x, y, w, h);
		}

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

		function animStep() {
			var percent = 0;
			var timePercent = animation.getTimePercent();

			if(timePercent < 1) {
				percent = animation.getPercent(timePercent);
				animation.doStep(percent);

				requestAnimFrame(animStep);
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

Animation.scaleCanvas = function(canvas, width, height) {
	var scale = UIElement.getMainCanvasScale();

	canvas.style.width = Math.round(width/scale.x) + "px";
	canvas.style.height = Math.round(height/scale.y) + "px";

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

function AnimationHTranslateAndroid() {
	Animation.apply(this, arguments);
	
	this.leftToRight = true;

	this.show = function() {
		document.body.appendChild(Animation.backendCanvas);
		Animation.backendCanvas.style.zIndex = 9;
		this.canvasElement = Animation.backendCanvas;
		setElementPosition(Animation.backendCanvas, this.x, this.y);

		return true;
	}

	this.hide = function() {
		if(this.canvasElement) {
			document.body.removeChild(this.canvasElement);
			this.canvasElement = null;
		}
		return true;
	}

	this.doStep = function(percent) {
		this.step(percent);
		return;
	}

	this.beforeRun = function() {
		var range = this.sw - this.w;
		
		this.range = range * 0.7;
		this.start = range - this.range;

		return;
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

		moveElement(Animation.backendCanvas, -ox+this.x, this.y);

		return true;
	}
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

		if(oy > 0) {
			this.canvas.drawImage(this.canvasImage, 0, this.h - oy, w, oy, 0, 0, w, oy);
		}

		if(h > 0) {
			this.canvas.drawImage(this.canvasImage, x+this.w, y, w, h, x, oy, w, h);
		}

		return true;
	}
}

function AnimationHTranslate() {
	Animation.apply(this, arguments);
	
	this.leftToRight = true;

	this.beforeRun = function() {
		var range = this.sw - this.w;
		
		if(isMobile()) {
			this.range = range * 0.8;
		}
		else {
			this.range = range;
		}

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

		this.canvas.drawImage(this.canvasImage, ox, 0, this.w, this.h, 0, 0, this.w, this.h);
		this.lastOffset = ox;
		//console.log("Step: " + percent + " ox=" + ox);
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
		if(this.canvasImage) {
			var canvas = this.canvas;
			var cx = this.frontX + 0.5 * this.frontW;
			var cy = this.frontY + 0.5 * this.frontH;

			this.drawBackground(canvas);

			canvas.save();
			canvas.translate(cx, cy);
			canvas.globalAlpha = alpha;
			canvas.scale(scale, scale);
			canvas.translate(-0.5 * this.frontW, -0.5 * this.frontH);

			canvas.drawImage(this.canvasImage, this.frontX + this.w, this.frontY, this.frontW, this.frontH,
				0, 0, this.frontW, this.frontH);
			canvas.restore();
		}

		//console.log("Step: " + percent + " scale=" + scale);
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

		if(this.canvasImage) {
			var canvas = this.canvas;
			
			canvas.drawImage(this.canvasImage, 0, 0, this.w, this.h, 0, 0, this.w, this.h);
			canvas.save();
			canvas.globalAlpha = alpha;
			canvas.drawImage(this.canvasImage, this.frontX + this.w, this.frontY, this.frontW, this.frontH,
				this.frontX, this.frontY, this.frontW, this.frontH);
			canvas.restore();
		}

		//console.log("Step: " + percent + " alpha=" + alpha);
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
		this.drawBackground(this.canvas);

		var x = this.frontX;
		var y = this.frontY;
		var w = this.frontW;
		var dy = this.range * percent;
		var h = this.showWin ? dy : (this.range - dy);		
		var oy = this.showWin ? (this.frontY + this.range - dy) : (this.frontY + dy);
		
		if(h > 0) {
			this.canvas.drawImage(this.canvasImage, x+this.w, y, w, h, x, oy, w, h);
		}

		return true;
	}
}

//////////////////////////////////////////////////////////////////

function AnimationBrowser(showWin) {
	Animation.apply(this, arguments);
	
	this.to = 1.0;
	this.from = 0;
	this.frontX = 0;
	this.frontY = 0;
	this.frontW = 0;
	this.frontH = 0;

	function removeCanvas(canvas) {
		try {
			document.body.removeChild(canvas);
		}
		catch(e) {
			console.log(e.toString());
		}

		return;
	}

	this.setRange = function(from, to) {
		this.to = to;
		this.from = from;

		return;
	}

	this.onShowCanvas = function() {
		setElementPosition(this.oldWinCanvas, this.x, this.y);
		setElementPosition(this.newWinCanvas, this.x, this.y);
		showElement(this.oldWinCanvas);
		showElement(this.newWinCanvas);

		return;
	}

	this.showCanvas = function(oldWinZIndex, newWinZIndex) {
		var w = this.w;
		var h = this.h;
		var oldWinCanvas = Animation.getOldWinCanvas();
		var newWinCanvas = Animation.getNewWinCanvas();

		this.moveResizeCanvas(oldWinCanvas, this.x, this.y, w, h);
		this.moveResizeCanvas(newWinCanvas, this.x, this.y, w, h);

		oldWinCanvas.style.zIndex = oldWinZIndex;
		newWinCanvas.style.zIndex = newWinZIndex;
		
		var oldWin = oldWinCanvas.getContext("2d");
		var newWin = newWinCanvas.getContext("2d");

		if(this.showWin) {
			oldWin.drawImage(Animation.backendCanvas, 0, 0, w, h, 0, 0, w, h);
			newWin.drawImage(Animation.backendCanvas, this.w, 0, w, h, 0, 0, w, h);
		}
		else {
			newWin.drawImage(Animation.backendCanvas, 0, 0, w, h, 0, 0, w, h);
			oldWin.drawImage(Animation.backendCanvas, this.w, 0, w, h, 0, 0, w, h);
		}

		this.oldWinCanvas = oldWinCanvas;
		this.newWinCanvas = newWinCanvas;

		this.onShowCanvas();
	
		if(oldWinZIndex > newWinZIndex) {
			document.body.appendChild(newWinCanvas);
			document.body.appendChild(oldWinCanvas);
		}
		else {
			document.body.appendChild(newWinCanvas);
			document.body.appendChild(oldWinCanvas);
		}

		return true;
	}
	
	this.show = function() {
		this.showCanvas(8, 9);

		return true;
	}

	this.hide = function() {
		if(this.oldWinCanvas && this.newWinCanvas) {
			if(this.showWin) {
				removeCanvas(this.oldWinCanvas);
				removeCanvas(this.newWinCanvas);
			}
			else {
				removeCanvas(this.oldWinCanvas);
				removeCanvas(this.newWinCanvas);
			}
			this.newWinCanvas = null;
			this.oldWinCanvas = null;
		}

		return true;
	}

	this.afterRun = function() {
	}

	this.doStep = function(percent) {
		this.step(percent);
		return;
	}

	this.step = function(percent) {
		var scale = this.from + percent * (this.to - this.from);
		var alpha = percent;
		scaleElement(this.newWinCanvas, scale, alpha);

		return true;
	}
}

function AnimationBrowserScaleWin(showWin) {
	AnimationBrowser.apply(this, arguments);
	
	this.onShowCanvas = function() {
		setElementPosition(this.oldWinCanvas, this.x, this.y);
		setElementPosition(this.newWinCanvas, this.x, this.y);
		showElement(this.oldWinCanvas);
		hideElement(this.newWinCanvas);

		return;
	}
	
	this.step = function(percent) {
		var alpha = percent;
		var scale = this.from + percent * (this.to - this.from);

		scaleElement(this.newWinCanvas, scale, alpha);

		return true;
	}
}

function AnimationBrowserScaleDialog(showWin) {
	AnimationBrowser.apply(this, arguments);
	
	this.show = function() {
		if(this.showWin) {
			this.showCanvas(8, 9);
		}
		else {
			this.showCanvas(9, 8);
		}

		return true;
	}
	
	this.step = function(percent) {
		var scale = this.from + percent * (this.to - this.from);
		var alpha = this.showWin ? percent : 1-percent;

		if(this.showWin) {
			scaleElement(this.newWinCanvas, scale, alpha);
		}
		else {
			scaleElement(this.oldWinCanvas, scale, alpha);
		}

		return true;
	}
}

function AnimationBrowserAlpha(showWin) {
	AnimationBrowser.apply(this, arguments);
	
	this.show = function() {
		if(this.showWin) {
			this.showCanvas(8, 9);
		}
		else {
			this.showCanvas(9, 8);
		}
	}

	this.step = function(percent) {
		var alpha = this.from + percent * (this.to - this.from);

		if(this.showWin) {
			alphaElement(this.newWinCanvas, alpha);
		}
		else {
			alphaElement(this.oldWinCanvas, alpha);
		}

		return true;
	}
}
function AnimationBrowserMove(showWin) {
	AnimationBrowser.apply(this, arguments);

	this.onShowCanvas = function() {
		if(this.showWin) {
			setElementPosition(this.oldWinCanvas, this.x, this.y);
			setElementPosition(this.newWinCanvas, this.x, this.frontH);
		}
		else {
			setElementPosition(this.oldWinCanvas, this.x, this.y);
			setElementPosition(this.newWinCanvas, this.x, this.y);
		}
		showElement(this.oldWinCanvas);
		showElement(this.newWinCanvas);

		return;
	}

	this.show = function() {
		if(this.showWin) {
			this.showCanvas(8, 9);
		}
		else {
			this.showCanvas(9, 8);
		}

		return;
	}

	this.step = function(percent) {
		var oy = 0;
		this.range = this.frontH;
		var dy = this.range * percent;
		if(this.showWin) {
			oy = this.range - dy;
			moveElement(this.newWinCanvas, 0, oy);
		}
		else {
			oy = dy;
			moveElement(this.oldWinCanvas, 0, oy);
		}
	
		return true;
	}
}

//////////////////////////////////////////widget animations/////////////////////////////////////////

var C_DIR_UP = 1;
var C_DIR_DOWN = 2;
var C_DIR_LEFT = 3;
var C_DIR_RIGHT = 4;
var C_ACTION_EXPAND = 1;
var C_ACTION_COLLAPSE = 2;

function Animation1Expand() {
	Animation.apply(this, arguments);
	
	this.prepare = function(x, y, w, h, canvasImage, onFinish) {
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.w = Math.round(w);
		this.h = Math.round(h);
		this.onFinish = onFinish;
		this.canvasImage = canvasImage;
		
		this.xto = this.xfrom = 0;
		this.yto = this.yfrom = 0;
		this.wto = this.wfrom = w;
		this.hto = this.hfrom = h;
		
		this.show();

		return;
	}

	this.expandV = function(up) {
		this.direction = up? C_DIR_UP : C_DIR_DOWN;
		this.action =  C_ACTION_EXPAND;
		this.yfrom = this.h;
		this.yto = 0;
		this.hfrom = 0;
		this.hto = this.h;

		return;
	}
	
	this.expandH = function(left) {
		this.direction = left ? C_DIR_LEFT : C_DIR_RIGHT;
		this.action =  C_ACTION_EXPAND;
		this.xfrom = this.w;
		this.xto = 0;
		this.wfrom = 0;
		this.wto = this.w;

		return;
	}
	
	this.collapseV = function(up) {
		this.direction = up? C_DIR_UP : C_DIR_DOWN;
		this.action =  C_ACTION_COLLAPSE;
		this.yfrom = 0;
		this.yto = this.h;
		this.hfrom = this.h;
		this.hto = 0;

		return;
	}
	
	this.collapseH = function(left) {
		this.direction = left ? C_DIR_LEFT : C_DIR_RIGHT;
		this.action =  C_ACTION_COLLAPSE;
		this.xfrom = 0;
		this.xto = this.w;
		this.wfrom = this.w;
		this.wto = 0;

		return;
	}

	this.expandUp = function() {
		return this.expandV(true);
	}
	
	this.expandDown = function() {
		return this.expandV(false);
	}

	this.expandLeft = function() {
		return this.expandH(true);
	}

	this.expandRight = function() {
		return this.expandH(false);
	}

	this.collapseUp = function() {
		return this.collapseV(true);
	}
	
	this.collapseDown = function() {
		return this.collapseV(false);
	}

	this.collapseLeft = function() {
		return this.collapseH(true);
	}

	this.collapseRight = function() {
		return this.collapseH(false);
	}

	this.show = function() {
		this.canvasElement = Animation.getCanvas(); 
		this.moveResizeCanvas(this.canvasElement, this.x, this.y, this.w, this.h);
		this.canvas = this.canvasElement.getContext("2d");
		document.body.appendChild(this.canvasElement);
		this.canvasElement.style.zIndex = 9;
		setElementPosition(this.canvasElement, this.x, this.y);
		showElement(this.canvasElement);

		return true;
	}

	this.hide = function() {
		this.visible = false;
		if(this.canvasElement) {
			document.body.removeChild(this.canvasElement);
			this.canvasElement = null;
		}

		return true;
	}

	this.step = function(percent) {
		var canvas = this.canvas;
		var x = this.xfrom + ((this.xto - this.xfrom) * percent);
		var y = this.yfrom + ((this.yto - this.yfrom) * percent);
		
		var w = this.wfrom + (this.wto - this.wfrom) * percent;
		var h = this.hfrom + (this.hto - this.hfrom) * percent;

		if(!w || !h) {
			return;
		}

		canvas.clearRect(0, 0, this.w, this.h);
		
		var dx = x;
		var dy = y;
		var sx = x;
		var sy = y;

		if(this.action === C_ACTION_EXPAND) {
			switch(this.direction) {
				case C_DIR_UP: {
					sy = 0;			
					break;
				}
				case C_DIR_DOWN: {
					dy = 0;			
					break;
				}
				case C_DIR_LEFT: {
					sx = 0;			
					break;
				}
				case C_DIR_RIGHT: {
					dx = 0;			
					break;
				}
			}
		}
		else {
			switch(this.direction) {
				case C_DIR_UP: {
					dy = 0;			
					break;
				}
				case C_DIR_DOWN: {
					sy = 0;			
					break;
				}
				case C_DIR_LEFT: {
					dx = 0;			
					break;
				}
				case C_DIR_RIGHT: {
					sx = 0;			
					break;
				}
			}
		}

		//console.log("y:" + y + " h:" + h);
		canvas.drawImage(this.canvasImage, sx, sy, w, h, dx, dy, w, h);
		//canvas.fillRect(dx, dy, w, h);

		return true;
	}
}

function Animation1Alpha() {
	Animation.apply(this, arguments);
	
	this.prepare = function(x, y, w, h, canvasImage, onFinish) {
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.w = Math.round(w);
		this.h = Math.round(h);
		this.onFinish = onFinish;
		this.canvasImage = canvasImage;
		
		this.show();

		return;
	}

	this.setRange = function(from, to) {
		this.from = from;
		this.to = to;

		return;
	}
	
	this.show = function() {
		this.canvasElement = Animation.getCanvas(); 
		this.moveResizeCanvas(this.canvasElement, this.x, this.y, this.w, this.h);
		this.canvas = this.canvasElement.getContext("2d");
		document.body.appendChild(this.canvasElement);
		this.canvasElement.style.zIndex = 9;
		setElementPosition(this.canvasElement, this.x, this.y);
		showElement(this.canvasElement);

		this.canvas.drawImage(this.canvasImage, 0, 0, this.w, this.h, 0, 0, this.w, this.h);

		return true;
	}

	this.hide = function() {
		this.visible = false;
		if(this.canvasElement) {
			try {
				document.body.removeChild(this.canvasElement);
			}catch(e) {
				console.log("document.body.removeChild: not found.");
			}
			this.canvasElement = null;
		}

		return true;
	}

	this.step = function(percent) {
		var canvas = this.canvas;
		var opacity = this.from + (this.to - this.from) * percent;

		alphaElement(this.canvasElement, opacity);
		console.log("opacity:" + opacity);
		return true;
	}
}

function Animation1Scale() {
	Animation.apply(this, arguments);
	
	this.prepare = function(x, y, w, h, canvasImage, onFinish) {
		this.x = Math.round(x);
		this.y = Math.round(y);
		this.w = Math.round(w);
		this.h = Math.round(h);
		this.xOrigin = "50%";
		this.yOrigin = "50%";
		this.onFinish = onFinish;
		this.canvasImage = canvasImage;
		
		this.show();

		return;
	}

	this.setOrigin = function(xOrigin, yOrigin) {
		this.xOrigin = xOrigin;
		this.yOrigin = yOrigin;

		return;
	}

	this.setRange = function(from, to) {
		this.from = from;
		this.to = to;

		return;
	}
	
	this.show = function() {
		this.canvasElement = Animation.getCanvas(); 
		this.moveResizeCanvas(this.canvasElement, this.x, this.y, this.w, this.h);
		this.canvas = this.canvasElement.getContext("2d");
		document.body.appendChild(this.canvasElement);
		this.canvasElement.style.zIndex = 9;
		setElementPosition(this.canvasElement, this.x, this.y);
		showElement(this.canvasElement);

		this.canvas.drawImage(this.canvasImage, 0, 0, this.w, this.h, 0, 0, this.w, this.h);

		return true;
	}

	this.hide = function() {
		this.visible = false;
		if(this.canvasElement) {
			document.body.removeChild(this.canvasElement);
			this.canvasElement = null;
		}

		return true;
	}

	this.step = function(percent) {
		var canvas = this.canvas;
		var scale = this.from + (this.to - this.from) * percent;
		var alpha = this.showWin ? percent : 1-percent;

		scaleElement(this.canvasElement, scale, alpha, this.xOrigin, this.yOrigin);

		return true;
	}
}

function animateUIElement(uiElement, animHint, onAnimDone) {
	var visible = false;
	var scale = uiElement.getRealScale();
	var p = uiElement.getPositionInView();
	var pv = uiElement.view.getAbsPosition();

	var x = Math.round(p.x * scale) + pv.x;
	var y = Math.round(p.y * scale) + pv.y;
	var w = Math.round(uiElement.w * scale);
	var h = Math.round(uiElement.h * scale);

	var canvasElement = Animation.getBackendCanvas(w, h);
	var canvas = canvasElement.getContext("2d");

	canvas.save();
	visible = uiElement.visible;
	uiElement.visible = true;
	canvas.scale(scale, scale);
	canvas.translate(-uiElement.x, -uiElement.y);
	uiElement.paint(canvas);
	uiElement.visible = visible;
	canvas.restore();

	var anim = AnimationFactory.create(animHint);

	anim.prepare(x, y, w, h, canvasElement, function() {
		if(onAnimDone) {
			onAnimDone();
		}
		uiElement.setVisible(!visible);
		uiElement.postRedraw();
	});

	if(visible) {
		uiElement.setVisible(!visible);
		uiElement.postRedraw();
	}

	switch(animHint) {
		case "anim-expand-up": {
			anim.expandUp();
			break;
		}
		case "anim-expand-left": {
			anim.expandLeft();
			break;
		}
		case "anim-expand-right": {
			anim.expandRight();
			break;
		}
		case "anim-expand-down": {
			anim.expandDown();
			break;
		}
		case "anim-collapse-up": {
			anim.collapseUp();
			break;
		}
		case "anim-collapse-left": {
			anim.collapseLeft();
			break;
		}
		case "anim-collapse-right": {
			anim.collapseRight();
			break;
		}
		case "anim-collapse-down": {
			anim.collapseDown();
			break;
		}
		case "anim-scale1-show-origin-topleft": {
			anim.setOrigin("0%", "0%");
			anim.setRange(0.5, 1.0);
			break;
		}
		case "anim-scale1-show-origin-center": {
			anim.setOrigin("50%", "50%");
			anim.setRange(0.5, 1.0);
			break;
		}
		case "anim-scale1-show-origin-bottomleft": {
			anim.setOrigin("0%", "100%");
			anim.setRange(0.5, 1.0);
			break;
		}
		case "anim-scale1-show-origin-topright": {
			anim.setOrigin("100%", "0%");
			anim.setRange(0.5, 1.0);
			break;
		}
		case "anim-scale1-show-origin-bottomright": {
			anim.setOrigin("100%", "100%");
			anim.setRange(0.5, 1.0);
			break;
		}
		case "anim-scale1-show": {
			anim.setRange(0.5, 1.0);
			break;
		}
		case "anim-scale1-hide-origin-topleft": {
			anim.setOrigin("0%", "0%");
			anim.setRange(1.0, 0.5);
			break;
		}
		case "anim-scale1-hide-origin-center": {
			anim.setOrigin("50%", "50%");
			anim.setRange(1.0, 0.5);
			break;
		}
		case "anim-scale1-hide-origin-bottomleft": {
			anim.setOrigin("0%", "100%");
			anim.setRange(1.0, 0.5);
			break;
		}
		case "anim-scale1-hide-origin-topright": {
			anim.setOrigin("100%", "0%");
			anim.setRange(1.0, 0.5);
			break;
		}
		case "anim-scale1-hide-origin-bottomright": {
			anim.setOrigin("100%", "100%");
			anim.setRange(1.0, 0.5);
			break;
		}
		case "anim-scale1-hide": {
			anim.setRange(1.0, 0.5);
			break;
		}
		case "anim-alpha1-show": {
			anim.setRange(0.2, 1.0);
			break;
		}
		case "anim-alpha1-hide": {
			anim.setRange(1.0, 0.2);
			break;
		}
	}

	anim.run();

	return;
}


function testAnimation1Expand(uiElement) {
	var testElement = uiElement.getWindow().findChildByName("ui-button-test", true);

	testElement.setVisible(false);
	testElement.postRedraw();
	setTimeout(function() {
		animateUIElement(testElement, "anim-alpha1-show");
	}, 100);
	
	setTimeout(function() {
		animateUIElement(testElement, "anim-alpha1-hide");
	}, 3000);

	return;
}
