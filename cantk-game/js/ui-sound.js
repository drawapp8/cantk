/*
 * File:   ui-sound.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic sound for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISound() {
	return;
}

UISound.prototype = new UICheckBox();
UISound.prototype.isUISound = true;

UISound.prototype.initUISound = function(type, w, h, bg) {
	this.initUICheckBox(type, w, h, null, null, null, null, null, null);	

	this.soundURL = "";
	this.loop = true;
	this.autoPlay = true;
	this.runtimeVisible = true;
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;

	return this;
}

UISound.prototype.setSoundURL = function(soundURL) {
	this.soundURL = soundURL;

	return;
}

UISound.prototype.setAutoPlay = function(autoPlay) {
	this.value = autoPlay;
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

UISound.prototype.isPlaying = function() {
	return this.playing;
}

UISound.prototype.pause = function() {
	if(this.audio && this.playing) {
		this.audio.pause();
		this.playing = false;
	}

	return;
}

UISound.prototype.stop = function() {
	if(this.audio && this.playing) {
		this.audio.stop();
		this.playing = false;
	}

	return;
}

UISound.prototype.play = function(force) {
	if(this.audio && (!this.playing || force)) {
		this.audio.play();
		this.playing = true;
	}

	return;
}

UISound.prototype.mute = function(value) {
	this.setValue(!value);

	return;
}

UISound.prototype.setValue = function(value) {
	this.value = value;

	if(value) {
		this.play();
	}
	else {
		this.pause();
	}

	return;
}

UISound.prototype.onModeChanged = function() {
	this.stop();

	return;
}

UISound.songs = [];
UISound.addSong = function(song) {
	UISound.songs.push(song);

	return;
}

UISound.removeSong = function(url) {
	for(var i = 0; i < UISound.songs.length; i++) {
		var iter = UISound.songs[i];
		if(iter.url === url) {
			iter.stop();
			UISound.songs.remove(iter);
			
			return iter;
		}
	}

	return null;
}

UISound.prototype.onInit = function() {
	var me = this;
	this.visible = this.runtimeVisible;
	if(this.soundURL) {
		var config = {
			urls: [this.soundURL],
			autoplay: this.autoPlay,
			loop: this.loop,
			volume: 0.8,
		};
		
		config.onend = function() {
			me.playing = false;
			console.log("audio end.");
		}

		UISound.removeSong(this.soundURL);
		var audio = new Howl(config);
		audio.url = this.soundURL;
		UISound.addSong(audio);

		if(!this.getValue()) {
			audio.mute();
		}

		if(this.autoPlay) {
			this.playing = true;
		}

		this.audio = audio;

		return;
	}
}

UISound.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UISound.prototype.onClick = function(point, beforeChild) {
	if(beforeChild || this.mode === Shape.MODE_EDITING) {
		return;
	}
	
	this.setValue(!this.value);
	this.callOnClickHandler(point);

	return;
}

UISound.prototype.onFromJsonDone = function() {
	if(this.soundURL) {
		ResLoader.loadAudio(this.soundURL, function(audio) {
			console.log("audio loaded: " + audio.src);
		});
	}

	return;
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

