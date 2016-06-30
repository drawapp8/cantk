/*
 * File: w_image.js
 * Author:  Li XianJing <xianjimli@hotmail.com>
 * Brief: image adapter
 *
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 *
 */

function WImage(src, onLoad) {
	this.src = src;
   	this.onLoadCallback = [];
	this.image = WImage.nullImage;
   	this.setSizeInfo(0, 0, 0, 0, false, false, 0, 0, 0, 0);
	this.setImageSrc(src, onLoad);

	return;
}

WImage.prototype.setSizeInfo = function(x, y, w, h, rotated, trimmed, ox, oy, rw, rh) {
	this.rect = {x:x >> 0, y:y >> 0, w:w >> 0, h:h >> 0, rotated:rotated, trimmed:trimmed, ox:ox >> 0, oy:oy >> 0, rw:rw >> 0, rh:rh >> 0};
}

WImage.prototype.appendOnLoadCallback = function(onLoad) {
    if(onLoad){
        this.onLoadCallback.push(onLoad);
    }
}

WImage.prototype.notifyLoadDone = function(img) {
	this.image = img;
	var callbacks = this.onLoadCallback;

	for(var i = 0, j = callbacks.length; i < j; i++){
		callbacks[i](img);
	}
	this.onLoadCallback.length = 0;
}

WImage.prototype.initFromJson = function(src, json) {
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

	if(info.trimmed) {
		this.setSizeInfo(rect.x, rect.y, rect.w, rect.h, info.rotated,
			true, info.spriteSourceSize.x, info.spriteSourceSize.y, info.sourceSize.w, info.sourceSize.h);;
	}
	else {
		this.setSizeInfo(rect.x, rect.y, rect.w, rect.h, info.rotated,
			false, 0, 0, rect.w, rect.h);
	}

	var me = this;
	ResLoader.loadImage(imageSrc, function(img) {
		me.notifyLoadDone(img);
	});

	return;
}

WImage.prototype.initFromRowColIndex = function(src, rowcolIndex) {
	var me = this;
	var rows = parseInt(rowcolIndex[1]);
	var cols = parseInt(rowcolIndex[2]);
	var index = parseInt(rowcolIndex[3]);

	ResLoader.loadImage(src, function(img) {
		var tileW = Math.round(img.width/cols);
		var tileH = Math.round(img.height/rows);
		var w = Math.floor(img.width/cols);
		var h = Math.floor(img.height/rows);
		var col = index%cols;
		var row = Math.floor(index/cols);

		var x = col * tileW;
		var y = row * tileH;
		me.setSizeInfo(x, y, w, h, false, false, 0, 0, w, h);
		me.notifyLoadDone(img);
	});

	rowcolIndex = null;

	return;
}

WImage.prototype.initFromXYWH = function(src, xywh) {
	var me = this;
	var x = parseInt(xywh[1]);
	var y = parseInt(xywh[2]);
	var w = parseInt(xywh[3]);
	var h = parseInt(xywh[4]);

	this.image = ResLoader.loadImage(src, function(img) {
		me.setSizeInfo(x, y, w, h, false, false, 0, 0, w, h);
		me.notifyLoadDone(img);
	});
	xywh = null;

	return;
}

WImage.prototype.setImage = function(image) {
	this.image = image;

	return this;
}

WImage.prototype.initFromDataURL = function(src, onLoad) {
	var me = this;
	this.src = src;
	this.image = CantkRT.createImage(src, function(img) {
		me.setSizeInfo(0, 0, img.width, img.height, false, false, 0, 0, img.width, img.height);
		me.notifyLoadDone(img);
	});
}

