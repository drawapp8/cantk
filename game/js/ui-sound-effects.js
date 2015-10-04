/*
 * File:   ui-sound.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic sound for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
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
	return false;
}

UISoundEffects.prototype.setValue = function(value) {
	var wm = this.getWindowManager();
	
	if(this.mode === Shape.MODE_EDITING) {
		return this;
	}

	if(wm) {
		wm.setSoundEffectsEnable(value);
	}

	return this;
}

UISoundEffects.prototype.getValue = function(value) {
	var wm = this.getWindowManager();
	if(wm) {
		return wm.soundEffectsEnalbe;
	}
	else {
		return true;
	}
}

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

