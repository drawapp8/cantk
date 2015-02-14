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
	this.setDefSize(100, 100);
	this.maxTryTimes = 10;

	return this;
}

UIUnkown.prototype.shapeCanBeChild = function(shape) {
	return true;
}

UIUnkown.prototype.tryCreateRealElement = function() {
	if(this.maxTryTimes < 1) return;

	var js = this.realObjJs;
	var parentShape = this.parentShape;
	var shape = ShapeFactoryGet().createShape(js.type, C_CREATE_FOR_PROGRAM, true);

	if(shape) {
		this.realObjJs = null;
		var index = parentShape.getIndexOfChild(this);

		shape.fromJson(js);
		parentShape.addChild(shape, index);
		parentShape.removeChild(this);
		console.log("Create real obj done:" + js.type);
	}
	else {
		this.maxTryTimes--;
		if(this.maxTryTimes < 1) {
			this.realObjJs = null;
			console.log("Create real obj failed:" + js.type);
		}
	}
}

UIUnkown.prototype.paintSelfOnly =function(canvas) {
	this.tryCreateRealElement();

	return;
}

UIUnkown.prototype.toJson = function() {
	return this.realObjJs;
}

UIUnkown.prototype.fromJson = function(js) {
	this.realObjJs = js;
	this.setDefSize(js.w, js.h);

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