WImage.prototype.setImageSrc = function(src, onLoad) {
	this.appendOnLoadCallback(onLoad);

	if(!src) {
		this.notifyLoadDone(WImage.nullImage);
		return;
	}

	if(src.indexOf("data:") === 0) {
		this.initFromDataURL(src, onLoad);
		return;
	}

	var me = this;
	var url = ResLoader.toAbsURL(src);

	this.src = url;
	var sharpOffset = url.indexOf("#");
	if(sharpOffset > 0) {
		var meta = url.substr(sharpOffset+1);
		var rowcolIndex = meta.match(/r([0-9]+)c([0-9]+)i([0-9]+)/i);
		var xywh = meta.match(/x([0-9]+)y([0-9]+)w([0-9]+)h([0-9]+)/i);

		if(!rowcolIndex && !xywh) {
			var jsonURL = url.substr(0, sharpOffset);
			ResLoader.loadJson(jsonURL, function(json) {
                if(Array.isArray(json)) {
                    var find = false;
                    var target = null;
                    for(var i = 0; i < json.length; i++) {
                        var frames = Object.keys(json[i].frames);
                        find = frames.some(function(imagename) {
                            if(imagename === meta) {
                                target = json[i];
                                return true;
                            }
                        });
                        if(find) {
                            break;
                        }
                    }
                    return me.initFromJson(url, target || json, onLoad);
                }
				me.initFromJson(url, json, onLoad);
			});
		}
		else {
			url = url.substr(0, sharpOffset);
			if(rowcolIndex) {
				this.initFromRowColIndex(url, rowcolIndex, onLoad);
			}
			if(xywh){
				this.initFromXYWH(url, xywh, onLoad);
			}

			rowcolIndex = null;
			xywh = null;
		}
	}
	else {
		this.image = ResLoader.loadImage(url, function(img) {
			var w = img.width;
			var h = img.height;
			me.setSizeInfo(0, 0, w, h, false, false, 0, 0, w, h);
			me.notifyLoadDone(img);
		});
	}

	return;
}

WImage.prototype.getImageRect = function() {
	return this.rect;
}

WImage.prototype.getImageSrc = function() {
	return this.src;
}

WImage.prototype.getRealImageSrc = function() {
	if(this.image) {
		return this.image.src;
	}
	else {
		var src = this.src;
		var offset = src.indexOf("#");

		if(offset > 0) {
			src = src.substr(0, offset);
			src = src.replace(".json", ".png");
			console.log("Warning: image is not loaded yet.");
		}

		return src;
	}
}

WImage.prototype.isLoaded = function() {
	return this.image && this.image.complete;
}

WImage.prototype.getImage = function() {
	return this.image;
}

WImage.isValid = function(image) {
	return image && image.image && image.image.width && image.image.height;
}

WImage.cache = {};
WImage.nullImage = new Image();
WImage.nullWImage = new WImage();
WImage.nullWImage.image = null;

WImage.clearCache = function(check) {
	var newCache = {};
	for(var key in WImage.cache) {
		var asset = WImage.cache[key];

		if(check && check(key)) {
			newCache[key] =  asset;
		}
		else {
			console.log("clear image:" + key);
		}
	}
	WImage.cache = newCache;

	return;
}

WImage.create = function(src, onLoad) {
	if(!src) {
		return WImage.nullWImage;
	}

	var url = ResLoader.toAbsURL(src);
	var image = WImage.cache[url];

	if(image) {
		if(onLoad) {
			var img = image.image;
			if(img.complete) {
				onLoad(img);
			}else{
                image.appendOnLoadCallback(onLoad)
            }
		}
	}
	else {
		image = new WImage(url, onLoad);
		WImage.cache[url] = image;
	}

	return image;
}

