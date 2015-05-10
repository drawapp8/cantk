/*
 * File:   ui-bitmap-font-text.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  BitmapFontText
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIBitmapFontText() {
	return;
}

UIBitmapFontText.prototype = new UIElement();
UIBitmapFontText.prototype.isUIBitmapFontText = true;

UIBitmapFontText.prototype.initUIBitmapFontText = function(type, w, h) {
	this.initUIElement(type);	

	this.text = "";
	this.textAlignment = "center";
	this.textureJsonURL = "";

	this.setMargin(5, 5);
	this.setDefSize(w, h);
	this.setSizeLimit(30, 30);
	this.setTextType(Shape.TEXT_NONE);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;
	this.setImage(UIElement.IMAGE_ACTIVE, null);
	this.setImage(UIElement.IMAGE_NORMAL, null);
	this.addEventNames(["onUpdateTransform"]); 

	return this;
}

UIBitmapFontText.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIBitmapFontText.prototype.onFromJsonDone = function() {
	if(this.textureJsonURL) {
		this.loadBitmapFont();
	}

	return;
}

UIBitmapFontText.prototype.onInit = function() {
	if(this.textureJsonURL) {
		this.loadBitmapFont();
	}

	return;
}

UIBitmapFontText.prototype.setImageWithRowCols = function(url, rows, columns) {
	this.setImage(UIElement.IMAGE_NORMAL_FG, url);
	this.imageRows = rows;
	this.imageColumns = columns;

	return;
}

UIBitmapFontText.prototype.getRectOfChar = function(c) {
	if(this.allText) {
		var n = this.allText.length;
		var i = this.allText.indexOf(c);
		if(i >= 0) {
			var image = this.getHtmlImageByType(UIElement.IMAGE_NORMAL_FG);
			
			var w = image.width;
			var h = image.height;
			var rows = this.imageRows ? this.imageRows : (h > w ? n : 1);
			var columns = this.imageColumns ? this.imageColumns : (w > h ? n : 1);
			var iw = w / columns;
			var ih = h / rows;
			var r = Math.floor(i/columns);
			var c = i%columns;
			var rect = {};
			rect.x = iw * c;
			rect.y = ih * r;
			rect.w = iw;
			rect.h = ih;

			return rect;
		}
	}
	else if(this.textureJsonData && this.textureJsonData.frames) {
		var frame = this.textureJsonData.frames[c];
		return frame ? frame.frame : null;
	}

	return null;
}

UIBitmapFontText.prototype.loadFontImage = function() {
	var cacheImages = {};
	var textureJsonData = this.textureJsonData;
	var textureJsonURL = this.textureJsonURL;

	if(textureJsonData && textureJsonData.meta) {
		var me = this;
		var url = dirname(textureJsonURL) + "/" +  textureJsonData.meta.image;
		
		this.setImage(UIElement.IMAGE_NORMAL_FG, url);
	}

	return;
}

UIBitmapFontText.prototype.loadBitmapFont = function() {
	var me = this;
	this.textureJsonData = {};
	var textureJsonURL = this.textureJsonURL;

	ResLoader.loadJson(textureJsonURL, function(json) {
		me.textureJsonData = json;
		me.loadFontImage();
	});

	return;
}

UIBitmapFontText.prototype.setBitmapFont = function(textureJsonURL) {
	this.textureJsonURL  = textureJsonURL;
	this.loadBitmapFont(textureJsonURL);

	return this;
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
	var image = this.getHtmlImageByType(UIElement.IMAGE_NORMAL_FG)

	if(!text || !image || !image.width) {
		return;
	}

	var size = 0;
	var h = this.h;
	var maxItemHeight = 15;
	for(var i = 0; i < text.length; i++) {
		var c = text[i];
		var rect = this.getRectOfChar(c);
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
	var scale = Math.min(1, Math.min(this.h/maxItemHeight, this.w/size));

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
		var rect = this.getRectOfChar(c);

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

