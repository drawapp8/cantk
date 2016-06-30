/*
 * File:   ui-bitmap-font-text.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  BitmapFontText
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

/**
 * @class UIBitmapFontText
 * @extends UIElement
 * 数字标签。把文字做成等大小的图片，然后合并到一张大图里，显示时根据文字内容取出子图组装起来。图片一般用透明背景的PNG格式。
 *
 * 注意：要求图片的高度和宽度能被行数和列数整除，否者在部分浏览器上显示不正常。
 *
 */
function UIBitmapFontText() {
	return;
}

UIBitmapFontText.prototype = new UIElement();
UIBitmapFontText.prototype.isUIBitmapFontText = true;

UIBitmapFontText.prototype.saveProps = ["allText", "textAlignment", "imageRows", "imageColumns"];
UIBitmapFontText.prototype.initUIBitmapFontText = function(type, w, h) {
	this.initUIElement(type);	

	this.text = "";
	this.textAlignment = "center";

	this.setMargin(5, 5);
	this.setDefSize(w, h);
	this.setSizeLimit(10, 10);
	this.setTextType(Shape.TEXT_NONE);
	this.addEventNames(["onUpdateTransform"]); 
	this.setImage(UIElement.IMAGE_NORMAL_FG, null);
	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.setImage("option_image_3", null);
	this.setImage("option_image_4", null);
	this.setImage("option_image_5", null);

	return this;
}

UIBitmapFontText.prototype.getDefaultImageType = function() {
	return UIElement.IMAGE_NORMAL_FG;
}

UIBitmapFontText.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIBitmapFontText.prototype.setImageWithRowCols = function(url, rows, columns) {
	this.imageRows = rows;
	this.imageColumns = columns;
	this.setImage(UIElement.IMAGE_NORMAL_FG, url);

	return;
}

UIBitmapFontText.prototype.getRectOfChar = function(image, imageRect, c) {
	if(this.allText) {
		var n = this.allText.length;
		var i = this.allText.indexOf(c);

		if(i >= 0) {
			var w = imageRect.trimmed ? imageRect.rw : imageRect.w;
			var h = imageRect.trimmed ? imageRect.rh : imageRect.h;
			var rows = this.imageRows ? this.imageRows : (h > w ? n : 1);
			var columns = this.imageColumns ? this.imageColumns : (w > h ? n : 1);
			var iw = Math.round(w/columns);
			var ih = Math.round(h/rows);
			var r = Math.floor(i/columns);
			var c = i%columns;

			var rect = {};
			rect.w = iw;
			rect.h = ih;
			rect.x = iw * c + imageRect.x;
			rect.y = ih * r + imageRect.y;

			if(i === 0) {
				rect.w = rect.w - (imageRect.ox || 0);
				rect.h = rect.h - (imageRect.oy || 0);
			}
			else {
				rect.x = rect.x - (imageRect.ox || 0);
				rect.y = rect.y - (imageRect.oy || 0);
			}

			return rect;
		}
	}

	return null;
}

UIBitmapFontText.prototype.setAllText = function(allText) {
	this.allText = allText;

	return this;
}

UIBitmapFontText.prototype.getAllText = function() {
	return this.allText;
}

UIBitmapFontText.prototype.getBgImage =function() {
	var image = null;
	
	if(this.pointerDown && !this.isClicked()) {
		image = this.images.active_bg;
	}
	else {
		image = this.images.normal_bg;
	}
	
	if(!image || !image.getImage()) {
		image = this.images.default_bg;
	}

	if(!image || !image.getImage()) {
		return;
	}

	return image;
}

UIBitmapFontText.prototype.drawFgImage = function(canvas) {
	var text = this.text;
	var wImage = this.getImageByType(UIElement.IMAGE_NORMAL_FG)

	if(!text || !wImage) {
		return;
	}

	var image = wImage.getImage();
	var imageRect = wImage.getImageRect();
	if(!image) {
		return;
	}

	var size = 0;
	var h = this.h;
	var maxItemHeight = 15;
	for(var i = 0; i < text.length; i++) {
		var c = text[i];
		var rect = this.getRectOfChar(image, imageRect, c);
		if(rect) {
			size += rect.w;
			if(rect.h > maxItemHeight) {
				maxItemHeight = rect.h;
			}
		}
	}

	var oy = 0;
	var ox = 0;
	var tx = 0;
	var hh = this.h >> 1;
	var scale = Math.min(this.h/maxItemHeight, this.w/size);

	switch(this.textAlignment) {
		case "right": {
			ox = this.w - this.hMargin - size;
			tx = ox + size;
			break;
		}
		case "center": {
			ox = (this.w - size) >> 1;
			tx = this.w >> 1;
			break;
		}
		default: {
			ox = this.hMargin;
			tx = ox;
			break;
		}
	}	
	
	if(scale != 1) {
		canvas.translate(tx, hh);
		canvas.scale(scale, scale);
		canvas.translate(-tx, -hh);
	}

	for(var i = 0; i < text.length; i++) {
		var c = text[i];
		var rect = this.getRectOfChar(image, imageRect, c);

		if(rect) {
			oy = (h - rect.h) >> 1;
			canvas.drawImage(image, rect.x, rect.y, rect.w, rect.h, ox, oy, rect.w, rect.h);
			ox += rect.w;
		}
	}

	return;
}

function UIBitmapFontTextCreator() {
	var args = ["ui-bitmap-font-text", "ui-bitmap-font-text", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIBitmapFontText();
		return g.initUIBitmapFontText(this.type, 400, 100);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIBitmapFontTextCreator());

