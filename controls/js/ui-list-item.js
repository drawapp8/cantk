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

	this.roundRadius = 5;
	this.setDefSize(200, 120);
	this.setTextType(Shape.TEXT_NONE);
	this.widthAttr = UIElement.WIDTH_FILL_PARENT; 
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

UIListItem.prototype.getFillColor = function(canvas) {
	var fillColor;
	if(this.pointerDown) {
		var dy = Math.abs(this.getMoveAbsDeltaY());
		if(dy < 5) {
			var deltaTime = Date.now() - this.pointerDownTime;
			if(deltaTime < 50 && this.getParent().isUIListView) {
				fillColor = this.style.fillColor;
				this.postRedraw();
			}
			else {
				fillColor = this.style.textColor; 
			}
		}
		else {
			fillColor = this.style.fillColor;
		}
	}
	else if(this.isPointerOverShape()) {
		fillColor = this.style.overFillColor ? this.style.overFillColor : this.style.fillColor;
	}
	else if(this.isFocused()) {
		fillColor = this.style.focusedFillColor ? this.style.focusedFillColor : this.style.fillColor;
	}
	else {
		fillColor = this.style.fillColor;
	}

	return fillColor;
}

UIListItem.prototype.paintSelfOnly = function(canvas) {
	if(this.getBgHtmlImage()) {
		return;
	}

	var parentShape = this.parentShape;
	var fillColor = this.getFillColor();
	var lineColor = this.style.lineColor;
	var lineWidth = this.style.lineWidth;

	canvas.beginPath();
	if(!parentShape || parentShape.isUIListView || parentShape.isUIMenu) {
		if(!Shape.isTransparentColor(fillColor)) {
			canvas.fillStyle = fillColor;
			canvas.fillRect(0, 0, this.w, this.h);
		}

		if(!Shape.isTransparentColor(lineColor)) {
			canvas.moveTo(0, this.h);
			canvas.lineTo(this.w, this.h);
			canvas.lineWidth = lineWidth;
			canvas.strokeStyle = lineColor;
			canvas.stroke();
		}

		return;
	}

	var r = this.roundRadius;
	var isFirst = (this === parentShape.children[0]);
	var isLast  = (this === parentShape.children[parentShape.children.length-1]);
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

	if(!Shape.isTransparentColor(fillColor)) {
		canvas.fillStyle = fillColor;
		canvas.fill();
	}
	
	if(!Shape.isTransparentColor(lineColor)) {
		canvas.lineWidth = lineWidth;
		canvas.strokeStyle = lineColor;
		canvas.stroke();
	}

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

