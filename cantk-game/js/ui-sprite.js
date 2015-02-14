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

UISprite.prototype = new UIElement();
UISprite.prototype.isUISprite = true;

UISprite.prototype.initUISprite = function(type, w, h, bg) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_CENTER;
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);
	this.setImage("option_image_6", null);
	this.setImage("option_image_7", null);
	this.setImage("option_image_8", null);
	this.setImage("option_image_9", null);
	this.setImage("option_image_10", null);
	this.setImage("option_image_11", null);
	this.setImage("option_image_12", null);
	this.setImage("option_image_13", null);
	this.setImage("option_image_14", null);
	this.setCanRectSelectable(false, true);
	this.addEventNames(["onDoubleClick", "onUpdateTransform"]);

	return this;
}

UISprite.prototype.afterChildAppended = function(shape) {
	shape.xAttr = UIElement.X_CENTER_IN_PARENT;
	shape.yAttr = UIElement.Y_MIDDLE_IN_PARENT;

	return;
}

UISprite.prototype.setValue = function(value) {
	return this.setImageSrc(value);
}

UISprite.prototype.getValue = function() {
	return this.getImageSrc();
}

UISprite.prototype.setImageSrc = function(value) {
	this.setImage(UIElement.IMAGE_DEFAULT, value);

	return this;
}

UISprite.prototype.getImageSrc = function(type) {
	return this.getImageSrcByType(type ? type : UIElement.IMAGE_DEFAULT);
}

UISprite.prototype.getHtmlImage = function() {
	return this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
}

UISprite.prototype.getImageSrcRect = function() {
	var image = this.getImageByType(UIElement.IMAGE_DEFAULT);
	if(image) {
		return image.getImageRect();
	}
	else {
		return null;
	}
}

UISprite.prototype.drawBgImage =function(canvas) {
	var image = this.getBgHtmlImage();

	if(image) {
		var srcRect = this.getImageSrcRect();
		this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h, srcRect);
	}

	return;
}

UISprite.prototype.shapeCanBeChild = function(shape) {
	if(!UIGroup.prototype.shapeCanBeChild.call(this, shape) || (shape.isUIJoint && !shape.isUIMouseJoint)) {
		return false;
	}

	if(this.widthAttr === UIElement.WIDTH_FILL_PARENT && this.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		return false;
	}

	if(shape.isUIPhysicsShape || shape.isUIMouseJoint) {
		var n = this.children.length;
		for(var i = 0; i < n; i++) {
			var iter = this.children[i];
			if(iter.isUIPhysicsShape && shape.isUIPhysicsShape) {
				return false;
			}
			if(iter.isUIMouseJoint && shape.isUIMouseJoint) {
				return false;
			}
		}
	}

	return true;
}

UISprite.prototype.onSized = UIImage.prototype.onSized;

function UISpriteCreator() {
	var args = ["ui-sprite", "ui-sprite", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UISprite();
		return g.initUISprite(this.type, 200, 200, null);
	}
	
	return;
}
