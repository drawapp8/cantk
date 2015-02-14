/*
 * File:   ui-check-box.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Check Box
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UICheckBox() {
	return;
}

UICheckBox.prototype = new UIElement();
UICheckBox.prototype.isUICheckBox = true;

UICheckBox.prototype.initUICheckBox = function(type, w, h) {
	this.initUIElement(type);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_INPUT);
	this.images.display = UIElement.IMAGE_DISPLAY_SCALE;

	this.setImage(UIElement.IMAGE_ON_BG, null);
	this.setImage(UIElement.IMAGE_ON_ACTIVE, null);
	this.setImage(UIElement.IMAGE_OFF_BG, null);
	this.setImage(UIElement.IMAGE_OFF_ACTIVE, null);
	
	this.setImage(UIElement.IMAGE_CHECKED_FG, null);
	this.setImage(UIElement.IMAGE_UNCHECK_FG, null);

	this.addEventNames(["onChanged", "onUpdateTransform"]);
	this.setRoundRadius(5);
	this.value = true;
	this.style.textColor = "Black";
	this.style.textColorOn = "Black";
	this.style.fillColor = "White";
	this.style.fillColorOn = "White";

	return this;
}

UICheckBox.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIImage || shape.isUILabel;
}

UICheckBox.prototype.getValue = function() {
	return this.value;
}

UICheckBox.prototype.setValue = function(value) {
	if(this.value != value) {
		this.value = value;
		this.callOnChangedHandler(this.value);
	}

	return this;
}

UICheckBox.prototype.getBgImage = function() {
	var image = null;
	if(this.value) {
		if(this.pointerDown) {
			image = this.getImageByType(UIElement.IMAGE_ON_ACTIVE);
		}

		if(!image || !image.src) {
			image = this.getImageByType(UIElement.IMAGE_ON_BG);
		}
	}
	else {
		if(this.pointerDown) {
			image = this.getImageByType(UIElement.IMAGE_OFF_ACTIVE);
		}

		if(!image || !image.src) {
			image = this.getImageByType(UIElement.IMAGE_OFF_BG);
		}
	}

	return image;
}

UICheckBox.prototype.getFgImage = function() {
	return this.getImageByType(this.value ? UIElement.IMAGE_CHECKED_FG : UIElement.IMAGE_UNCHECK_FG);
}

UICheckBox.prototype.getTextColor = function(canvas) {
	return this.value ? this.style.textColorOn : this.style.textColor;
}

UICheckBox.prototype.drawText = function(canvas) {
	return;
}

UICheckBox.prototype.getBgColor = function(canvas) {
	return this.value ? this.style.fillColorOn : this.style.fillColor;
}

UICheckBox.prototype.paintSelfOnly = function(canvas) {
	var text = this.getText();
	var image = this.getFgImage();
	var bgImage = this.getBgImage();
	var fillColor = this.getBgColor();
	var htmlImage = image ? image.getImage() : null;
	var srcRect = image ? image.getImageRect() : null;

	if(!bgImage && fillColor) {
		canvas.fillStyle = fillColor;
		drawRoundRect(canvas, this.w, this.h, this.roundRadius);
		canvas.fill();
	}

	var border = this.getHMargin();
	canvas.textBaseline = "middle";
	canvas.font = this.style.getFont();
	canvas.fillStyle = this.getTextColor();
	if(htmlImage && text) {

		switch(this.iconLocation) {
			case 'left': {
				var x = border;
				var h = Math.min(this.h, srcRect.h);
				var y = (this.h - h)>>1;
				var w = h;
				this.drawImageAt(canvas, htmlImage, UIElement.IMAGE_DISPLAY_AUTO_SIZE_DOWN, x, y, w, h, srcRect);

				y = this.h >> 1;
				x = this.w - border;
				this.hTextAlign = "right";
				canvas.textAlign = "right";
				canvas.fillText(text, x, y);
				break;
			}
			default: {
				var h = Math.min(this.h, srcRect.h);
				var w = h;
				var x = this.w - border - w;
				var y = (this.h - h)>>1;

				this.drawImageAt(canvas, htmlImage, UIElement.IMAGE_DISPLAY_AUTO_SIZE_DOWN, x, y, w, h, srcRect);
				y = this.h >> 1;
				x = border;
				this.hTextAlign = "left";
				canvas.textAlign = "left";
				canvas.fillText(text, x, y);
			}
		}
	}
	else if(htmlImage) {
		this.drawImageAt(canvas, htmlImage, UIElement.IMAGE_DISPLAY_AUTO_SIZE_DOWN, 0, 0, this.w, this.h, srcRect);
	}
	else if(text) {
		var y = this.h >> 1;
		if(this.hTextAlign === "center") {
			var x = this.w >> 1;
			canvas.textAlign = "center";
		}
		else if(this.hTextAlign === 'right') {
			var x = this.w - border;
			canvas.textAlign = "right";
		}
		else {
			var x = border;
			canvas.textAlign = "left";
		}
		canvas.fillText(text, x, y);
	}

	return;
}

UICheckBox.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}
	
	this.setValue(!this.value);
	this.callOnClickHandler(point);

	return;
}

function UICheckBoxCreator(w, h) {
	var args = ["ui-checkbox", "ui-checkbox", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UICheckBox();
		return g.initUICheckBox(this.type, w, h);
	}
	
	return;
}

