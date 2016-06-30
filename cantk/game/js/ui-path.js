/*
 * File:   ui-path.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic path for game. 
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIPath
 * @extends UIElement
 * UIPath 控制物体按照指定的路径运动。目前路径支持直线，抛物线，二次和三次贝塞尔曲线，sin/cos函数和圆弧曲线。可以指定运动的速度(由duration控制)和加速度(由interpolator决定)。
 *
 * 使用时先放一个UIPath对象到场景中，然后在onInit事件里增加路径，在任何时间都可以向UIPath增加对象或删除对象。
 *
 * 注意：
 *
 * 1.文档中时长的单位为毫秒，速度单位为像素/秒，加速单位为像素/秒^2，角度单位为弧度。
 *
 * 2.插值算法实现加速/加速/匀速等效果，请参考插值算法。
 *
 */
function UIPath() {
	return;
}

UIPath.prototype = new UIElement();
UIPath.prototype.isUIPath = true;
UIPath.prototype.saveProps = ["showPath"];
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

/**
 * @method restart
 * 重新开始。
 * @return {UIElement} 返回控件本身。
 *
 */
UIPath.prototype.restart = function() {
	this.elapsedTime = 0;
	this.animationState = UIElement.STATE_RUNNING;
	
	var a = this.shapesInfo;
	var n = this.shapesInfo.length;

	for(var i = 0; i < n; i++) {
		var iter = a[i];
		iter.done = false;
		iter.startTime = iter.delayTime;
	}

	return this;
}

/**
 * @method pause
 * 恢复。
 * @return {UIElement} 返回控件本身。
 *
 */
UIPath.prototype.pause = function() {
	this.animationState = UIElement.STATE_PAUSED;

	return this;
}

/**
 * @method resume 
 * 恢复。
 * @return {UIElement} 返回控件本身。
 *
 */
UIPath.prototype.resume = function() {
	this.animationState = UIElement.STATE_RUNNING;

	return this;
}

UIPath.prototype.hasObj = function(shape) {
	var a = this.shapesInfo;
	var n = this.shapesInfo.length;

	for(var i = 0; i < n; i++) {
		var iter = a[i];
		if(iter.shape === shape) {
			return true;
		}
	}

	return false;
}

/**
 * @method addObj
 * 增加一个对象，让它沿路径运动。
 * @param {UIElement} shape 对象。
 * @param {Function} onStep 每一步的回调函数（可选）。
 * @param {Function} onDone 完成时的回调函数（可选）。
 * @param {Number} delayTime 延迟启动时间（可选）。
 * @param {Number} noRotation 是否禁止旋转（可选）。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.addObj = function(shape, onStep, onDone, delayTime, noRotation) {
	if(this.hasObj(shape)) {
		console.log("obj exist in path.");
		return this;
	}

	var info = {
		shape : shape, 
		onStep : onStep,
		onDone : onDone,
		noRotation:noRotation,
		delayTime : delayTime ? delayTime : 0, 
		startTime: Date.now()
	};

	info.startTime = info.delayTime + this.elapsedTime;
	this.shapesInfo.push(info);

	return this;
}

/**
 * @method removeObj
 * 从路径中移除一个对象。
 * @param {UIElement} shape 对象。
 * @return {UIElement} 返回控件本身。
 */
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

