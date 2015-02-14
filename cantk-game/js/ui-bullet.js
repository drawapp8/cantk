/*
 * File:   ui-bullet.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Bullet
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIBullet() {
	return;
}

UIBullet.prototype = new UISprite();
UIBullet.prototype.isUIBullet = true;

UIBullet.prototype.initUIBullet = function(type, w, h, bg) {
	this.initUISprite(type, w, h, bg);	

	this.leastGap = 10;
	this.alphaFrom = 0.1;
	this.alphaTo = 1.0;

	return this;
}

UIBullet.prototype.callOnMoved = function() {
	var trace = {};
	trace.x = this.x;
	trace.y = this.y;
	trace.rotation = this.rotation;

	UIElement.prototype.callOnMoved.call(this);

	if(!this.traces) {
		this.traces = [trace];
		return;
	}

	var lastTrace = this.traces[this.traces.length-1];

	if(Math.distanceBetween(trace, lastTrace) > (Math.max(this.w, this.h) + this.leastGap)) {
		this.traces.push(trace);
	}

	return;
}

UIBullet.prototype.paintSelf = function(canvas) {
	if(this.traces && this.traces.length) {
		var x = this.x;
		var y = this.y;
		var opacity = this.opacity;
		var rotation = this.rotation;
		var n = this.traces.length;
		var delta = (this.alphaTo - this.alphaFrom)/n;

		for(var i = 0; i < this.traces.length; i++) {
			var iter = this.traces[i];
			this.x = iter.x;
			this.y = iter.y;
			this.rotation = iter.rotation;
			this.opacity = this.alphaFrom + delta * i;

			UIElement.prototype.paintSelf.call(this, canvas);
		}

		this.x = x;
		this.y = y;
		this.rotation = rotation;
		this.opacity = opacity;
	}

	UIElement.prototype.paintSelf.call(this, canvas);

	return;
}

function UIBulletCreator() {
	var args = ["ui-bullet", "ui-bullet", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIBullet();
		return g.initUIBullet(this.type, 200, 200, null);
	}
	
	return;
}
