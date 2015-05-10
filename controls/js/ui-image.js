/*
 * File:   ui-image.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Image
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImage() {
	return;
}

UIImage.prototype = new UIElement();
UIImage.prototype.isUIImage = true;

UIImage.prototype.initUIImage = function(type, w, h, bg) {
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
	this.addEventNames(["onUpdateTransform"]); 

	this.clickable = false;
	this.clickedStyleParam = 0.8;
	this.clickedStyleType = 0;

	return this;
}

UIImage.prototype.getImageSrcRect = function() {
	var image = this.getImageByType(UIElement.IMAGE_DEFAULT);
	if(this.srcRect) {
		return this.srcRect;
	}
	else if(image) {
		return image.getImageRect();
	}
	else {
		return null;
	}
}

UIImage.prototype.setImageSrcRect = function(x, y, w, h) {
	this.srcRect = {};
	this.srcRect.x = x;
	this.srcRect.y = y;
	this.srcRect.w = w;
	this.srcRect.h = h;

	return;
}

UIImage.prototype.setValue = function(value) {
	this.setImage(UIElement.IMAGE_DEFAULT, value);

	return this;
}

UIImage.prototype.getValue = function() {
	return this.getImageSrc();
}

UIImage.prototype.setImageSrc = function(value) {
	this.setImage(UIElement.IMAGE_DEFAULT, value);

	return;
}

UIImage.prototype.getImageSrc = function(type) {
	return this.getImageSrcByType(type ? type : UIElement.IMAGE_DEFAULT);
}

UIImage.prototype.getHtmlImage = function() {
	return this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);
}

UIImage.prototype.setBorderStyle = function(borderColor, borderWidth) {
	this.borderColor = borderColor;
	this.borderWidth = borderWidth;

	return;
}

UIImage.prototype.setClickedStyle = function(type, param) {
	this.clickedStyleType = type;

	if(!param) {
		switch(type) {
			case UIImage.CLICKED_STYLE_SHADOW: {
				param = 10;			
				break;
			}
			case UIImage.CLICKED_STYLE_OPACITY: {
				param = 0.5;
				break;
			}
			case UIImage.CLICKED_STYLE_RECT_BG: {
				break;
			}
			case UIImage.CLICKED_STYLE_RECT_BORDER:{
				param = 2;
			}
			default:break;
		}
	}

	this.clickedStyleParam = param;

	return;
}

UIImage.CLICKED_STYLE_SHADOW = 1;
UIImage.CLICKED_STYLE_OPACITY = 2;
UIImage.CLICKED_STYLE_RECT_BG = 3;
UIImage.CLICKED_STYLE_RECT_BORDER = 4;

UIImage.prototype.drawImage =function(canvas) {
	canvas.save();

	var globalAlpha = canvas.globalAlpha;
	if(this.clickable && this.pointerDown) {
		switch(this.clickedStyleType) {
			case UIImage.CLICKED_STYLE_OPACITY: {
				canvas.globalAlpha = globalAlpha * this.clickedStyleParam;
				break;
			}
			case UIImage.CLICKED_STYLE_RECT_BG: {
				canvas.fillStyle = this.style.fillColor;
				canvas.fillRect(0, 0, this.w, this.h);
				break;
			}
			case UIImage.CLICKED_STYLE_SHADOW: {
				canvas.shadowColor = this.style.lineColor;
				canvas.shadowBlur = isNaN(this.clickedStyleParam) ? 25 : this.clickedStyleParam;
				canvas.shadowOffsetX = 0;
				canvas.shadowOffsetY = 0;
				break;
			}
		}
		
	}

	var image = this.getBgHtmlImage();
	var srcRect = this.getImageSrcRect();

	if(this.images.display === UIElement.IMAGE_DISPLAY_DEFAULT) {
		if(image && image.width) {
			this.w = srcRect ? srcRect.w : image.width;
			this.h = srcRect ? srcRect.h : image.height;
		}
	}
	
	this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h, srcRect);

	if(this.clickable && this.pointerDown) {
		switch(this.clickedStyleType) {
			case UIImage.CLICKED_STYLE_OPACITY: {
				canvas.globalAlpha = globalAlpha;
				break;
			}
			case UIImage.CLICKED_STYLE_RECT_BORDER: {
				canvas.strokeStyle = this.style.lineColor;
				canvas.lineWidth = isNaN(this.clickedStyleParam) ? 1 : this.clickedStyleParam;
				canvas.rect(0, 0, this.w, this.h);
				canvas.stroke();
				break;
			}
			case UIImage.CLICKED_STYLE_SHADOW: {
				canvas.shadowColor = null;
				canvas.shadowBlur = 0;
				canvas.shadowOffsetX = 0;
				canvas.shadowOffsetY = 0;
				break;
			}
		}
	}
	else if(this.borderColor && this.borderWidth) {
		canvas.strokeStyle = this.borderColor;
		canvas.lineWidth = this.borderWidth;
		canvas.rect(0, 0, this.w, this.h);
		canvas.stroke();
	}

	canvas.restore();

	return;
}

UIImage.prototype.setClickable = function(clickable) {
	this.clickable = clickable;

	return;
}

UIImage.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

function UIImageCreator(type, w, h, defaultImage) {
	var args = [type, "ui-image", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImage();
		return g.initUIImage(this.type, w, h, defaultImage);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIImageCreator("ui-icon", 32, 32, null));
ShapeFactoryGet().addShapeCreator(new UIImageCreator("ui-image", 200, 200, null));

