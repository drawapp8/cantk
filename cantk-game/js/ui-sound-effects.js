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

UISoundEffects.prototype.initUISoundEffects = function(type, w, h, bg) {
	this.initUICheckBox(type, w, h, null, null, null, null, null, null);	

	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	return this;
}

UISoundEffects.prototype.onInit = function() {
	this.setValue(true);
	wm.setSoundEffectsEnable(true);

	return;
}

UISoundEffects.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UISoundEffects.prototype.play = function(name) {
	var wm = this.getWindowManager();

	return wm.playSoundEffect(name);
}

UISoundEffects.prototype.onClick = function(point, beforeChild) {
	if(beforeChild || this.mode === Shape.MODE_EDITING) {
		return;
	}
	
	this.setValue(!this.value);
	var wm = this.getWindowManager();
	var value = this.getValue();

	wm.setSoundEffectsEnable(value);

	return;
}

function UISoundEffectsCreator() {
	var args = ["ui-sound-effects", "ui-sound-effects", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISoundEffects();
		return g.initUISoundEffects(this.type, 100, 100, null);
	}
	
	return;
}

