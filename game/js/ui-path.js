/*
 * File:   ui-path.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic path for game. 
 * 
 * Copyright (c) 2015 - 2015 Holaverse Inc.
 * 
 */

function UIPath() {
	return;
}

UIPath.prototype = new UIElement();
UIPath.prototype.isUIPath = true;

UIPath.prototype.initUIPath = function(type, w, h) {
	this.initUIElement(type);	
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.addEventNames(["onInit"]);

	return this;
}

UIPath.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIPath.prototype.onInit = function() {
	this.shapesInfo = [];
	this.elapsedTime = 0;
	this.pathAnimation = new PathAnimation();
	this.animationState = UIElement.STATE_RUNNING;

	this.callOnInitHandler();

	return;
}

UIPath.prototype.restart = function() {
	this.elapsedTime = 0;
	this.animationState = UIElement.STATE_RUNNING;

	return this;
}

UIPath.prototype.pause = function() {
	this.animationState = UIElement.STATE_PAUSED;

	return this;
}

UIPath.prototype.resume = function() {
	this.animationState = UIElement.STATE_RUNNING;

	return this;
}

UIPath.prototype.addObj = function(shape, onStep, onDone, delayTime, noRotation) {
	var info = {
		shape : shape, 
		onStep : onStep,
		onDone : onDone,
		noRotation:noRotation,
		delayTime : delayTime ? delayTime : 0, 
	};

	info.delayTime += this.elapsedTime;
	this.shapesInfo.push(info);

	return this;
}

UIPath.prototype.removeObj = function(shape) {
	var a = this.shapesInfo;
	var n = this.shapesInfo.length;

	for(var i = 0; i < n; i++) {
		var iter = a[i];
		if(iter.shape === shape) {
			a.splice(i, 1);
			break;
		}
	}

	return this;
}

UIPath.prototype.resetObjs = function() {
	this.shapesInfo = [];

	return this;
}

UIPath.prototype.resetPath = function() {
	this.shapesInfo = [];

	return this;
}

UIPath.prototype.getStartPoint = function() {
	return this.pathAnimation.startPoint;
}

UIPath.prototype.getEndPoint = function() {
	return this.endPoint;
}

UIPath.prototype.addPath = function(path) {
	this.pathAnimation.addPath(path);

	return this;
}

UIPath.prototype.addLine = function(duration, interpolator, p1, p2) {
	return this.addPath(LinePath.create(duration, interpolator, p1.x, p1.y, p2.x, p2.y));
}

UIPath.prototype.addArc = function(duration, interpolator, origin, r, sAngle, eAngle) {
	return this.addPath(ArcPath.create(duration, interpolator, origin.x, origin.y, r, sAngle, eAngle));
}

UIPath.prototype.addPara = function(duration, interpolator, p, a, v) {
	return this.addPath(ParaPath.create(duration, interpolator, p.x, p.y, a.x, a.y, v.x, v.y));
}

UIPath.prototype.addSin = function(duration, interpolator, p, waveLenth, v, amplitude, phaseOffset) {
	return this.addPath(SinPath.create(duration, interpolator, p.x, p.y, waveLenth, v, amplitude, phaseOffset));
}

UIPath.prototype.addBezier = function(duration, interpolator, p1, p2, p3, p4) {
	return this.addPath(Bezier3Path.create(duration, interpolator, p1.x,p1.y, p2.x,p2.y, p3.x,p3.y, p4.x,p4.y));
}

UIPath.prototype.addQuad = function(duration, interpolator, p1, p2, p3) {
	return this.addPath(Bezier2Path.create(duration, interpolator, p1.x,p1.y, p2.x,p2.y, p3.x,p3.y));
}

UIPath.prototype.getDuration = function() {
	return this.pathAnimation.duration;
}

UIPath.prototype.getPosition = function(elapsedTime) {
	return this.pathAnimation.getPosition(elapsedTime);
}

UIPath.prototype.getDirection = function(elapsedTime) {
	return this.pathAnimation.getDirection(elapsedTime);
}

UIPath.prototype.paintSelf = function(canvas) {
	if(this.isIcon || this.mode === Shape.MODE_EDITING) {
		UIElement.prototype.paintSelf.call(this, canvas);
		return;
	}

	if(this.showPath && !this.isStrokeColorTransparent()) {
		canvas.strokeStyle = this.style.lineColor;
		canvas.lineWidth = this.style.lineWidth;
		this.pathAnimation.draw(canvas);
	}

	if(this.animationState === UIElement.STATE_RUNNING) {
		this.elapsedTime += canvas.timeStep * UIElement.timeScale;
		var elapsedTime = this.elapsedTime;
		
		var a = this.shapesInfo.slice();
		var n = this.shapesInfo.length;
		var pathAnimation = this.pathAnimation;
		var duration = pathAnimation.getDuration();

		for(var i = 0; i < n; i++) {
			var iter = a[i];
			var t = elapsedTime - iter.delayTime;
			var shape = iter.shape;
			if(!shape || !shape.parentShape) continue;

			if(t > 0) {
				var angle = pathAnimation.getDirection(t);
				var position = pathAnimation.getPosition(t);

				if(!shape.visible) {
					shape.setVisible(true);
				}
				if(iter.onStep) {
					onStep.call(shape, t, position, angle);
				}
				else {
					shape.setPosition(position.x-(shape.w>>1), position.y-(shape.h>>1));
					if(!iter.noRotation) {
						shape.setRotation(angle);
					}
				}

				if(t > duration && iter.onDone) {
					onDone.call(shape);
				}
			}
		}
	}
	
	return;
}

function UIPathCreator() {
	var args = ["ui-path", "ui-path", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPath();
		return g.initUIPath(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIPathCreator());
