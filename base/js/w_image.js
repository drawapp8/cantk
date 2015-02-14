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
	var rect = json.frames[name];

	if(!rect) {
		alert("Invalid src: " + src);
		return;
	}

	if(rect.frame) {
		rect = rect.frame;
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
		this.image = new Image();
		this.image.src = src;
		this.rect = null;

		if(onLoad) {
			onLoad(this.image);
		}
		WImage.onload();

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
	if(!this.rect && this.image && this.image.width) {
		this.rect = {x:0, y:0};
		this.rect.w = this.image.width;
		this.rect.h = this.image.height;
	}

	if(this.rect && !this.rect.w && !this.rect.h) {
		return null;
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

WImage.prototype.draw = function(canvas, display, x, y, dw, dh) {
	var image = this.getImage();
	var srcRect = this.getImageRect();

	return WImage.draw(canvas, image, display, x, y, dw, dh, srcRect);	
}

WImage.draw = function(canvas, image, display, x, y, dw, dh, srcRect) {
	if(!image) return;

	var imageWidth = srcRect ?  srcRect.w : image.width;
	var imageHeight = srcRect ? srcRect.h : image.height;

	if(imageWidth <= 0 || imageHeight <= 0) {
		return;
	}

	var sx = srcRect ? srcRect.x : 0;
	var sy = srcRect ? srcRect.y : 0;
	var dx = 0;
	var dy = 0;
	var w = imageWidth;
	var h = imageHeight;

	switch(display) {
		case WImage.DISPLAY_CENTER: {
			dx = Math.floor(x + ((dw - imageWidth) >> 1));
			dy = Math.floor(y + ((dh - imageHeight) >> 1));

			canvas.drawImage(image, sx, sy, w, h, dx, dy, w, h);
			break;
		}
		case WImage.DISPLAY_AUTO_SIZE_DOWN: {
			var scale = Math.min(Math.min(dw/imageWidth, dh/imageHeight), 1);
			w = imageWidth * scale;
			h = imageHeight * scale;
			dx = Math.floor(x + (dw - w) * 0.5);
			dy = Math.floor(y + (dh - h) * 0.5);
			
			canvas.drawImage(image, sx, sy, imageWidth, imageHeight, dx, dy, w, h);
			break;
		}
		case WImage.DISPLAY_SCALE: {
			dx = x;
			dy = y;
			canvas.drawImage(image, sx, sy, imageWidth, imageHeight, dx, dy, dw, dh);
			break;
		}
		case WImage.DISPLAY_TILE: {
			dx = x;
			dy = y;

			while(dy < dh) {
				dx = x;
				h = Math.min(dh-dy, imageHeight);
				while(dx < dw) {
					w = Math.min(dw-dx, imageWidth);
					canvas.drawImage(image, sx, sy, w, h, dx, dy, w, h);
					dx = dx + w;
				}
				dy = dy + h;
			}
			break;
		}
		case WImage.DISPLAY_TILE_H: {
			dx = x;
			h = Math.min(dh, imageHeight);
			while(dx < dw) {
				w = Math.min(dw-dx, imageWidth);
				canvas.drawImage(image, sx, sy, w, h, dx, y, w, h);
				dx = dx + w;
			}
			break;
		}
		case WImage.DISPLAY_TILE_V: {
			dy = y;
			w = Math.min(dw, imageWidth);
			while(dy < dh) {
				h = Math.min(dh-dy, imageHeight);
				canvas.drawImage(image, sx, sy, w, h, x, dy, w, h);
				dy = dy + h;
			}
			break;
		}
		case WImage.DISPLAY_9PATCH: {
			dx = x;
			dy = y;
			if(imageWidth >= dw && imageHeight >= dh) {
				canvas.drawImage(image, sx, sy, imageWidth, imageHeight, dx, dy, dw, dh);
			}
			else {
				drawNinePatchEx(canvas, image, sx, sy, imageWidth, imageHeight, dx, dy, dw, dh);
			}
			break;
		}
		case WImage.DISPLAY_AUTO: {
			var scale = Math.min(dw/imageWidth, dh/imageHeight);
			w = imageWidth * scale;
			h = imageHeight * scale;
			dx = Math.floor(x + (dw - w) * 0.5);
			dy = Math.floor(y + (dh - h) * 0.5);
			
			canvas.drawImage(image, sx, sy, imageWidth, imageHeight, dx, dy, w, h);
			break;
		}
		case WImage.DISPLAY_SCALE_KEEP_RATIO: {
			var sw = imageWidth/dw;
			var sh = imageHeight/dh;

			if(sw < sh) {
				var s = dh/dw;
				w = imageWidth;
				h = w * s;
			}
			else {
				var s = dw/dh;
				h = imageHeight;
				w = h * s;
			}

			dx = x;
			dy = y;
			
			canvas.drawImage(image, sx, sy, w, h, dx, dy, dw, dh);
			break;
		}
		default: {
			dx = x;
			dy = y;
			w = Math.min(imageWidth, dw);
			h = Math.min(imageHeight, dh);
			canvas.drawImage(image, sx, sy, w, h, dx, dy, w, h);
			break;
		}
	}

	return;
}


