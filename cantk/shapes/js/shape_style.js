/*
 * File: shape_style.js
 * Brief: shape style
 * Web Site: http://www.drawapp8.com
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */
function ShapeStyle() {
}
	
ShapeStyle.prototype.getFont = function() {
	var font = "";
	
	if(this.textI) {
		font = "italic  "
	}
	
	if(this.textB) {
		font = font + "bold "
	}
	
	font = font + this.fontSize + "pt \"" + this.fontFamily + "\"";

	return font;
}

ShapeStyle.prototype.setLineWidth = function(value) {
	this.lineWidth = value > 0 ? value : 1;

	return;
}

ShapeStyle.prototype.setLineColor = function(value) {
	this.lineColor = value;

	return;
}

ShapeStyle.prototype.setFillColor = function(value) {
	this.fillColor = value;

	return;
}

ShapeStyle.prototype.setTextColor = function(value) {
	this.textColor = value;

	return;
}

ShapeStyle.prototype.setFontSize = function(value) {
	var fontSize = Math.max(value, 6);

	this.fontSize = fontSize;

	return;
}

ShapeStyle.prototype.setFontFamily = function(fontFamily) {
	this.fontFamily = fontFamily ? fontFamily : "serif";

	return;
}

ShapeStyle.prototype.setTextB = function(value) {
	this.textB = value;

	return;
}

ShapeStyle.prototype.setTextU = function(value) {
	this.textU = value;

	return;
}

ShapeStyle.prototype.setTextI = function(value) {
	this.textI = value;

	return;
}

ShapeStyle.prototype.getStrokeStyle = function(canvas) {
	return this.strokeColor;
}

ShapeStyle.prototype.copy = function(other) {
	var js = other.toJson();

	this.fromJson(js);

	return ;
}

ShapeStyle.prototype.toJson = function() {
	var o = {};

	for(var key in this) {
		var value = this[key];
		if(typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
			o[key] = value;
		}
	}

	return o;
}

ShapeStyle.prototype.fromJson = function(js) {
	for(var key in js) {
		var value = js[key];
		if(key.length < 4) continue;
		if(typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
			this[key] = value;
		}
	}

	return;
}

ShapeStyle.prototype.dup = function() {
	var other = new ShapeStyle();
	
	other.copy(this);
	
	return other;
}

ShapeStyle.prototype.equalTo = function(style) {
	var thisJson = JSON.stringify(this.toJson());
	var otherJson = JSON.stringify(style.toJson());

	return thisJson === otherJson;
}

ShapeStyle.createFromJson = function(js) {
	var style = new ShapeStyle();

	style.fromJson(js);

	return style;
}

ShapeStyle.create = function() {
	return new ShapeStyle();
}

