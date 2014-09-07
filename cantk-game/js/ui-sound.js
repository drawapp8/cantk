/*
 * File:   ui-sound.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic sound for game. 
 * 
 * Copyright (c) 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISound() {
	return;
}

UISound.prototype = new UICheckBox();
UISound.prototype.isUISound = true;

UISound.prototype.initUISound = function(type, w, h, bg) {
	this.initUICheckBox(type, w, h, null, null, null, null, null, null);	

	this.setTextType(C_SHAPE_TEXT_NONE);
	this.images.display = CANTK_IMAGE_DISPLAY_CENTER;
	this.soundURL = "";
	this.loop = true;
	this.autoPlay = true;
	this.runtimeVisible = true;

	return this;
}

UISound.prototype.setSoundURL = function(soundURL) {
	this.soundURL = soundURL;

	return;
}

UISound.prototype.setAutoPlay = function(autoPlay) {
	this.autoPlay = autoPlay;

	return;
}

UISound.prototype.setRuntimeVisible = function(runtimeVisible) {
	this.runtimeVisible = runtimeVisible;

	return;
}

UISound.prototype.setLoop = function(loop) {
	this.loop = loop;

	return;
}

UISound.prototype.stop = function() {
	if(this.audio) {
		this.audio.pause();
	}

	return;
}

UISound.prototype.play = function() {
	if(this.audio) {
		this.playing = true;
		this.audio.play();
	}

	return;
}

UISound.prototype.setValue = function(value) {
	this.value = value;
	if(this.audio) {
		var muted = !value;
		if(value && !this.playing) {
			this.audio.play();
		}
		this.audio.muted = muted;
	}

	return;
}

UISound.prototype.mute = function(value) {
	this.setValue(!value);

	return;
}


UISound.prototype.onModeChanged = function() {
	this.stop();

	return;
}

UISound.prototype.onInit = function() {
	this.visible = this.runtimeVisible;

	if(!this.visible) {
		this.setValue(true);
	}

	if(this.autoPlay) {
		this.setValue(true);
	}

	if(this.soundURL) {
		var audio = new Audio();
		audio.addEventListener('ended',function(e){
			console.log("audio end");

			return;
		});
		
		audio.addEventListener('error', function(e){
			console.log("error:" + audio.src);

			return;
		});

		audio.addEventListener('playing',function(e){
			console.log("playing:" + audio.src);
			return;
		});

		audio.addEventListener('progress',function(e){
			console.log("progress:" + audio.src);
			return;
		});
	
		audio.src = this.soundURL;
		audio.load();
		audio.loop = this.loop ? "loop" : "";

		this.audio = audio;
		if(this.autoPlay) {
			this.play();
		}

		audio.muted = !this.getValue();

		return;
	}
}

UISound.prototype.shapeCanBeChild = function(shape) {
	return false;
}

function UISoundCreator() {
	var args = ["ui-sound", "ui-sound", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISound();
		return g.initUISound(this.type, 100, 100, null);
	}
	
	return;
}