WImage.createWithImage = function(img) {
	var image = WImage.nullWImage;

	if(img) {
		if(img.src) {
			return WImage.create(img.src);
		}

		image = new WImage();
		image.setImage(img);
		image.setSizeInfo(0, 0, img.width, img.height, false, false, 0, 0, img.width, img.height);
	}

	return image;
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
WImage.DISPLAY_3PATCH_V = 12;
WImage.DISPLAY_3PATCH_H = 13;

WImage.prototype.draw = function(canvas, display, x, y, dw, dh) {
	var image = this.getImage();
	var srcRect = this.getImageRect();

	return WImage.draw(canvas, image, display, x, y, dw, dh, srcRect);
}

WImage.getImageRectDefault = function(image) {
	return {x:0, y:0, w:image.width, h:image.height, trimmed:false};
}

WImage.draw = function(canvas, image, display, x, y, dw, dh, srcRect) {
	if(!image || !image.width) return;

	var dx = 0;
	var dy = 0;
	var sr = srcRect || WImage.getImageRectDefault(image);
	var sw = sr.w;
	var sh = sr.h;
	var sx = sr.x;
	var sy = sr.y;
	var ox = sr.ox || 0;
	var oy = sr.oy || 0;
	var imageWidth  = sr.rw || sr.w;
	var imageHeight = sr.rh || sr.h;

    if(imageHeight === 0 || imageWidth === 0) {
        return;
    }

	switch(display) {
		case WImage.DISPLAY_CENTER: {
			dx = (x + ((dw - imageWidth) >> 1)) + ox;
			dy = (y + ((dh - imageHeight) >> 1)) + oy;

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, sw, sh);
			break;
		}
		case WImage.DISPLAY_AUTO_SIZE_DOWN: {
			var scale = Math.min(Math.min(dw/imageWidth, dh/imageHeight), 1);
			var iw = imageWidth*scale;
			var ih = imageHeight*scale;

			dx = x + ((dw - iw) >> 1);
			dy = y + ((dh - ih) >> 1);
			dx += (ox*scale);
			dy += (oy*scale);
			dw = (sw*scale);
			dh = (sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			break;
		}
		case WImage.DISPLAY_SCALE: {
			var xScale = dw/imageWidth;
			var yScale = dh/imageHeight;

			dx = (x + ox*xScale);
			dy = (y + oy*yScale);
			dw = (sw*xScale);
			dh = (sh*yScale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			break;
		}
		case WImage.DISPLAY_AUTO: {
			var scale = Math.min(dw/imageWidth, dh/imageHeight);
			var iw = (imageWidth*scale);
			var ih = (imageHeight*scale);

			dx = x + ((dw - iw) >> 1);
			dy = y + ((dh - ih) >> 1);
			dx += (ox*scale);
			dy += (oy*scale);

			dw = (sw*scale);
			dh = (sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
			break;
		}
		case WImage.DISPLAY_9PATCH: {
			dx = x + ox;
			dy = y + oy;
			dw -= (imageWidth - sw);
			dh -= (imageHeight - sh);
			drawNinePatchEx(canvas, image, sx, sy, sw, sh, dx, dy, dw, dh);

			break;
		}
        case WImage.DISPLAY_3PATCH_V:
            dx = x + ox;
            dy = y + oy;
            dw -= (imageWidth - sw);
			dh -= (imageHeight - sh);

            dw = Math.max(dw, 0);
            dh = Math.max(dh, 0);
            var sstep = sh / 3;
            var dstep = dh / 3;
            var hc = Math.min(sstep, dstep);
            canvas.drawImage(image, sx, sy, sw, sstep, dx, dy, dw, hc);
            canvas.drawImage(image, sx, sy + sstep, sw, sstep, dx, dy + hc, dw, Math.max(dh - 2*sstep, dstep));
            hc = hc + Math.max(dh - 2*sstep, dstep);
            canvas.drawImage(image, sx, sy + 2*sstep, sw, sstep, dx, dy + hc, dw, Math.min(sstep, dstep));
            break;
        case WImage.DISPLAY_3PATCH_H:
            dx = x + ox;
            dy = y + oy;
            dw -= (imageWidth - sw);
			dh -= (imageHeight - sh);

            dw = Math.max(dw, 0);
            dh = Math.max(dh, 0);
            var sstep = sw / 3;
            var dstep = dw / 3;
            var wc = Math.min(sstep, dstep);
            canvas.drawImage(image, sx, sy, sstep, sh, dx, dy, wc, dh);
            canvas.drawImage(image, sx + sstep, sy, sstep, sh, dx + wc, dy, Math.max(dw - 2*sstep, dstep), dh);
            wc = wc + Math.max(dw - 2*sstep, dw / 3);
            canvas.drawImage(image, sx + 2*sstep, sy, sstep, sh, dx + wc, dy, Math.min(sstep, dstep), dh);
            break;
		case WImage.DISPLAY_SCALE_KEEP_RATIO: {
			var scale = Math.max(dw/imageWidth, dh/imageHeight);

			dx = (x + ox*scale);
			dy = (y + oy*scale);
			dw = (sw*scale);
			dh = (sh*scale);

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
				canvas.drawImage(image, sx, sy, sw, sh, dx, y, sw, dh);
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
				canvas.drawImage(image, sx, sy, sw, sh, x, dy, dw, sh);
				dy = dy + sh;
			}
			break;
		}
		case WImage.DISPLAY_FIT_WIDTH: {
			var scale = dw/imageWidth;

			dx = (x + ox*scale);
			dy = (y + oy*scale);
			dw = (sw*scale);
			dh = (sh*scale);

			canvas.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

			break;
		}
		case WImage.DISPLAY_FIT_HEIGHT: {
			var scale = dh/imageHeight;

			dx = (x + ox*scale);
			dy = (y + oy*scale);
			dw = (sw*scale);
			dh = (sh*scale);

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

window.WImage = WImage;


