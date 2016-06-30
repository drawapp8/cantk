/*
 * File: auto_packer.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: auto packer glyphs and small images into a big canvas.
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

function AutoPacker() {
}

AutoPacker.prototype.init = function(gl) {
	this.gl = gl;
	this.w = 512;
	this.h = 1024;
	this.imageMaxWidth  = 256;
	this.imageMaxHeight = 256;
	this.canvas = document.createElement("canvas");
	this.canvas.cannotPack = true;
	this.glyphCache = {};
	this.imagesCache = [];
	this.createTexture();
	this.setOverflow(false);

	return this.reset();
}

AutoPacker.prototype.resetImagesCache = function() {
	var imagesCache = this.imagesCache;
	var n = imagesCache.length;
	for(var i = 0; i < n; i++) {
		var image = imagesCache[i];
		image.ox = 0;
		image.oy = 0;
		image.packed = false;
		image.texture = null;
	}

	imagesCache.length = 0;
}

AutoPacker.prototype.extendCanvas = function() {
	if(this.isOverflow()) {
		if(this.w < 2048 || this.h < 2048) {
			if(this.w < this.h) {
				this.w = this.w << 1;
			}else{
				this.h = this.h << 1;
			}
		}else{
			if(this.imageMaxWidth > this.imageMaxHeight) {
				this.imageMaxWidth = this.imageMaxWidth << 1;
			}
			else {
				this.imageMaxHeight = this.imageMaxHeight << 1;
			}
		}

		this.setOverflow(false);
		console.log("extend canvas to " + this.w + "x" + this.h);
	}
	
	this.canvas.width = this.w;
	this.canvas.height = this.h;
	this.ctx = this.canvas.getContext("2d");
}

AutoPacker.prototype.reset = function() {
	this.resetImagesCache();
	this.glyphCache = {};
	this.extendCanvas();

	var ctx = this.ctx;
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.clearRect(0, 0, this.w, this.h);

	this.binPacker = new MaxRectsBinPack(this.w, this.h, false);

	return this;
}

AutoPacker.prototype.getAvailableRect = function(w, h) {
	var r = this.binPacker.insert(w, h, 0);

	if(r) {
		r.w = w;
		r.h = h;
	}

	return r;
}

AutoPacker.prototype.addGlyph = function(font, fontSize, color, c) {
	var ctx = this.ctx;
	if(ctx.font !== font) {
		ctx.font = font;
	}

	if(ctx.fillStyle !== color) {
		ctx.fillStyle = color;
	}

	var charWidth = Math.ceil(ctx.measureText(c).width);
	var charHeight = Math.ceil(fontSize * 1.3);
	var hMargin = charWidth >> 2;
	var vMargin = fontSize >> 2;

	var rect = this.getAvailableRect(charWidth + hMargin*2, charHeight + vMargin*2);

	if(rect) {
		rect.x += hMargin;
		rect.y += vMargin;
		rect.w = charWidth;
		rect.h = charHeight;
		if(font.indexOf("italic") >= 0) {
			rect.charW = rect.w + hMargin;
		}else{
			rect.charW = rect.w;
		}

		var key = AutoPacker.toGlyphKey(font, c, color);

		ctx.fillText(c, rect.x, rect.y + (rect.h >> 1));
		this.glyphCache[key] = rect;
		this.setDirty(true);
	}

	return rect;
}

AutoPacker.prototype.measureText = function(font, str, color, outRect) {
	var width = 0;
	var n = str.length;
	var fontSize = parseFontSize(font);

	for(var i = 0; i < n; i++) {
		var c = str[i];
		var r = this.getGlyph(font, c, color);

		if(!r) {
			r = this.addGlyph(font, fontSize, color, c);
		}

		if(r) {
			width += r.w;
		}
	}

	outRect.w = width;
	outRect.h = fontSize;

	return outRect;
}

AutoPacker.toGlyphKey = function(font, c, color) {
	return font+c+color;
}

AutoPacker.prototype.hasGlyph = function(font, c, color) {
	return !!this.glyphCache[AutoPacker.toGlyphKey(font, c, color)];
}

AutoPacker.prototype.setOverflow = function(overflow) {
	this.overflow = overflow;
}

AutoPacker.prototype.isOverflow = function(overflow) {
	return this.overflow;
}

AutoPacker.prototype.getGlyph = function(font, c, color) {
	return this.glyphCache[AutoPacker.toGlyphKey(font, c, color)];	
}

AutoPacker.prototype.packImage = function(image) {
	if(!image.src || image.src.indexOf("data:") === 0 || image.width > this.imageMaxWidth || image.height > this.imageMaxHeight) {
		image.ox = 0;
		image.oy = 0;
		image.cannotPack = true;
		return;
	}

	var rect = this.getAvailableRect(image.width + 4, image.height + 4);
	if(rect.height < image.height) {
		image.ox = 0;
		image.oy = 0;
		this.setOverflow(true);

		return;
	}

	var x = rect.x + 2;
	var y = rect.y + 2;
	var texture = this.canvas.texture;

	this.setDirty(true);
	this.ctx.drawImage(image, x, y);
	
	image.ox = x;
	image.oy = y;
	image.packed = true;

	if(image.texture && image.texture !== texture)  {
		this.gl.deleteTexture(image.texture);
	}

	image.texture = this.canvas.texture;
	this.imagesCache.push(image);

	return;
}

AutoPacker.prototype.setDirty = function(dirty) {
	this.canvas.texture.setDirty(dirty);
}

AutoPacker.prototype.createTexture = function() {
	var gl = this.gl;
	var texture = gl.createTexture();
	
	texture.src = null;
	texture.image = this.canvas;
	this.canvas.texture = texture;

	texture.dirty = true;
	texture.setDirty = function(dirty) {
		this.dirty = dirty;
	}

	texture.update = function() {
		if(!this.dirty) return;
		
		var image = this.image;
		this.dirty = false;
		this.w = image.width;
		this.h = image.height;
		gl.bindTexture(gl.TEXTURE_2D, this);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}

AutoPacker.prototype.getImage = function() {
	return this.canvas;
}


