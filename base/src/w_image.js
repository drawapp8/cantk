/*
 * File: w_image.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: image adapter
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function WImage(src) {
	if(src) {
		this.setImageSrc(src);
	}

	return;
}

WImage.caches = {};
WImage.nullImage = new Image();
WImage.onload = function() {  }

WImage.prototype.initFromJson = function(src, json, onLoad) {
	var sharpOffset = src.indexOf("#");
	var jsonURL = src.substr(0, sharpOffset);
	var name = src.substr(sharpOffset+1);
	var path = dirname(jsonURL);
	var filename = json.file ? json.file : json.meta.image;
	var imageSrc = path + "/" + filename;
	var info = json.frames[name];

	if(!info) {
		console.log("not found src: " + src);
		return;
	}

	var rect = info.frame || info;

	if(!rect) {
		alert("Invalid src: " + src);
		return;
	}

	this.rotated = info.rotated;
	if(info.trimmed) {
		rect.trimmed = true;
		rect.ox = info.spriteSourceSize.x;
		rect.oy = info.spriteSourceSize.y;
		rect.rw = info.sourceSize.w;
		rect.rh = info.sourceSize.h;
	}
	else {
		rect.trimmed = false;
		rect.ox = 0;
		rect.oy = 0;
		rect.rw = 0;
		rect.rh = 0;
	}

	var me = this;
	this.rect = rect;
	WImage.onload();
	ResLoader.loadImage(imageSrc, function(img) {
		me.image = img;
		if(onLoad) {
			onLoad(img);
		}
	});

	return;
}

WImage.prototype.initFromRowColIndex = function(src, rowcolIndex, onLoad) {
	var me = this;
	var rows = parseInt(rowcolIndex[1]);
	var cols = parseInt(rowcolIndex[2]);
	var index = parseInt(rowcolIndex[3]);
	rowcolIndex = null;

	this.image = ResLoader.loadImage(src, function(img) {
		var tileW = Math.round(img.width/cols);
		var tileH = Math.round(img.height/rows);
		var tileWmin = Math.floor(img.width/cols);
		var tileHmin = Math.floor(img.height/rows);
		var col = index%cols;
		var row = Math.floor(index/cols);

		me.rect = {};
		me.rect.x = col * tileW;
		me.rect.y = row * tileH;
		me.rect.w = tileWmin;
		me.rect.h = tileHmin;

		me.image = img;
		if(onLoad) {
			onLoad(img);
		}
		WImage.onload();
	});

	return;
}

WImage.prototype.initFromXYWH = function(src, xywh, onLoad) {
	var me = this;
	var x = parseInt(xywh[1]);
	var y = parseInt(xywh[2]);
	var w = parseInt(xywh[3]);
	var h = parseInt(xywh[4]);
	xywh = null;

	this.image = ResLoader.loadImage(src, function(img) {
		me.rect = {};
		me.rect.x = x;
		me.rect.y = y;
		me.rect.w = w;
		me.rect.h = h;

		me.image = img;
		if(onLoad) {
			onLoad(img);
		}
		WImage.onload();
	});

	return;
}

WImage.prototype.setImage = function(image) {
	this.image = image;
	
	return this;
}

WImage.prototype.setImageSrc = function(src, onLoad) {
	if(!src) {
		this.src = src;
		this.image = WImage.nullImage;

		return;
	}

	if(src.indexOf("data:") === 0) {	
		this.src = src;
		this.rect = null;
		this.image = CantkRT.createImage(src, onLoad);

		return;
	}

	src = ResLoader.toAbsURL(src);
	this.src = src;
	
	WImage.caches[src] = this;

	var me = this;
	var sharpOffset = src.indexOf("#");
	if(sharpOffset > 0) {
		var meta = src.substr(sharpOffset+1);
		var rowcolIndex = meta.match(/r([0-9]+)c([0-9]+)i([0-9]+)/i);
		var xywh = meta.match(/x([0-9]+)y([0-9]+)w([0-9]+)h([0-9]+)/i);

		if(!rowcolIndex && !xywh) {
			var jsonURL = src.substr(0, sharpOffset);
			ResLoader.loadJson(jsonURL, function(json) {
				me.initFromJson(src, json, onLoad);
			});
		}
		else {
			src = src.substr(0, sharpOffset);
			if(rowcolIndex) {
				this.initFromRowColIndex(src, rowcolIndex, onLoad);
			}
			if(xywh){
				this.initFromXYWH(src, xywh, onLoad);
			}

			rowcolIndex = null;
			xywh = null;
		}
	}
	else {
		this.image = ResLoader.loadImage(src, function(img) {
			me.rect = {};
			me.rect.x = 0;
			me.rect.y = 0;
			me.rect.w = img.width;
			me.rect.h = img.height;

			me.image = img;
			if(onLoad) {
				onLoad(img);
			}
			WImage.onload();
		});
	}

	return;
}

WImage.prototype.getImageRect = function() {
	if(!this.rect) {
		this.rect = {x:0, y:0, w:0, h:0};
	}
	
	if((!this.rect.w) && this.image) {
		this.rect.w = this.image.width;
		this.rect.h = this.image.height;
	}

	return this.rect;
}

WImage.prototype.getImageSrc = function() {
	return this.src;
}

WImage.prototype.getRealImageSrc = function() {
	return this.image ? this.image.src : this.src;
}

WImage.prototype.getImage = function() {
	var image = this.image;

	return (image && image.width > 0) ? image : null;
}

WImage.isValid = function(image) {
	return image && image.image && image.image.width && image.image.height;
}

WImage.create = function(src, onLoad) {
	var image = WImage.caches[src];
	if(image) {
		if(onLoad) {
			onLoad(image.getImage());
		}
	}
	else {
		image = new WImage();
		image.setImageSrc(src, onLoad);
	}

	return image;
}

WImage.createWithImage = function(img) {
	var image = new WImage();

	image.setImage(img);

	return image;
}

function cantkSetOnImageLoad(onImageLoad) {
	if(onImageLoad) {
		WImage.onload = onImageLoad;
	}

	return;
}

//////////////////////////////////////////////////////////////////

WImage.DISPLAY_CENTER = 0;
WImage.DISPLAY_TILE   = 1;
WImage.DISPLAY_9PATCH = 2;
WImage.DISPLAY_SCALE  = 3;
WImage.DISPLAY_AUTO = 4;
WImage.DISPLAY_DEFAULT = 5;
WImage.DISPLAY_SCALE_KEEP_RATIO  = 6;
WImage.DISPLAY_TILE_V = 7;
WImage.DISPLAY_TILE_H = 8;
WImage.DISPLAY_AUTO_SIZE_DOWN = 9;
WImage.DISPLAY_FIT_WIDTH = 10;
WImage.DISPLAY_FIT_HEIGHT = 11;

WImage.prototype.draw = function(canvas, display, x, y, dw, dh) {
	var image = this.getImage();
	var srcRect = this.getImageRect();

	return WImage.draw(canvas, image, display, x, y, dw, dh, srcRect);	
}

WImage.draw = function(canvas, image, display, x, y, dw, dh, srcRect) {
	if(!image) return;
	if(!srcRect) {
		srcRect = {};
		srcRect.x = 0;
		srcRect.y = 0;
		srcRect.w = image.width;
		srcRect.h = image.height;
	}

	if(!srcRect.ox) {
		srcRect.ox = 0;
	}
	if(!srcRect.oy) {
		srcRect.oy = 0;
	}
	if(!srcRect.rw) {
		srcRect.rw = srcRect.w;
	}
	if(!srcRect.rh) {
		srcRect.rh = srcRect.h;
	}

	var imageWidth  = srcRect.rw;
	var imageHeight = srcRect.rh;

	if(imageWidth <= 0 || imageHeight <= 0) {
		return;
	}

	var dx = 0;
	var dy = 0;
	var sw = srcRect.w;
	var sh = srcRect.h;
	var sx = srcRect.x;
	var sy = srcRect.y;
	var ox = srcRect.ox;
	var oy = srcRect.oy;

	if(srcRect.trimmed) {
		ox = srcRect.ox;
		oy = srcRect.oy;
	}

	switch(display) {
		case WImage.DISPLAY_CENTER: {
			dx = Math.floor(x + ((dw - imageWidth) >> 1)) + ox;
			dy = Math.floor(y + ((dh - imageHeight) >> 1)) + oy;

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, sw, sh);
			break;
		}
		case WImage.DISPLAY_AUTO_SIZE_DOWN: {
			var scale = Math.min(Math.min(dw/imageWidth, dh/imageHeight), 1);
			var iw = imageWidth*scale;
			var ih = imageHeight*scale;

			dx = (dw - iw) >> 1;
			dy = (dh - ih) >> 1;
			dx += Math.round(ox*scale);
			dy += Math.round(oy*scale);
			dw = Math.round(sw*scale);
			dh = Math.round(sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			break;
		}
		case WImage.DISPLAY_SCALE: {
			var xScale = dw/imageWidth;
			var yScale = dh/imageHeight;

			dx = Math.round(x + ox*xScale);
			dy = Math.round(y + oy*yScale);
			dw = Math.round(sw*xScale);
			dh = Math.round(sh*yScale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			break;
		}
		case WImage.DISPLAY_AUTO: {
			var scale = Math.min(dw/imageWidth, dh/imageHeight);
			var iw = Math.round(imageWidth*scale);
			var ih = Math.round(imageHeight*scale);

			dx = x + ((dw - iw) >> 1);
			dy = y + ((dh - ih) >> 1);
			dx += Math.round(ox*scale);
			dy += Math.round(oy*scale);

			dw = Math.round(sw*scale);
			dh = Math.round(sh*scale);
			
			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			break;
		}
		case WImage.DISPLAY_9PATCH: {
			dx = x + ox;
			dy = y + oy;
			dw -= (imageWidth - sw);
			dh -= (imageHeight - sh);
			if(imageWidth >= dw && imageHeight >= dh) {
				canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			}
			else {
				drawNinePatchEx(canvas, image, sx, sy, sw, sh, dx, dy, dw, dh);
			}

			break;
		}
		case WImage.DISPLAY_SCALE_KEEP_RATIO: {
			var scale = Math.max(dw/imageWidth, dh/imageHeight);
			
			dx = Math.round(x + ox*scale);
			dy = Math.round(y + oy*scale);
			dw = Math.round(sw*scale);
			dh = Math.round(sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

			break;
		}
		case WImage.DISPLAY_TILE: {
			dx = x;
			dy = y;

			imageWidth = sw;
			imageHeight = sh;
			var maxDx = x + dw;
			var maxDy = y + dh;
			while(dy < maxDy) {
				dx = x;
				sh = Math.min(maxDy-dy, imageHeight);
				while(dx < maxDx) {
					sw = Math.min(maxDx-dx, imageWidth);
					canvas.drawImage(image, sx, sy, sw, sh, dx, dy, sw, sh);
					dx = dx + sw;
				}
				dy = dy + sh;
			}
			break;
		}
		case WImage.DISPLAY_TILE_H: {
			var maxDx = x + dw;
			dx = x;
			imageWidth = sw;
			imageHeight = sh;
			sh = Math.min(dh, imageHeight);
			while(dx < maxDx) {
				sw = Math.min(maxDx-dx, imageWidth);
				canvas.drawImage(image, sx, sy, sw, sh, dx, y, sw, sh);
				dx = dx + sw;
			}
			break;
		}
		case WImage.DISPLAY_TILE_V: {
			var maxDy = y + dh;
			dy = y;
			imageWidth = sw;
			imageHeight = sh;
			sw = Math.min(dw, imageWidth);
			while(dy < maxDy) {
				sh = Math.min(maxDy-dy, imageHeight);
				canvas.drawImage(image, sx, sy, sw, sh, x, dy, sw, sh);
				dy = dy + sh;
			}
			break;
		}
		case WImage.DISPLAY_FIT_WIDTH: {
			var scale = dw/imageWidth;

			dx = Math.round(x + ox*scale);
			dy = Math.round(y + oy*scale);
			dw = Math.round(sw*scale);
			dh = Math.round(sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

			break;
		}
		case WImage.DISPLAY_FIT_HEIGHT: {
			var scale = dh/imageHeight;

			dx = Math.round(x + ox*scale);
			dy = Math.round(y + oy*scale);
			dw = Math.round(sw*scale);
			dh = Math.round(sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

			break;
		}
		default: {
			dx = x + ox;
			dy = y + oy;
			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, sw, sh);
			break;
		}
	}

	return;
}
