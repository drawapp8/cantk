/*
 * File:   ui-group.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Group
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIGroup
 * @extends UIElement
 * 分组控件。可以拖放分组控件来创建，也可以把几个控件组合起来。
 *
 * 可以在属性页中设置背景和边框的颜色，如果不需要背景和边框的颜色，把相应的颜色删除就行了。
 *
 */
function UIGroup() {
	return;
}

UIGroup.prototype = new UIElement();
UIGroup.prototype.isUIGroup = true;

UIGroup.prototype.initUIGroup = function(type, w, h, img) {
	this.initUIElement(type);	

	this.roundRadius = 5;
	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, img);
	this.setCanRectSelectable(false, false);
	this.addEventNames(["onInit"]);
	this.style.lineColor = "rgba(0,0,0,0)";
	this.style.fillColor = "rgba(0,0,0,0)";
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;

	return this;
}

UIGroup.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar || shape.isUIWindow || shape.isUIListItem) {
		return false;
	}

	return true;
}

UIGroup.prototype.onPointerUpEditing = function(point, beforeChild) {

	return;
}

UIGroup.prototype.fixChildPosition = function(child) {
}

UIGroup.prototype.fixChildSize = function(child) {
}

UIGroup.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image) {
		canvas.beginPath();
		drawRoundRect(canvas, this.w, this.h, this.roundRadius);
		
		if(!this.isFillColorTransparent()) {
			canvas.fillStyle = this.style.fillColor;
			canvas.fill();
		}

		if(!this.isStrokeColorTransparent()) {
			canvas.lineWidth = this.style.lineWidth;
			canvas.strokeStyle = this.style.lineColor;
			canvas.stroke();	
		}
	}

	return;
}

UIGroup.prototype.onPositionChanged = function() {
	var children = this.children;
	var n = children.length;

	for(var i = 0; i < n; i++) {
		var iter = children[i];
		if(iter.isUIBody || iter.isUIGroup || iter.isUIEdge){
			iter.onPositionChanged();
		}
	}

	return;
}


function UIGroupCreator(w, h, img) {
	var args = ["ui-group", "ui-group", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIGroup();

		return g.initUIGroup(this.type, w, h, img);
	}
	
	return;
}

UIGroup.create = function() {
	var g = new UIGroup();
	
	g.initUIGroup("ui-group", 200, 200, null);
	g.state = Shape.STAT_NORMAL;

	return g;
}

