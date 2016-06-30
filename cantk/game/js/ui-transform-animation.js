/*
 * File:   ui-transform-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Animation By Change Transform.
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

/**
 * @class UITransformAnimation
 * @extends UIImage
 * 通过几何变换实现动画效果。它本身只是一张图片，可以放入其它动画在里面，实现更复杂的效果。
 *
 */
function UITransformAnimation() {
	return;
}

UITransformAnimation.prototype = new UIImage();
UITransformAnimation.prototype.isUITransformAnimation = true;

UITransformAnimation.prototype.initUITransformAnimation = function(type, w, h, bg) {
	this.initUIImage(type, w, h, bg);	

	this.animationConfig = {};
	this.animationConfig.opacityFrom = 1;
	this.animationConfig.opacityTo = 1;
	this.animationConfig.scaleXFrom = 1;
	this.animationConfig.scaleXTo = 1;
	this.animationConfig.scaleYFrom = 1;
	this.animationConfig.scaleYTo = 1;
	this.animationConfig.rotationFrom = 0;
	this.animationConfig.rotationTo = 0;
	this.animationConfig.offsetXFrom = 0;
	this.animationConfig.offsetXTo = 0;
	this.animationConfig.offsetYFrom = 0;
	this.animationConfig.offsetYTo = 0;
	this.animationConfig.frequency = 2;
	this.animationConfig.random = 1000 * Math.random();

	return this;
}

/**
 * @method pause
 * 暂停动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UITransformAnimation.prototype.pause = function() {
	if(this.highlightConfig) {
		this.highlightConfig.paused = true;
	}

	return this;
}

/**
 * @method resume 
 * 恢复动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UITransformAnimation.prototype.resume = function() {
	if(this.highlightConfig) {
		this.highlightConfig.paused = false;
	}

	return this;
}

/**
 * @method play
 * 播放动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UITransformAnimation.prototype.play = function() {
	this.setHighlightConfig(this.animationConfig);

	return this;
}

/**
 * @method stop
 * 停止动画。
 * @return {UIElement} 返回控件本身。
 *
 */
UITransformAnimation.prototype.stop = function() {
	this.setHighlightConfig(null);

	return this;
}

UITransformAnimation.prototype.getScaleXFrom = function() {
	return this.animationConfig.scaleXFrom;
}

UITransformAnimation.prototype.setScaleXFrom = function(scaleXFrom) {
	this.animationConfig.scaleXFrom = scaleXFrom;
	this.play();

	return this;
}

UITransformAnimation.prototype.getScaleXTo = function() {
	return this.animationConfig.scaleXTo;
}

UITransformAnimation.prototype.setScaleXTo = function(scaleXTo) {
	this.animationConfig.scaleXTo = scaleXTo;
	this.play();

	return this;
}

UITransformAnimation.prototype.getScaleYFrom = function() {
	return this.animationConfig.scaleYFrom;
}

UITransformAnimation.prototype.setScaleYFrom = function(scaleYFrom) {
	this.animationConfig.scaleYFrom = scaleYFrom;
	this.play();

	return this;
}

UITransformAnimation.prototype.getScaleYTo = function() {
	return this.animationConfig.scaleYTo;
}

UITransformAnimation.prototype.setScaleYTo = function(scaleYTo) {
	this.animationConfig.scaleYTo = scaleYTo;
	this.play();

	return this;
}

UITransformAnimation.RADIAN_TO_ANGLE = 180/Math.PI;

UITransformAnimation.prototype.getRotationFrom = function() {
	return this.animationConfig.rotationFrom * UITransformAnimation.RADIAN_TO_ANGLE;
}

UITransformAnimation.prototype.setRotationFrom = function(rotationFrom) {
	this.animationConfig.rotationFrom = rotationFrom/UITransformAnimation.RADIAN_TO_ANGLE;
	this.play();

	return this;
}

UITransformAnimation.prototype.getRotationTo = function() {
	return this.animationConfig.rotationTo * UITransformAnimation.RADIAN_TO_ANGLE;
}

UITransformAnimation.prototype.setRotationTo = function(rotationTo) {
	this.animationConfig.rotationTo = rotationTo/UITransformAnimation.RADIAN_TO_ANGLE;
	this.play();

	return this;
}

UITransformAnimation.prototype.getOpacityFrom = function() {
	return this.animationConfig.opacityFrom;
}

UITransformAnimation.prototype.setOpacityFrom = function(opacityFrom) {
	this.animationConfig.opacityFrom = opacityFrom;
	this.play();

	return this;
}

UITransformAnimation.prototype.getOpacityTo = function() {
	return this.animationConfig.opacityTo;
}

UITransformAnimation.prototype.setOpacityTo = function(opacityTo) {
	this.animationConfig.opacityTo = opacityTo;
	this.play();

	return this;
}

UITransformAnimation.prototype.getXFrom = function() {
	return this.animationConfig.offsetXFrom;
}

UITransformAnimation.prototype.setXFrom = function(offsetXFrom) {
	this.animationConfig.offsetXFrom = offsetXFrom;
	this.play();

	return this;
}

UITransformAnimation.prototype.getXTo = function() {
	return this.animationConfig.offsetXTo;
}

UITransformAnimation.prototype.setXTo = function(offsetXTo) {
	this.animationConfig.offsetXTo = offsetXTo;
	this.play();

	return this;
}

UITransformAnimation.prototype.getYFrom = function() {
	return this.animationConfig.offsetYFrom;
}

UITransformAnimation.prototype.setYFrom = function(offsetYFrom) {
	this.animationConfig.offsetYFrom = offsetYFrom;
	this.play();

	return this;
}

UITransformAnimation.prototype.getYTo = function() {
	return this.animationConfig.offsetYTo;
}

UITransformAnimation.prototype.setYTo = function(offsetYTo) {
	this.animationConfig.offsetYTo = offsetYTo;
	this.play();

	return this;
}

UITransformAnimation.prototype.getFrequency = function() {
	return this.animationConfig.frequency;
}

UITransformAnimation.prototype.setFrequency = function(frequency) {
	this.animationConfig.frequency = frequency;
	this.play();

	return this;
}

UITransformAnimation.prototype.getRandom = function() {
	return this.animationConfig.random;
}

UITransformAnimation.prototype.setRandom = function(random) {
	this.animationConfig.random = random%1000;
	this.play();

	return this;
}

UITransformAnimation.prototype.doFromJson = function(js) {
	UISprite.prototype.doFromJson.call(this, js);

	if(js.animationConfig) {
		this.animationConfig = JSON.parse(JSON.stringify(js.animationConfig));
		this.play();
	}

	return;
}

UITransformAnimation.prototype.doToJson = function(o) {
	UISprite.prototype.doToJson.call(this, o);

	o.animationConfig = JSON.parse(JSON.stringify(this.animationConfig));

	return o;
}

UITransformAnimation.prototype.beforePaintChildren = function(canvas) {
//	this.applyTransform(canvas);

	return this;
}

UITransformAnimation.prototype.onInit = function() {
	this.play();

	return;
}

function UITransformAnimationCreator() {
	var args = ["ui-transform-animation", "ui-transform-animation", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UITransformAnimation();
		return g.initUITransformAnimation(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UITransformAnimationCreator());

