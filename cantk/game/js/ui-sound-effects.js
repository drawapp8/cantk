/*
 * File:   ui-sound.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic sound for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UISoundEffects
 * @extends UICheckBox
 * 音效开关。
 *
 * 可以在项目设置中添加背景音效文件，添加的音效文件是全局的，删除音效控件并不会删除音效文件。
 *
 * 可以通过任何一个控件调用playSoundEffect播放音效。
 *
 */
function UISoundEffects() {
	return;
}

UISoundEffects.prototype = new UICheckBox();
UISoundEffects.prototype.isUISoundEffects = true;

UISoundEffects.prototype.initUISoundEffects = function(type) {
	this.initUICheckBox(type);	

	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	return this;
}

UISoundEffects.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUISoundEffects || shape.isUISoundMusic) {
		return false;
	}

	return UIGroup.prototype.shapeCanBeChild.call(this, shape);
}

UISoundEffects.prototype.setValue = function(value) {
	if(this.isInDesignMode()) {
		return this;
	}

	this.setSoundEffectEnable(value);

	return this;
}

UISoundEffects.prototype.getValue = function(value) {
	if(this.isInDesignMode()) {
		return true;
	}

	return this.getSoundEffectEnable(value);
}

UISoundEffects.prototype.isPlaying = UISoundEffects.prototype.getValue;

function UISoundEffectsCreator() {
	var args = ["ui-sound-effects", "ui-sound-effects", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISoundEffects();
		return g.initUISoundEffects(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISoundEffectsCreator());

