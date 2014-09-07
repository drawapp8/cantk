/*
 * File:   ui-image-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief: Image View 
 * 
 * Copyright (c) 2011 - 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageView() {
	return;
}

UIImageView.prototype = new UIElement();
UIImageView.prototype.isUIImageView = true;

UIImageView.cachedImages = {};
UIImageView.IMAGE_STATE_PENDING = 0;
UIImageView.IMAGE_STATE_ERROR   = 1;
UIImageView.IMAGE_STATE_DONE    = 2;

imageViewInitCustomProp = function(me) {
}

imageThumbViewInitCustomProp = function(me) {
}

imageAnimationInitCustomProp = function(me) {
}

imageSlideViewInitCustomProp = function(me) {
}


UIImageView.prototype.imageViewToJson = function(o) {
	o.userImages = this.getValue();

	return o;
}

UIImageView.prototype.imageViewFromJson = function(js) {
	this.cacheInvalid = true;

	if(js.userImages) {
		this.userImages = [];
		var arr = js.userImages.split("\n");

		var n = arr.length;
		for(var i = 0; i < n; i++) {
			var type = "image_" + (i+1);	
			var src = this.getImageSrcByType(type);
			if(src && src.length > 4) {
				this.userImages.push(src);
			}
		}
	}

	return;
}

UIImageView.prototype.initUIImageView = function(w, h) {
	this.setDefSize(w, h);
	this.userImages = [];
	
	this.onSized               = UIImageView.prototype.onSized;
	this.afterRelayout         = UIImageView.prototype.afterRelayout;
	this.setValue              = UIImageView.prototype.setValue;
	this.getValue              = UIImageView.prototype.getValue;
	this.ensureImages          = UIImageView.prototype.ensureImages;
	this.addUserImage          = UIImageView.prototype.addUserImage;
	this.imageViewToJson       = UIImageView.prototype.imageViewToJson;
	this.imageViewFromJson     = UIImageView.prototype.imageViewFromJson;
	this.onScaleForDensityDone = UIImageView.prototype.onScaleForDensityDone;

	imageViewInitCustomProp(this);

	this.regSerializer(this.imageViewToJson, this.imageViewFromJson);

	return this;
}

UIImageView.createImage = function(src, onLoadDone) {
	var image = UIImageView.cachedImages[src];
	
	if(!image) {
		image = new Image();

		image.src = src;
		image.onLoadDoneListeners = [];

		function notifyImageLoadDone(image, result) {
			if(!image || !image.onLoadDoneListeners) {
				return;
			}

			for(var i = 0; i < image.onLoadDoneListeners.length; i++) {
				var onLoad = image.onLoadDoneListeners[i];
			
				onLoad(image, result);
			}

			image.onLoadDoneListeners.clear();

			return;
		}

		image.onload = function(e) {
			notifyImageLoadDone(this, true);
			this.loaded = true;
		}
		
		image.onabort = function(e) {
			notifyImageLoadDone(this, false);	
			this.failed = true;
			console.log("load " + this.src + " failed.");
		}
		
		image.onerror = function(e) {
			notifyImageLoadDone(this, false);	
			this.failed = true;
			console.log("load " + this.src + " failed.");
		}
	}
	else {
		console.log("Create Image From Cache: " + src);
	}

	if(onLoadDone) {
		if(image.loaded) {
			onLoadDone(image, true);
		}
		else if(image.failed) {
			onLoadDone(image, false);
		}
		else {
			image.onLoadDoneListeners.push(onLoadDone);
		}
	}

	return image;
}

UIImageView.drawImageAtCenter = function(ctx, image, x, y, w, h, keepRatio, clearColor) {
	if(clearColor) {
		ctx.fillStyle = clearColor;
		ctx.fillRect(x, y, w, h);
	}
	else {
		ctx.clearRect(x, y, w, h);
	}

	if(image && image.width > 0) {
		var dw = w;
		var dh = h;
		var sw = image.width;
		var sh = image.height;
		var imageW = image.width;
		var imageH = image.height;

		if(keepRatio) {
			var scaleX = dw/imageW;
			var scaleY = dh/imageH;
		
			if(scaleX < scaleY) {
				sw = Math.min(imageW, dw/scaleY);
			}
			else {
				sh = Math.min(imageH, dh/scaleX);
			}
		}

		ctx.drawImage(image, 0, 0, sw, sh, x, y, dw, dh);
	}

	return;
}

UIImageView.prototype.ensureImages = function() {
	if(!this.cacheInvalid) {
		return;
	}

	var imageview = this;
	function onLoadDone(image, result) {
		imageview.postRedraw();

		return;
	}

	this.cachedImages = [];
	for(var i = 0; i < this.userImages.length; i++) {
		var src = this.userImages[i];
		var image = UIImageView.createImage(src, onLoadDone);

		this.cachedImages.push(image);
	}

	delete this.cacheInvalid;

	return;
}

UIImageView.prototype.afterRelayout = function() {
	this.cacheInvalid = true;

	return;
}

UIImageView.prototype.onSized = function() {
	this.cacheInvalid = true;

	return;
}

UIImageView.prototype.onScaleForDensityDone = function() {
	this.cacheInvalid = true;

	return;
}

UIImageView.prototype.addUserImage = function(src) {
	this.cacheInvalid = true;
	this.userImages.push(src);

	var key = "image_" + this.userImages.length;

	this.setImage(key, src);

	return;
}

UIImageView.prototype.getCurrentImage = function() {
	return this.curentImage;
}

UIImageView.prototype.setValue = function(srcs) {
	var arr = srcs.split("\n");

	this.userImages = [];
	this.images = {};
	this.images.display = 0;

	for(var i = 0; i < arr.length; i++) {
		if(arr[i]) {
			this.addUserImage(arr[i]);
		}
	}

	return;
}

UIImageView.prototype.getValue = function() {
	var srcs = "";

	for(var i = 0; i < this.userImages.length; i++) {
		var src = this.userImages[i];
		src = src.replace(/http:\/\/www.drawapp8.net/, "");
		src = src.replace(/http:\/\/www.drawapp8.com/, "");
		srcs = srcs + src + "\n";	
	}

	return srcs;
}
