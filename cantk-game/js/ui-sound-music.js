/*
 * File:   ui-sound.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic sound for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISoundMusic() {
	return;
}

UISoundMusic.prototype = new UICheckBox();
UISoundMusic.prototype.isUISoundMusic = true;

UISoundMusic.prototype.initUISoundMusic = function(type, w, h, bg) {
	this.initUICheckBox(type, w, h, null, null, null, null, null, null);	

	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	return this;
}

UISoundMusic.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UISoundMusic.prototype.onInit = function() {
	var wm = this.getWindowManager();

	this.setValue(wm.soundMusicAutoPlay);

	return;
}

UISoundMusic.prototype.play = function(name) {
	var wm = this.getWindowManager();

	return wm.playSoundMusic(name);
}

UISoundMusic.prototype.stop = function(name) {
	var wm = this.getWindowManager();

	return wm.stopSoundMusic(name);
}

UISoundMusic.prototype.onClick = function(point, beforeChild) {
	if(beforeChild || this.mode === Shape.MODE_EDITING) {
		return;
	}
	
	this.setValue(!this.value);
	var wm = this.getWindowManager();
	var value = this.getValue();

	if(!value) {
		wm.stopSoundMusic();
	}
	else {
		wm.playSoundMusic();
	}

	return;
}

function UISoundMusicCreator() {
	var args = ["ui-sound-music", "ui-sound-music", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISoundMusic();
		return g.initUISoundMusic(this.type, 100, 100, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISoundMusicCreator());