/**
 * @method resetObjs
 * 清除全部对象。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.resetObjs = function() {
	this.shapesInfo = [];

	return this;
}

/**
 * @method resetPath
 * 重置路径。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.resetPath = function() {
	this.pathAnimation.reset();

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

/**
 * @method addLine
 * 增加一条直线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} p1 起点。
 * @param {Point} p2 终点。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.addLine = function(duration, interpolator, p1, p2) {
	return this.addPath(LinePath.create(duration, interpolator, p1.x, p1.y, p2.x, p2.y));
}

/**
 * @method addArc
 * 增加一条弧线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} origin 原点
 * @param {Number} r 半径。
 * @param {Number} sAngle 初始角度。
 * @param {Number} eAngle 结束角度。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.addArc = function(duration, interpolator, origin, r, sAngle, eAngle) {
	return this.addPath(ArcPath.create(duration, interpolator, origin.x, origin.y, r, sAngle, eAngle));
}

/**
 * @method addPara
 * 增加一条抛物线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} p 初始位置。 
 * @param {Point} a 加速度。
 * @param {Point} v 初速度。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.addPara = function(duration, interpolator, p, a, v) {
	return this.addPath(ParaPath.create(duration, interpolator, p.x, p.y, a.x, a.y, v.x, v.y));
}

/**
 * @method addSin
 * 增加一条sin/cos曲线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Number} p 初始位置。
 * @param {Number} waveLenth 波长。
 * @param {Number} v 波速(X方向上的速度)。
 * @param {Number} amplitude 振幅。
 * @param {Number} phaseOffset 角度偏移。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.addSin = function(duration, interpolator, p, waveLenth, v, amplitude, phaseOffset) {
	return this.addPath(SinPath.create(duration, interpolator, p.x, p.y, waveLenth, v, amplitude, phaseOffset));
}

/**
 * @method addBezier
 * 增加一条三次贝塞尔曲线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} p1 起点。
 * @param {Point} p2 控制点1。
 * @param {Point} p3 控制点2。
 * @param {Point} p4 终点。
 * @return {UIElement} 返回控件本身。
 */
UIPath.prototype.addBezier = function(duration, interpolator, p1, p2, p3, p4) {
	return this.addPath(Bezier3Path.create(duration, interpolator, p1.x,p1.y, p2.x,p2.y, p3.x,p3.y, p4.x,p4.y));
}

/**
 * @method addQuad
 * 增加一条二次贝塞尔曲线到路径中。
 * @param {Number} duration 经过此路径需要的时间。
 * @param {Object} interpolator 插值算法。
 * @param {Point} p1 起点。
 * @param {Point} p2 控制点。
 * @param {Point} p3 终点。
 * @return {UIElement} 返回控件本身。
 */
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

UIPath.prototype.updateObjs = function(canvas) {
	this.elapsedTime += canvas.timeStep;
	var elapsedTime = this.elapsedTime;
	
	var a = this.shapesInfo.slice();
	var n = this.shapesInfo.length;
	var pathAnimation = this.pathAnimation;
	var duration = pathAnimation.getDuration();

	for(var i = 0; i < n; i++) {
		var iter = a[i];
		var shape = iter.shape;
		if(!shape || !shape.parentShape) continue;

		var t = elapsedTime - iter.startTime;
		if(t > 0 && !iter.done) {
			var angle = pathAnimation.getDirection(t);
			var position = pathAnimation.getPosition(t);

			if(!shape.visible) {
				shape.setVisible(true);
			}

			if(shape.anchor) {
				shape.setPosition(position.x, position.y);
			}
			else {
				shape.setPosition(position.x-(shape.w>>1), position.y-(shape.h>>1));
			}
			if(!iter.noRotation) {
				shape.setRotation(angle);
			}

			if(iter.onStep) {
				var onStep = iter.onStep;
				onStep(shape, t, position, angle);
			}
			
			if(t > duration) {
				iter.done = true;
				if(iter.onDone) {
					var onDone = iter.onDone;
					onDone(shape);
				}
			}
		}
	}
}

UIPath.prototype.paintSelf = function(canvas) {
	if(this.isIcon || this.isInDesignMode()) {
		UIElement.prototype.paintSelf.call(this, canvas);
		return;
	}

	if(this.showPath && !this.isStrokeColorTransparent()) {
		canvas.strokeStyle = this.style.lineColor;
		canvas.lineWidth = this.style.lineWidth;
		this.pathAnimation.draw(canvas);
	}

	if(this.animationState === UIElement.STATE_RUNNING) {
		this.updateObjs(canvas);
		canvas.needRedraw++;
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
