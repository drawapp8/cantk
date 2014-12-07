/*
 * File:   ui-transform-animation.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Animation By Change Transform.
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UITransformAnimation() {
	return;
}

UITransformAnimation.prototype = new UISprite();
UITransformAnimation.prototype.isUITransformAnimation = true;

UITransformAnimation.prototype.initUITransformAnimation = function(type, w, h, bg) {
	this.initUISprite(type, w, h, bg);	

	this.animationConfig = {};
	this.animationConfig.opacityFrom = 1;
	this.animationConfig.opacityTo = 1;
	this.animationConfig.scaleFrom = 1;
	this.animationConfig.scaleTo = 1;
	this.animationConfig.rotationFrom = 0;
	this.animationConfig.rotationTo = 0;
	this.animationConfig.offsetXFrom = 0;
	this.animationConfig.offsetXTo = 0;
	this.animationConfig.offsetYFrom = 0;
	this.animationConfig.offsetYTo = 0;
	this.animationConfig.frequency = 2;
	this.animationConfig.random = 1000 * Math.random();

	this.regSerializer(this.taToJson, this.taFromJson);

	return this;
}


UITransformAnimation.prototype.play = function() {
	this.setHighlightConfig(this.animationConfig);

	return;
}

UITransformAnimation.prototype.stop = function() {
	this.setHighlightConfig(null);

	return;
}

UITransformAnimation.prototype.getScaleFrom = function() {
	return this.animationConfig.scaleFrom;
}

UITransformAnimation.prototype.setScaleFrom = function(scaleFrom) {
	this.animationConfig.scaleFrom = scaleFrom;

	return this;
}

UITransformAnimation.prototype.getScaleTo = function() {
	return this.animationConfig.scaleTo;
}

UITransformAnimation.prototype.setScaleTo = function(scaleTo) {
	this.animationConfig.scaleTo = scaleTo;

	return this;
}

UITransformAnimation.RADIAN_TO_ANGLE = 180/Math.PI;

UITransformAnimation.prototype.getRotationFrom = function() {
	return this.animationConfig.rotationFrom * UITransformAnimation.RADIAN_TO_ANGLE;
}

UITransformAnimation.prototype.setRotationFrom = function(rotationFrom) {
	this.animationConfig.rotationFrom = rotationFrom/UITransformAnimation.RADIAN_TO_ANGLE;

	return this;
}

UITransformAnimation.prototype.getRotationTo = function() {
	return this.animationConfig.rotationTo * UITransformAnimation.RADIAN_TO_ANGLE;
}

UITransformAnimation.prototype.setRotationTo = function(rotationTo) {
	this.animationConfig.rotationTo = rotationTo/UITransformAnimation.RADIAN_TO_ANGLE;

	return this;
}

UITransformAnimation.prototype.getOpacityFrom = function() {
	return this.animationConfig.opacityFrom;
}

UITransformAnimation.prototype.setOpacityFrom = function(opacityFrom) {
	this.animationConfig.opacityFrom = opacityFrom;

	return this;
}

UITransformAnimation.prototype.getOpacityTo = function() {
	return this.animationConfig.opacityTo;
}

UITransformAnimation.prototype.setOpacityTo = function(opacityTo) {
	this.animationConfig.opacityTo = opacityTo;

	return this;
}

UITransformAnimation.prototype.getXFrom = function() {
	return this.animationConfig.offsetXFrom;
}

UITransformAnimation.prototype.setXFrom = function(offsetXFrom) {
	this.animationConfig.offsetXFrom = offsetXFrom;

	return this;
}

UITransformAnimation.prototype.getXTo = function() {
	return this.animationConfig.offsetXTo;
}

UITransformAnimation.prototype.setXTo = function(offsetXTo) {
	this.animationConfig.offsetXTo = offsetXTo;

	return this;
}

UITransformAnimation.prototype.getYFrom = function() {
	return this.animationConfig.offsetYFrom;
}

UITransformAnimation.prototype.setYFrom = function(offsetYFrom) {
	this.animationConfig.offsetYFrom = offsetYFrom;

	return this;
}

UITransformAnimation.prototype.getYTo = function() {
	return this.animationConfig.offsetYTo;
}

UITransformAnimation.prototype.setYTo = function(offsetYTo) {
	this.animationConfig.offsetYTo = offsetYTo;

	return this;
}

UITransformAnimation.prototype.getFrequency = function() {
	return this.animationConfig.frequency;
}

UITransformAnimation.prototype.setFrequency = function(frequency) {
	this.animationConfig.frequency = frequency;

	return this;
}

UITransformAnimation.prototype.getRandom = function() {
	return this.animationConfig.random;
}

UITransformAnimation.prototype.setRandom = function(random) {
	this.animationConfig.random = random%1000;

	return this;
}

UITransformAnimation.prototype.taFromJson = function(js) {
	if(js.animationConfig) {
		this.animationConfig = js.animationConfig;
	}

	return;
}

UITransformAnimation.prototype.taToJson = function(o) {
	o.animationConfig = this.animationConfig;

	return o;
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
