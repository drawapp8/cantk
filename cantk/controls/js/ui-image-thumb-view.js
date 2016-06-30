/*
 * File:   ui-image-thumb-view.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Thumb Image View 
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIImageThumbView() {
	return;
}

UIImageThumbView.prototype = new UIImageView();
UIImageThumbView.prototype.isUIImageThumbView = true;

UIImageThumbView.prototype.saveProps = ["keepRatio", "itemSize"];
UIImageThumbView.prototype.initUIImageThumbView = function(w, h) {
	this.userImages = [];
	this.imageProxies = [];

	this.itemSize = 0;
	this.setDefSize(w, h);
	this.initUIImageView(w, h);

	this.setItemSize = UIImageThumbView.prototype.setItemSize;
	this.getCacheCanvas        = UIImageThumbView.prototype.getCacheCanvas;
	this.getCacheCanvasContext = UIImageThumbView.prototype.getCacheCanvasContext;
	this.setValue              = UIImageThumbView.prototype.setValue;
	this.getCurrentImage       = UIImageThumbView.prototype.getCurrentImage;
	this.getCurrentImageSrc    = UIImageThumbView.prototype.getCurrentImageSrc;

	imageThumbViewInitCustomProp(this);
	this.errorImage = UIImageView.createImage("drawapp8/images/common/failed.png", null);
	this.loadingImage = UIImageView.createImage("drawapp8/images/common/loading.png", null);
	this.addEventNames(["onChanged"]);

	return this;
}

UIImageThumbView.prototype.setItemSize = function(itemSize) {
	this.itemSize = itemSize ? itemSize : 100;

	if(itemSize) {
		this.setSizeLimit(100, itemSize + 10, 2000, 2000);
	}

	return;
}

UIImageThumbView.prototype.setKeepRatio = function(keepRatio) {
	if(this.keepRatio != keepRatio) {
		this.cacheInvalid = true;
	}

	this.keepRatio = keepRatio;

	return;
}

UIImageThumbView.prototype.getCacheCanvasContext = function(w, h) {
	if(!this.cacheImagesCanvas) {
		canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;

		this.cacheImagesCanvas = canvas;
	}

	if(canvas.width != w) {
		canvas.width = w;
	}

	if(canvas.height != h) {
		canvas.height = h;
	}

	var ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, w, h);

	return ctx;
}

UIImageThumbView.prototype.getCurrentImageSrc = function() {
	return this.currentImageProxy ? this.currentImageProxy.src : null;
}

UIImageThumbView.prototype.getCurrentImage = function() {
	return this.currentImageProxy ? this.currentImageProxy.image : null;
}

UIImageThumbView.prototype.setValue = function(src) {
	for(var i = 0; i < this.imageProxies.length; i++) {
		var iter = this.imageProxies[i];
		if(iter.src.indexOf(src) >= 0 || src.indexOf(iter.src) >= 0) {
			this.currentImageProxy = iter;
			return this;
		}
	}

	return this;
}

UIImageThumbView.createImageProxy = function(thumbview, src, loadingImage, errorImage, ctxToDraw, x, y, w, h) {
	var imageProxy = {};

	imageProxy.x = x;
	imageProxy.y = y;
	imageProxy.w = w;
	imageProxy.h = h;
	imageProxy.src = src;
	imageProxy.imageState = UIImageView.IMAGE_STATE_PENDING;

	function onLoadDone(image, result) {
		var keepRatio = thumbview.keepRatio;

		if(result) {
			imageProxy.imageState = UIImageView.IMAGE_STATE_DONE;
			UIImageView.drawImageAtCenter(ctxToDraw, image, imageProxy.x, imageProxy.y, imageProxy.w, imageProxy.h, keepRatio);
		}
		else {
			imageProxy.imageState = UIImageView.IMAGE_STATE_ERROR;
			UIImageView.drawImageAtCenter(ctxToDraw, errorImage, imageProxy.x, imageProxy.y, imageProxy.w, imageProxy.h, keepRatio);
		}

		console.log("onLoadDone: " + image.src);
		thumbview.postRedraw();	
	}

	imageProxy.image = UIImageView.createImage(src, onLoadDone);

	if(imageProxy.imageState === UIImageView.IMAGE_STATE_PENDING) {
		var keepRatio = thumbview.keepRatio;	
		UIImageView.drawImageAtCenter(ctxToDraw, loadingImage, imageProxy.x, imageProxy.y, imageProxy.w, imageProxy.h, keepRatio);
	}

	return imageProxy;
}

UIImageThumbView.prototype.createCacheCanvas = function() {
	
}

UIImageThumbView.prototype.getCacheCanvas = function() {
	if(this.cacheInvalid || !this.cacheImagesCanvas) {
		this.createCacheCanvas();
	}

	return this.cacheImagesCanvas;
}

/////////////////////////////////////////////////////////////////////////}-{

function UIImageThumbViewTape() {
	return;
}

UIImageThumbViewTape.prototype = new UIHScrollView();

UIImageThumbViewTape.prototype.isUIImageView = true;
UIImageThumbViewTape.prototype.isUIImageThumbView = true;
UIImageThumbViewTape.prototype.isUIImageThumbViewTape = true;

UIImageThumbViewTape.prototype.initUIImageView = UIImageView.prototype.initUIImageView;
UIImageThumbViewTape.prototype.initUIImageThumbView = UIImageThumbView.prototype.initUIImageThumbView;

UIImageThumbViewTape.prototype.onPointerUpRunning = UIScrollView.prototype.onPointerUpRunning;

UIImageThumbViewTape.prototype.initUIImageThumbViewTape = function(type, w, h) {
	this.initUIHScrollView(type, 10, null);	
	this.initUIImageThumbView (w, h);

	this.heightAttr = UIElement.HEIGHT_FIX;

	return this;
}

UIImageThumbViewTape.prototype.getSpaceBetweenImages = function() {
	return this.spaceBetweenImages ? this.spaceBetweenImages : 2;
}

UIImageThumbViewTape.prototype.createCacheCanvas = function() {
	var space = this.getSpaceBetweenImages();
	var w = this.w;
	var h = this.h;
	var size = (this.itemSize > 0 && this.itemSize < h) ? this.itemSize : h;

	var canvas = this.cacheImagesCanvas;
	var n = this.userImages.length;
	
	delete this.cacheInvalid;
	this.imageProxies.clear();
	this.currentImageProxy = null;

	if(!n) {
		return;
	}

	w = n * (size + space);

	var x = 0; 
	var y = Math.floor((h - size)/2);
	var errorImage = this.errorImage;
	var loadingImage = this.loadingImage;
	var ctx = this.getCacheCanvasContext(w, h);

	for(var i = 0; i < this.userImages.length; i++) {
		var src = this.userImages[i];
		
		var imageProxy = UIImageThumbView.createImageProxy(this, src, loadingImage, errorImage, ctx, x, y, size, size);
		this.imageProxies.push(imageProxy);
		
		x = x + size + space;
	}

	return;
}

UIImageThumbViewTape.prototype.getScrollRange = function() {
	var size = this.h;
	var space = this.getSpaceBetweenImages();
	var range = this.userImages.length * (size + space) + space;

	return range;
}

UIImageThumbViewTape.prototype.paintChildren = function(canvas) {
	return;
}

UIImageThumbViewTape.prototype.getCacheCanvasOffset = function() {
	var offset = Math.max(0, (this.w - this.cacheImagesCanvas.width)/2);

	return offset;
}

UIImageThumbViewTape.prototype.onClick = function(point, beforeChild) {
	if(!this.imageProxies || !this.imageProxies.length || beforeChild) {
		return;
	}

	this.currentImageProxy = null;
	var x = point.x - this.getCacheCanvasOffset();

	for(var i = 0; i < this.imageProxies.length; i++) {
		var iter = this.imageProxies[i];
		if(x >= iter.x && x < (iter.x + iter.w)) {
			this.currentImageProxy = iter;	
		}
	}
	
	this.callOnClickHandler(point);
	this.callOnChangedHandler(this.getCurrentImageSrc());

	return;
}

UIImageThumbViewTape.prototype.paintSelfOnly = function(canvas) {
	if(!this.userImages || !this.userImages.length || !this.getCacheCanvas()) {
		canvas.rect(0, 0, this.w, this.h);
		canvas.stroke();

		return;
	}

	var w = 0;
	var y = 0;
	var h = this.h;
	var selfW = this.w;
	var cacheCanvas = this.getCacheCanvas();
	var cacheCanvasOffset = this.getCacheCanvasOffset();
	var x = cacheCanvasOffset;

	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	if(this.offset >= 0) {
		if(x > this.offset) {
			x = x-this.offset;
			var w = cacheCanvas.width;
			canvas.drawImage(this.cacheImagesCanvas, 0, 0, w, h, x, y, w, h);
			cacheCanvasOffset = x;
		}
		else {
			var offset = this.offset - x; 
			var w = Math.min(selfW, cacheCanvas.width-offset);
			canvas.drawImage(this.cacheImagesCanvas, offset, 0, w, h, 0, y, w, h);
			cacheCanvasOffset = -offset;
		}
	}
	else {
		x = x-this.offset;
		var w = Math.min(selfW+this.offset, cacheCanvas.width);
		canvas.drawImage(this.cacheImagesCanvas, 0, 0, w, h, x, y, w, h);
		cacheCanvasOffset = x;
	}

	if(this.currentImageProxy) {
		x = cacheCanvasOffset + this.currentImageProxy.x;
		y = this.currentImageProxy.y;

		canvas.lineWidth = 3;
		canvas.rect(x, y, this.currentImageProxy.w, this.currentImageProxy.h);
		canvas.stroke();
	}

	return;
}

function UIImageThumbViewTapeCreator() {
	var args = ["ui-image-thumb-view-tape", "ui-image-thumb-view-tape", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageThumbViewTape();

		return g.initUIImageThumbViewTape(this.type, 300, 100);
	}
	
	return;
}

/////////////////////////////////////////////////////////////////////////}-{

function UIImageThumbViewGrid() {
	return;
}

UIImageThumbViewGrid.prototype = new UIHScrollView();

UIImageThumbViewGrid.prototype.isUIImageView = true;
UIImageThumbViewGrid.prototype.isUIImageThumbView = true;
UIImageThumbViewGrid.prototype.isUIImageThumbViewGrid = true;

UIImageThumbViewGrid.prototype.initUIImageView = UIImageView.prototype.initUIImageView;
UIImageThumbViewGrid.prototype.initUIImageThumbView = UIImageThumbView.prototype.initUIImageThumbView;

UIImageThumbViewGrid.prototype.onPointerUpRunning = UIScrollView.prototype.onPointerUpRunning;

UIImageThumbViewGrid.prototype.initUIImageThumbViewGrid = function(type, w, h) {
	this.initUIHScrollView(type, 10, null);	
	this.initUIImageThumbView (w, h);
	this.setSizeLimit(100, 40, 2000, 2000);

	this.rows = 4;
	this.cols = 3;
	this.pageNr = 1;
	this.itemSize = 100;

	return this;
}

UIImageThumbViewGrid.prototype.calcSize = function() {
	if(!this.userImages) {
		return;
	}

	if(this.isIcon) {
		this.cols = 3;
		this.rows = 4;
		this.pageNr = 1;

		return;
	}

	var n = this.userImages.length;
	var deviceConfig = this.getDeviceConfig();
	var density = deviceConfig ? deviceConfig.lcdDensity : "hdpi";
	var densityScale = this.getDensitySizeByName(density)/160;
	var w = this.w/densityScale;
	var h = this.h/densityScale;

	var cols = Math.round(w/this.itemSize);
	var rows = Math.round(h/this.itemSize);

	this.cols = cols;
	this.rows = rows;
	this.pageNr = Math.ceil(n/(rows*cols));

	return;
}

UIImageThumbViewGrid.prototype.getSpaceBetweenImages = function() {
	return this.spaceBetweenImages ? this.spaceBetweenImages : 2;
}

UIImageThumbViewGrid.prototype.createCacheCanvas = function() {
	var n = this.userImages.length;
	var space = this.getSpaceBetweenImages();

	delete this.cacheInvalid;
	this.imageProxies.clear();
	this.currentImageProxy = null;

	this.calcSize();

	if(!n) {
		return;
	}

	var x = 0;
	var y = 0;
	var k = 0;
	var h = this.h;
	var w = this.pageNr * this.w;
	var ctx = this.getCacheCanvasContext(w, h);
	var itemW = Math.floor((this.w-space)/this.cols) - space;
	var itemH = Math.floor((this.h-space)/this.rows) - space;

	var errorImage = this.errorImage;
	var loadingImage = this.loadingImage;

	for(var i = 0; i < this.pageNr; i++) {
		y = space;
		for(var r = 0; r < this.rows; r++) {
			x = i * this.w + space;
			for(var c = 0; c < this.cols; c++, k++) {
				if(k >= n) {
					break;
				}

				var src = this.userImages[k];
				var imageProxy = UIImageThumbView.createImageProxy(this, src, loadingImage, errorImage, ctx, x, y, itemW, itemH);

				this.imageProxies.push(imageProxy);

				x = x + itemW + space;
			}
			y = y + itemH + space;
		}
	}

	return;
}

UIImageThumbViewGrid.prototype.getScrollRange = function() {
	var range = this.pageNr * this.w;

	return range;
}

UIImageThumbViewGrid.prototype.paintChildren = function(canvas) {
	return;
}

UIImageThumbViewGrid.prototype.getCacheCanvasOffset = function() {
	return this.getSpaceBetweenImages();
}

UIImageThumbViewGrid.prototype.onClick = function(point, beforeChild) {
	if(!this.imageProxies || !this.imageProxies.length || beforeChild) {
		return;
	}

	var x = point.x;
	var y = point.y;
	var n = this.imageProxies.length;

	var page = Math.floor(x/this.w);
	var row = Math.floor(y*this.rows/this.h) ;
	var col = Math.floor((x%this.w) * this.cols/this.w);
	var i = page * this.rows * this.cols + row * this.cols + col;

	if(i < n) {
		this.currentImageProxy = this.imageProxies[i];
	}

	this.callOnClickHandler(point);
	this.callOnChangedHandler(this.getCurrentImageSrc());

	return this.callOnClickHandler(point);
}

UIImageThumbViewGrid.prototype.paintSelfOnly = function(canvas) {
	var space = this.getSpaceBetweenImages();
	if(!this.userImages || !this.userImages.length || !this.getCacheCanvas()) {
		canvas.rect(0, 0, this.w, this.h);
		canvas.stroke();

		return;
	}

	var w = 0;
	var selfW = this.w;
	var offset = this.offset;
	var cacheCanvas = this.getCacheCanvas();

	var h = cacheCanvas.height;
	var canvasWidth = cacheCanvas.width;

	if(offset >= 0) {
		var w = Math.min(selfW, canvasWidth-offset);
		canvas.drawImage(this.cacheImagesCanvas, offset, 0, w, h, 0, 0, w, h);
	}
	else {
		var w = Math.min(canvasWidth+offset, selfW);
		canvas.drawImage(this.cacheImagesCanvas, 0, 0, w, h, -offset, 0, w, h);
	}

	if(this.currentImageProxy) {
		y = this.currentImageProxy.y;
		x = this.currentImageProxy.x - offset;

		canvas.rect(x, y, this.currentImageProxy.w, this.currentImageProxy.h);
		canvas.lineWidth = 3;
		canvas.strokeStyle = this.style.lineColor;
		canvas.stroke();

	}

	return;
}

UIImageThumbViewGrid.prototype.saveProps = UIImageThumbView.prototype.saveProps;
UIImageThumbViewTape.prototype.saveProps = UIImageThumbView.prototype.saveProps;

function UIImageThumbViewGridCreator() {
	var args = ["ui-image-thumb-view-grid", "ui-image-thumb-view-grid", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIImageThumbViewGrid();

		return g.initUIImageThumbViewGrid(this.type, 300, 100);
	}
	
	return;
}
	
ShapeFactoryGet().addShapeCreator(new UIImageThumbViewTapeCreator());
ShapeFactoryGet().addShapeCreator(new UIImageThumbViewGridCreator());

