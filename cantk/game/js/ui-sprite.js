/*
 * File:   ui-sprite.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Basic sprite for game. 
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UISprite() {
	return;
}

UISprite.prototype = new UIImage();
UISprite.prototype.isUISprite = true;

UISprite.prototype.initUISprite = function(type, w, h, bg) {
	this.initUIImage(type, w ,h, bg);	

	return this;
}

function UISpriteCreator() {
	var args = ["ui-sprite", "ui-sprite", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISprite();
		return g.initUISprite(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISpriteCreator());

