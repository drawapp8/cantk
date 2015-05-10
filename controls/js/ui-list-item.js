/*
 * File:   ui-list-item.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  List Item
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIListItem() {
	return;
}

UIListItem.prototype = new UIElement();
UIListItem.prototype.isUIListItem = true;

UIListItem.prototype.initUIListItem = function(type) {
	this.initUIElement(type);	

	this.setDefSize(200, 120);
	this.widthAttr = UIElement.WIDTH_FILL_PARENT; 
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;
	this.setImage(UIElement.IMAGE_FOCUSED, null);
	this.setImage(UIElement.IMAGE_ACTIVE, null);
	this.setImage(UIElement.IMAGE_NORMAL, null);
	this.setImage(UIElement.IMAGE_DISABLE, null);
	this.setImage(UIElement.IMAGE_POINTER_OVER, null);
	this.setImage(UIElement.IMAGE_DELETE_ITEM, null);
	this.addEventNames(["onLongPress", "onRemoved"]);

	return this;
}

UIListItem.prototype.dragMove = function(dx, dy) {
	this.y = this.y + dy;
	this.onDragging();

	return;
}

UIListItem.prototype.getDeleteItemIcon = function() {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DELETE_ITEM);

	return image;
}

UIListItem.prototype.shapeCanBeChild = function(shape) {

	if(shape.isUIMenu || shape.isUIDevice || shape.isUIScreen || shape.isUIStatusBar 
		|| shape.isUIWindow || shape.isUIPageManager || shape.isUIPage || shape.isUIListItem) {
		return false;
	}

	return true;
}

UIListItem.prototype.onUserResized = function() {
	var list = this.parentShape;
	if(list) {
		list.relayoutChildren();
	}

	return;
}

UIListItem.cachedBgImages = new Array();

UIListItem.prototype.addCacheImage = function(name, data, w, h) {
	var cacheImage = {name:name, data:data, w: w, h: h};

	UIListItem.cachedBgImages.push(cacheImage);

	return;
}

UIListItem.prototype.getCacheImage = function(name, w, h) {
	var i = 0;
	var iter = null;
	var images = UIListItem.cachedBgImages;
	var n = UIListItem.cachedBgImages.length;

	for(i = 0; i < n; i++) {
		iter = images[i];
		if(iter.w === w && iter.h === h && iter.name === name) {
			return iter.data;
		}
	}

	return null;
}

UIListItem.prototype.setSlideToRemove = function(value) {
	this.slideToRemove = value;

	return this;
}

UIListItem.prototype.setHeightVariable = function(value) {
	this.heightVariable = value;
	
	return this;
}

UIListItem.prototype.isHeightVariable = function() {
	return this.heightVariable;
}

UIListItem.prototype.measureHeight = function(height) {
	return this.h;
}

UIListItem.prototype.ANIM_DRAW_LINE = 1;
UIListItem.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild || !this.slideToRemove) {
		return;
	}

	var dx = this.getMoveAbsDeltaX();
	var dy = this.getMoveAbsDeltaY();
	
	if(Math.abs(dx) < this.w/2 || (Math.abs(dy) > this.h)) {
		return;
	}

	var item = this;
	var duration = 300;
	var startTime = (new Date()).getTime();
	
	item.animateState = this.ANIM_DRAW_LINE;
	for(var i = 0; i < this.children.length; i++) {
		var iter = this.children[i];
		iter.style.setTextColor("#C0C0C0");
	}

	function animStep() {
		var now = new Date();
		var percent = (now.getTime() - startTime)/duration;
	
		if(percent < 1) {
			item.animatePercent = percent;
			setTimeout(animStep, 10);
		}
		else {
			item.animatePercent = 1;

			setTimeout(function() {
				delete startTime;
				delete item.animatePercent;
				delete item.animateState;

				var parentShape = item.parentShape;
				parentShape.removeChild(item);
				parentShape.relayoutChildren("default");
				parentShape.postRedraw();
			}, 300);
		}

		delete now;
		item.postRedraw();
	}

	animStep();

	return;
}

UIListItem.prototype.paintSelfOnly = function(canvas) {
	var image = this.getBgImage();

	if(image) {
		return;
	}

	canvas.beginPath();
	if(this.children.length === 0 && (this.isIcon || (this.parentShape && this.parentShape.isIcon))) {
		if(!this.isStrokeColorTransparent()) {
			canvas.strokeStyle = this.style.lineColor;
			drawDashedRect(canvas, 0, 0, this.w, this.h);
			canvas.stroke();
		}

		return;
	}
	
	var r = 10;
	var parentShape = this.parentShape;

	canvas.lineWidth = 2;
	canvas.strokeStyle = this.style.lineColor;

	if(this.pointerDown) {
		var dy = Math.abs(this.getMoveAbsDeltaY());
		if(dy < 5) {
			var deltaTime = Date.now() - this.pointerDownTime;
			if(deltaTime < 50 && this.getParent().isUIListView) {
				canvas.fillStyle = this.style.fillColor;
				this.postRedraw();
			}
			else {
				canvas.fillStyle = this.style.textColor; 
			}
		}
		else {
			canvas.fillStyle = this.style.fillColor;
		}
	}
	else if(this.isPointerOverShape()) {
		canvas.fillStyle = this.style.overFillColor ? this.style.overFillColor : this.style.fillColor;
	}
	else if(this.isFocused()) {
		canvas.fillStyle = this.style.focusedFillColor ? this.style.focusedFillColor : this.style.fillColor;
	}
	else {
		canvas.fillStyle = this.style.fillColor;
	}

	if(!parentShape || parentShape.isUIListView || parentShape.isUIMenu) {
		canvas.fillRect(0, 0, this.w, this.h);
		canvas.moveTo(0, this.h);
		canvas.lineTo(this.w, this.h);
		canvas.stroke();

		return;
	}

	var r = Math.floor(this.h/12);
	var isFirst = (this == parentShape.children[0]);
	var isLast   = (this == parentShape.children[parentShape.children.length-1]);
	canvas.beginPath();
	if(isFirst && isLast) {
		drawRoundRect(canvas, this.w, this.h, r);
	}
	else if(isFirst) {
		drawRoundRect(canvas, this.w, this.h, r, RoundRect.TL | RoundRect.TR);
	}
	else if(isLast) {
		drawRoundRect(canvas, this.w, this.h, r, RoundRect.BL | RoundRect.BR);
	}
	else {
		canvas.rect(0, 0, this.w, this.h);
	}
	canvas.fill();
	canvas.stroke();

	return;
}

UIListItem.prototype.afterPaintChildren = function(canvas) {
	if(!this.animateState) {
		return;
	}

	var image = this.getDeleteItemIcon();
	if(this.animateState === this.ANIM_DRAW_LINE && image && image.width > 0) {
		var margin = 20;
		var percent = this.animatePercent;
		var w = (this.w - margin ) * percent - image.width;

		if(w > margin) {
			canvas.lineWidth = 1;
			canvas.strokeStyle = "#D0D0D0";
			canvas.moveTo(margin, this.h/2);
			canvas.lineTo(w, this.h/2);
			canvas.stroke();

			if(percent > 0.9) {
				var y = (this.h - image.height)/2;
				var x = this.w - image.width - margin;

				canvas.drawImage(image, x, y);
			}
		}
	}

	return;
}

UIListItem.prototype.afterChildAppended = function(shape) {
	if(shape.isUIButton || shape.isUICheckBox) {
		this.setImage(UIElement.IMAGE_ACTIVE, this.getImageByType(UIElement.IMAGE_NORMAL).getImageSrc());
		this.setImage(UIElement.IMAGE_FOCUSED, this.getImageByType(UIElement.IMAGE_NORMAL).getImageSrc());
	}

	return true;
}

function UIListItemCreator() {
	var args = ["ui-list-item", "ui-list-item", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListItem();
		g.initUIListItem(this.type);
	
		return g;
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIListItemCreator(null, null, null, null));

