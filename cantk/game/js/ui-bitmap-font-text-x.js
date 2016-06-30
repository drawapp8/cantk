/*
 * File:   ui-bitmap-font-text-x.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  BitmapFontTextX
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015  Holaverse Inc.
 * 
 */

/**
 * @class UIBitmapFontTextX
 * @extends UIElement
 * 图片文字。支持[bmfont](http://www.angelcode.com/products/bmfont/doc/file_format.html)和TexturePacker打包的Json Hash格式的图片集(不支持rotation和trim)。
 *
 * 参考：http://www.angelcode.com/products/bmfont/doc/file_format.html
 */
function UIBitmapFontTextX() {
	return;
}

UIBitmapFontTextX.prototype = new UIElement();
UIBitmapFontTextX.prototype.isUIBitmapFontTextX = true;

UIBitmapFontTextX.prototype.saveProps = ["spacer"];
UIBitmapFontTextX.prototype.initUIBitmapFontTextX = function(type) {
	this.spacer = 0;
	this.initUIElement(type);	
	this.textAlignment = "center";
	this.addEventNames(["onUpdateTransform"]); 

	return this;
}

UIBitmapFontTextX.prototype.getCharDesc = function(c) {
	if(this.bitmapFont) {
		return this.bitmapFont.getCharDesc(c);
	}
	else {
		if(!this.charsDesc) {
			this.charsDesc = {};
		}
		var charDesc = this.charsDesc[c];
		var image = this.getImageByType(c);

		if(!charDesc && image) {
			var r = image.getImageRect();
			if(r && r.w) {
				this.charsDesc[c] = {};
				charDesc = this.charsDesc[c];

				charDesc.x = r.x;
				charDesc.y = r.y;
				charDesc.w = r.w;
				charDesc.h = r.h;
				charDesc.image = image;
			}
		}

		return charDesc;
	}
}

UIBitmapFontTextX.prototype.parseFont = function(data, dataURL) {
	var path = dataURL.dirname();
	this.bitmapFont = new BitmapFont();
	this.bitmapFont.parse(data);
	
	var pages = this.bitmapFont.getPagesDesc();
	for(var key in pages) {
		var page = pages[key];
		var imageURL = path + "/" + page.file;
		this.setImage("page" + page.id, imageURL);
	}

	var chars = this.bitmapFont.getCharsDesc();
	for(var c in chars) {
		var charDesc = chars[c];
		charDesc.image = this.getImageByType("page"+charDesc.page);
	}

	return;
}

UIBitmapFontTextX.prototype.parseJson = function(data, dataURL) {
	var frames = data.frames;
	var imageURL = dataURL.dirname() + "/" + data.meta.image;

	for(var c in frames) {
		var name = c.replace(".png", "");
		if(name.length === 1) {
			this.setImage(name, dataURL + "#" + c);
		}
	}

	return;
}

UIBitmapFontTextX.prototype.setDataURL = function(dataURL) {
	this.images = {};
	this.images.display = 0;
	this.dataURL = dataURL;

	if(dataURL) {
		if(dataURL.endWith(".fnt")) {
			ResLoader.loadData(dataURL, function(data) {	
				this.parseFont(data, dataURL);
			}.bind(this));
		}
		else if(dataURL.endWith(".json")) {
			ResLoader.loadJson(dataURL, function(data) {	
				this.parseJson(data, dataURL);
			}.bind(this));
		}
		else {
			console.log("not supported:" + dataURL);
		}
	}

	return this;
}

UIBitmapFontTextX.prototype.setSpacer = function(spacer) {
	this.spacer = spacer;

	return this;
}

UIBitmapFontTextX.prototype.getDataURL = function() {
	return this.dataURL;
}

UIBitmapFontTextX.prototype.measureText = function() {
	var w = 0;
	var h = 10;
	var text = this.text;
	var spacer = this.spacer;

	for(var i = 0; i <text.length; i++) {
		var charDesc = this.getCharDesc(text[i]);
		if(charDesc) {
			var rw = charDesc.rw || charDesc.w;
			var rh = charDesc.rh || (charDesc.h + (charDesc.oy || 0));

			w += rw;
			if(h < rh) {
				h = rh;
			}

			if(i) {
				w += spacer;
			}
		}
	}

	return {w:w, h:h};
}

UIBitmapFontTextX.prototype.onFromJsonDone = function() {
	this.setDataURL(this.dataURL);
}

UIBitmapFontTextX.prototype.drawText = function(canvas) {
	var text = this.text;

	if(!text) { 
		return;
	}

	var oy = 0;
	var ox = 0;
	var tx = 0;
	var h = this.h;
	var w = this.w;
	var hh = h >> 1;
	var spacer = this.spacer;
	var hMargin = this.hMargin;
	var size = this.measureText();
	
	if(size.w < 1 || size.h < 1) {
		return;
	}

	var scale = Math.min(h/size.h, w/size.w);

	switch(this.textAlignment) {
		case "right": {
			ox = w - hMargin - size.w;
			tx = ox + size.w;
			break;
		}
		case "center": {
			ox = (w - size.w) >> 1;
			tx = w >> 1;
			break;
		}
		default: {
			ox = hMargin;
			tx = ox;
			break;
		}
	}	

	canvas.save();
	if(scale !== 1) {
		canvas.translate(tx, hh);
		canvas.scale(scale, scale);
		canvas.translate(-tx, -hh);
	}

	var x = 0;
	var y = 0;
	var baseY = (h - size.h) >> 1;
	for(var i = 0; i < text.length; i++) {
		var c = text[i];
		var charDesc = this.getCharDesc(c);
		if(charDesc && charDesc.image) {
			var rect = charDesc;
			var img = charDesc.image.getImage();

			if(img) {
				x = ox + (rect.ox || 0);
				y = baseY + (rect.oy || 0);

				canvas.drawImage(img, rect.x, rect.y, rect.w, rect.h, x, y, rect.w, rect.h);
				ox += (rect.rw || rect.w);
				ox += spacer;
			}
		}
	}
	canvas.restore();

	return;
}

function UIBitmapFontTextXCreator() {
	var args = ["ui-bitmap-font-text-x", "ui-bitmap-font-text-x", null, true];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIBitmapFontTextX();
		return g.initUIBitmapFontTextX(this.type, 400, 100);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIBitmapFontTextXCreator());

