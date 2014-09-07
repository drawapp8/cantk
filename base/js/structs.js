/*
 * File: struct.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: common used structs
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function Rect(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	
	return this;
}

Rect.prototype.dup = function() {
	return new Rect(this.x, this.y, this.w, this.h);
}

function Point(x, y) {
    this.x = x;
    this.y = y;
    
    return this;
}

Point.prototype.dup = function() {
	return new Point(this.x, this.y);
}

Point.prototype.copy = function(point) {
	this.x = point.x;
	this.y = point.y;

	return;
}

function pointEqual(p1, p2) {
	return p1.x === p2.x && p1.y === p2.y;
}

function distanceBetween(p1, p2) {
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;

	var d = Math.sqrt(dx * dx + dy * dy);

	return d;
}

