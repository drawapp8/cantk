/*
 * File:   ui-unkown.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  There are two conditions that shape factory can not find creator for a type: 
 *           1.The creator is not loaded yet.
 *           2.There is not such creator.
 *         For the first condition, we create a proxy first, try it create the real element later.
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIUnkown() {
	return;
}

UIUnkown.prototype = new UIElement();
UIUnkown.prototype.isUIUnkown = true;

UIUnkown.prototype.initUIUnkown = function(type) {
	this.initUIElement(type);	

	return this;
}

function UIUnkownCreator() {
	var args = ["ui-unkown", "ui-unkown", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIUnkown();
		return g.initUIUnkown(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIUnkownCreator());

