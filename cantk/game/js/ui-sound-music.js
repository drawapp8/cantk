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
 * @class UISoundMusic
 * @extends UICheckBox
 * 背景音乐开关。
 *
 * 可以在项目设置中添加背景音乐文件，添加的背景音乐文件是全局的，删除背景音乐控件并不会删除背景音乐文件。
 *
 * 可以通过任何一个控件调用playSoundMusic播放背景音乐。
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
	if(shape.isUISoundEffects || shape.isUISoundMusic) {
		return false;
	}

	return UIGroup.prototype.shapeCanBeChild.call(this, shape);
}


UISoundMusic.prototype.setValue = function(value) {
	if(this.isInDesignMode()) {
		return this;
	}

	this.setSoundMusicEnable(value);
	
	return this;
}

UISoundMusic.prototype.getValue = function(value) {
	if(this.isInDesignMode()) {
		return true;
	}

	return this.getSoundMusicEnable();
}

UISoundMusic.prototype.isPlaying = UISoundMusic.prototype.getValue;

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

