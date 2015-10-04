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

UISoundMusic.prototype.initUISoundMusic = function(type) {
	this.initUICheckBox(type);	

	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	return this;
}

UISoundMusic.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UISoundMusic.prototype.setValue = function(value) {
	var wm = this.getWindowManager();

	if(!wm) {
		return this;
	}

	if(this.mode === Shape.MODE_EDITING) {
		return this;
	}
	
	wm.setSoundMusicsEnable(value);
	if(!value) {
		wm.stopSoundMusic();
	}
	else {
		wm.playSoundMusic();
	}
	
	return this;
}

UISoundMusic.prototype.getValue = function(value) {
	var wm = this.getWindowManager();

	if(!wm) {
		return true;
	}

	if(this.mode === Shape.MODE_EDITING) {
		return wm.soundMusicAutoPlay;
	}
	else {
		return wm.soundMusicsPlaying;
	}
}

function UISoundMusicCreator() {
	var args = ["ui-sound-music", "ui-sound-music", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISoundMusic();
		return g.initUISoundMusic(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISoundMusicCreator());

