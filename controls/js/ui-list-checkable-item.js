/*
 * File:   ui-list-checkable-item.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Checkable List Item 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIListCheckableItem() {
	return;
}

UIListCheckableItem.prototype = new UIListItem();
UIListCheckableItem.prototype.isUIListCheckableItem = true;

UIListCheckableItem.prototype.initUIListCheckableItem = function(isRadio, type, focusedImg, 
	activeImg, normalImg, disableImg,checkedImg, uncheckImg) {

	this.initUIListItem(type, focusedImg, activeImg, normalImg, disableImg);

	this.isRadio = isRadio;
	this.setImage(UIElement.IMAGE_CHECKED_FG, checkedImg);
	this.setImage(UIElement.IMAGE_UNCHECK_FG, uncheckImg);
	this.addEventNames(["onChanged"]);

	return this;
}

UIListCheckableItem.prototype.getValue = function() {
	return this.value;
}

UIListCheckableItem.prototype.setValue = function(value) {
	if(this.value != value) {
		this.value = value;
		this.callOnChangedHandler(this.value);
	}

	return;
}

UIListCheckableItem.prototype.setChecked = function() {
	var parentShape = this.parentShape;
	if(parentShape) {
		for(var i = 0; i < parentShape.children.length; i++) {
			var shape = parentShape.children[i];
			if(shape.isUIListCheckableItem) {
				shape.setValue(false);
			}
		}
	}

	this.setValue(true);

	return;
}

UIListCheckableItem.prototype.setParent = function(parentShape) {
	this.parentShape = parentShape;

	if(this.value) {
		this.setChecked();
	}

	return;
}

UIListCheckableItem.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	if(this.isRadio) {
		this.setChecked();
	}
	else {
		this.setValue(!this.value);
	}

	return;
}

UIListCheckableItem.prototype.drawFgImage = function(canvas) {
	var image = this.getHtmlImageByType(this.value ? UIElement.IMAGE_CHECKED_FG : UIElement.IMAGE_UNCHECK_FG);

	if(image) {
		var x = this.w - image.width - 20;
		var y = (this.h - image.height)/2;

		canvas.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
	}

	return;
}

function UIListCheckBoxItemCreator(focusedImg, activeImg, normalImg, disableImg, checkedImg, uncheckImg) {
	var args = ["ui-list-checkbox-item", "ui-list-checkbox-item", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListCheckableItem();
		g.initUIListCheckableItem(false, this.type, focusedImg, activeImg, normalImg, disableImg, checkedImg, uncheckImg);
		return g;
	}
	
	return;
}

function UIListRadioBoxItemCreator(focusedImg, activeImg, normalImg, disableImg, checkedImg, uncheckImg) {
	var args = ["ui-list-radiobox-item", "ui-list-radiobox-item", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIListCheckableItem();
		g.initUIListCheckableItem(true, this.type, focusedImg, activeImg, normalImg, disableImg, checkedImg, uncheckImg);
		return g;
	}
	
	return;
}
