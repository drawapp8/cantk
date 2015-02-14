/*
 * File:   ui-page-indicator.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Page Indicator
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */
function UIPageIndicator() {
	return;
}

UIPageIndicator.prototype = new UIHScrollView();
UIPageIndicator.prototype.isUIPageIndicator = true;
UIPageIndicator.prototype.onPointerUpRunning = UIScrollView.prototype.onPointerUpRunning;

UIPageIndicator.prototype.isScrollable = function() {
	return this.getPages() > this.getVisibleTabs();
}

UIPageIndicator.prototype.setVisibleTabs = function(visibleTabs) {
	this.visibleTabs = visibleTabs;
	
	return;
}

UIPageIndicator.prototype.getVisibleTabs = function() {
	return this.visibleTabs ? this.visibleTabs : 6;
}

UIPageIndicator.prototype.getTabWidth = function() {
	var n = this.getPages();
	var visibleTabs = this.getVisibleTabs();

	if(n < visibleTabs) {
		return this.w/n;
	}
	else {
		return this.w/visibleTabs;
	}
}

UIPageIndicator.prototype.getScrollRange = function() {
	var visibleTabs = this.getVisibleTabs();

	if(visibleTabs < 6) {
		return this.w;
	}
	else {
		var n = this.getPages();
		return this.getTabWidth() * n;
	}
}

UIPageIndicator.prototype.initUIPageIndicator = function(type, w, h) {
	this.initUIHScrollView(type, 10, null);	

	this.setDefSize(w, h);
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setCanRectSelectable(false, false);
	this.images.display = UIElement.IMAGE_DISPLAY_9PATCH;

	return this;
}

UIPageIndicator.prototype.getViewPager = function() {
	if(!this.getParent()) {
		return;
	}

	if(!this.viewPager) {
		this.viewPager = this.getParent().findChildByType("ui-view-pager", true);
		if(!this.viewPager && this.isUIPageIndicatorSimple) { 
			this.viewPager = this.getWindow().findChildByType("ui-view-pager", true);
		}
	}

	if(this.viewPager) {
		this.viewPager.setShowIndicator(false);
	}

	return this.viewPager;
}

UIPageIndicator.prototype.getViewPagerOffset = function() {
	var viewPager = this.getViewPager();

	return viewPager ? viewPager.offset/viewPager.w : 0;
}

UIPageIndicator.prototype.getPages = function() {
	var viewPager = this.getViewPager();

	if(viewPager) {
		viewPager.pageIndicator = this;
	}

	return viewPager ? viewPager.getFrames() : 3;
}

UIPageIndicator.prototype.getCurrent = function() {
	var viewPager = this.getViewPager();
	
	return viewPager ? viewPager.getCurrent() : 0;
}

UIPageIndicator.prototype.paintOneIndicator = function(canvas, isCurrent, index, x, y, w, h) {
	canvas.beginPath();
	canvas.arc(x+w/2, y+h/2, 10, 0, 2 * Math.PI);
	canvas.fill();
	if(isCurrent) {
		canvas.stroke();
	}

	return;
}

UIPageIndicator.prototype.shapeCanBeChild = function(shape) {
	return false;
}

UIPageIndicator.prototype.paintOneIndicatorCircle = function(canvas, isCurrent, index, x, y, w, h) {
	var r = Math.floor(Math.max(10, h/4));

	canvas.fillStyle = isCurrent ? this.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.lineColorOfCurrent : this.style.lineColor;

	canvas.beginPath();
	canvas.arc(x+w/2, y+h/2, r, 0, 2 * Math.PI);
	canvas.fill();
	canvas.stroke();

	return;
}

UIPageIndicator.prototype.paintOneIndicatorNumber = function(canvas, isCurrent, index, x, y, w, h) {
	var r = Math.floor(Math.max(10, h/4));
	var ox = Math.floor(x+w/2);
	var oy = Math.floor(y+h/2);

	canvas.fillStyle = isCurrent ? this.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.lineColorOfCurrent : this.style.lineColor;

	canvas.beginPath();
	canvas.arc(ox, oy, r, 0, 2 * Math.PI);
	canvas.fill();
	canvas.stroke();

	canvas.font = r < 20 ? "16px sans" : "22px sans";
	canvas.textAlign = "center";
	canvas.textBaseline = "middle";
	canvas.fillStyle = this.style.textColor;
	canvas.fillText(index+1, ox, oy);
	
	return;
}

UIPageIndicator.prototype.paintOneIndicatorRect = function(canvas, isCurrent, index, x, y, w, h) {
	var size = 10;
	if(w > h) {
		size = Math.max(20, h/4);
	}
	else {
		size = Math.max(20, w/4);
	}
	size = Math.floor(size);

	canvas.fillStyle = isCurrent ? this.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.lineColorOfCurrent : this.style.lineColor;
	
	var dx = (w - size)/2;
	var dy = (h - size)/2;

	canvas.beginPath();
	canvas.rect(x+dx, y+dy, size, size);
	canvas.fill();
	canvas.stroke();

	return;
}

UIPageIndicator.prototype.paintOneIndicatorLine = function(canvas, isCurrent, index, x, y, w, h) {
	var size = 4;
	if(w > h) {
		size = Math.max(4, h/4);
	}
	else {
		size = Math.max(4, w/4);
	}
	size = Math.floor(size);

	canvas.fillStyle = isCurrent ? this.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.lineColorOfCurrent : this.style.lineColor;
	
	var dx = (w - size)/2;
	var dy = (h - size)/2;

	canvas.beginPath();
	if(w > h) {
		canvas.rect(x, y+dy, w, size);
	}
	else {
		canvas.rect(x+dx, y, size, h);
	}
	
	canvas.fill();
	canvas.stroke();

	return;
}


UIPageIndicator.prototype.onClickItem = function(index) {
	var viewPager = this.getViewPager();
	if(viewPager) {
		viewPager.setCurrent(index);
	}

	return;
}

UIPageIndicator.prototype.findItemByPoint = function(point) {
	var n = this.getPages();

	if(this.w > this.h) {
		var itemW = this.getTabWidth();

		for(var i = 0; i < n; i++) {
			if(point.x > i * itemW && point.x < (i+1) * itemW) {
				return i;
			}
		}
	}
	else {
		var itemH = this.h/n;
		for(var i = 0; i < n; i++) {
			if(point.y > i * itemH && point.y < (i+1) * itemH) {
				return i;
			}
		}
	}

	return -1;
}

UIPageIndicator.prototype.onClick = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	var index = this.findItemByPoint(point);
	
	if(index >= 0) {
		this.onClickItem(index);
	}

	this.callOnClickHandler(point);

	return;
}

UIPageIndicator.prototype.paintBackground = function(canvas) {
}

UIPageIndicator.prototype.paintSelfOnly = function(canvas) {
	var n = this.getPages();
	var current = this.getCurrent();
	var point = {};
	point.x = this.lastPosition.x - this.x;
	point.y = this.lastPosition.y - this.y;

	this.pointerOnItem = this.findItemByPoint(point);

	this.paintBackground(canvas);

	canvas.translate(-this.offset, 0);
	if(this.w > this.h) {
		var itemH = this.h;
		var itemW = this.getTabWidth();
		var offset = Math.floor(this.getViewPagerOffset() * itemW);

		for(var i = 0; i < n; i++) {
			var dx = i*itemW;
			this.paintOneIndicator(canvas, i === current, i, dx, 0, itemW, itemH);
		}
	}
	else {
		var itemW = this.w;
		var itemH = this.h / n;

		for(var i = 0; i < n; i++) {
			var dy = i*itemH; 
			this.paintOneIndicator(canvas, i === current, i, 0, dy, itemW, itemH);
		}
	}
	canvas.translate(this.offset, 0);
	delete this.pointerOnItem;

	return;
}

function UIPageIndicatorCreator() {
	var args = ["ui-page-indicator", "ui-page-indicator", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicator();

		return g.initUIPageIndicator(this.type, 200, 60);
	}
	
	return;
}

////////////////////////////////////////////////////////////////////}-{
function UIPageIndicatorSimple() {
	
	return;
}

UIPageIndicatorSimple.prototype.isScrollable = function() {
	return this.getPages() > this.getVisibleTabs();
}

UIPageIndicatorSimple.prototype = new UIPageIndicator();
UIPageIndicatorSimple.prototype.isUIPageIndicatorSimple = true;

UIPageIndicatorSimple.prototype.initUIPageIndicatorSimple = function(type, w, h) {
	this.initUIPageIndicator(type, w, h);	
	this.fillColorOfCurrent = "Gray";
	this.lineColorOfCurrent = "Black";
	this.setAlwaysOnTop(true);
	this.setVisibleTabs(12);

	return this;
}

UIPageIndicatorSimple.prototype.setLineColorOfCurrent = function(value) {
	this.lineColorOfCurrent = value;

	return;
}

UIPageIndicatorSimple.prototype.setFillStyleOfCurrent = function(value) {
	this.fillColorOfCurrent = value;

	return;
}

function UIPageIndicatorCircleCreator() {
	var args = ["ui-page-indicator-circle", "ui-page-indicator-circle", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();
		g.paintOneIndicator = UIPageIndicator.prototype.paintOneIndicatorCircle;

		return g.initUIPageIndicatorSimple(this.type, 200, 60);
	}
	
	return;
}

function UIPageIndicatorNumberCreator() {
	var args = ["ui-page-indicator-number", "ui-page-indicator-number", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();
		g.paintOneIndicator = UIPageIndicator.prototype.paintOneIndicatorNumber;

		return g.initUIPageIndicatorSimple(this.type, 200, 60);
	}
	
	return;
}

function UIPageIndicatorRectCreator() {
	var args = ["ui-page-indicator-rect", "ui-page-indicator-rect", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();
		g.paintOneIndicator = UIPageIndicator.prototype.paintOneIndicatorRect;

		return g.initUIPageIndicatorSimple(this.type, 200, 60);
	}
	
	return;
}

function UIPageIndicatorLineCreator() {
	var args = ["ui-page-indicator-line", "ui-page-indicator-line", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();
		g.paintOneIndicator = UIPageIndicator.prototype.paintOneIndicatorLine;

		return g.initUIPageIndicatorSimple(this.type, 200, 60);
	}
	
	return;
}

////////////////////////////////////////////////////////////////////}-{
function UIPageIndicatorNormal() {
	
	return;
}

UIPageIndicatorNormal.prototype = new UIPageIndicator();
UIPageIndicatorNormal.prototype.isUIPageIndicatorNormal = true;

UIPageIndicatorNormal.prototype.initUIPageIndicatorNormal = function(type, w, h) {
	this.initUIPageIndicator(type, w, h);	

	this.itemTexts = [];
	this.itemImages = [];
	this.imagePosition = "left";
	this.itemImagesOfCurrent = [];

	this.setMargin(5, 5);
	this.setAlwaysOnTop(false);
	this.setImage(UIElement.ITEM_BG_NORMAL, null);
	this.setImage(UIElement.ITEM_BG_ACTIVE, null);
	this.setImage(UIElement.ITEM_BG_CURRENT_NORMAL, null);
	this.setImage(UIElement.ITEM_BG_CURRENT_ACTIVE, null);

	return this;
}

UIPageIndicatorNormal.prototype.fixImagePath = function(oldConfig, newConfig) {
	var oldVersion	= oldConfig.version;
	var oldPlatform = oldConfig.platform;
	var oldDensity	= oldConfig.lcdDensity;
	var newVersion	= newConfig.version;
	var newPlatform = newConfig.platform;
	var newDensity	= newConfig.lcdDensity;
	
	UIElement.prototype.fixImagePath.call(this, oldConfig, newConfig);

	function srcReplace(src) {
		src = src.replaceAll("/" + oldVersion + "/", "/" + newVersion + "/");
		src = src.replaceAll("/" + oldPlatform + "/", "/" + newPlatform + "/");
		src = src.replaceAll("/" + oldDensity + "/", "/" + newDensity + "/");

		return src;
	}

	var str = srcReplace(this.strItemImages);
	this.setItemImagesByStr(str);

	str = srcReplace(this.strItemImagesOfCurrent);
	this.setItemImagesOfCurrentByStr(str);

	return;
}

UIPageIndicatorNormal.prototype.setEnableAnimatePage = function(value) {
	this.enableAnimatePage = value;

	return;
}

UIPageIndicatorNormal.prototype.setItemImagesByStr = function(str) {
	this.itemImages = [];
	var arr = str.split("\n");
	var name = "item-images-";

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(iter) {
			this.itemImages.push(new WImage(iter));
			this.setImage(name + i, iter);
		}
	}

	this.strItemImages = str;

	return;
}

UIPageIndicatorNormal.prototype.setItemImagesOfCurrentByStr = function(str) {
	this.itemImagesOfCurrent = [];
	var arr = str.split("\n");
	var name = "current-item-images-";

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(iter) {
			this.itemImagesOfCurrent.push(new WImage(iter));
			this.setImage(name + i, iter);
		}
	}

	this.strItemImagesOfCurrent = str;

	return;
}

UIPageIndicatorNormal.prototype.setItemTextsByStr = function(str) {
	this.strItemTexts = str;
	this.itemTexts = str.split("\n");

	return;
}

UIPageIndicatorNormal.prototype.setImagePosition = function(value) {
	this.imagePosition = value;

	return;
}

UIPageIndicatorNormal.prototype.getItemImagesStr = function() {
	return this.strItemImages ? this.strItemImages : "";
}

UIPageIndicatorNormal.prototype.getItemImagesStrOfCurrent = function() {
	return this.strItemImagesOfCurrent ? this.strItemImagesOfCurrent : "";
}

UIPageIndicatorNormal.prototype.getItemImages = function() {
	if(!this.itemImages.length && this.strItemImages) {
		this.setItemImagesByStr(this.strItemImages);
	}

	return this.itemImages;
}

UIPageIndicatorNormal.prototype.getItemImagesOfCurrent = function() {
	if(!this.itemImagesOfCurrent.length && this.strItemImagesOfCurrent) {
		this.setItemImagesOfCurrentByStr(this.strItemImagesOfCurrent);
	}

	return this.itemImagesOfCurrent;
}

UIPageIndicatorNormal.prototype.getItemTextsStr = function() {
	return this.strItemTexts ? this.strItemTexts : "";
}

UIPageIndicatorNormal.prototype.getItemTexts = function() {
	if(!this.itemTexts.length && this.strItemTexts) {
		this.setItemTextsByStr(this.strItemTexts);
	}

	return this.itemTexts;
}

UIPageIndicatorNormal.prototype.getItemImage = function(index, isCurrent) {
	var images = isCurrent ? this.getItemImagesOfCurrent() : this.getItemImages();
	if(images && index < images.length) {
		return images[index];
	}

	return null;
}

UIPageIndicatorNormal.prototype.getBackgroundImage = function(index, isCurrent) {
	var type = "";
	var active = this.pointerDown && this.pointerOnItem === index;
	if(isCurrent) {
		type = active ? UIElement.ITEM_BG_CURRENT_ACTIVE : UIElement.ITEM_BG_CURRENT_NORMAL;
	}
	else {
		type = active ? UIElement.ITEM_BG_ACTIVE : UIElement.ITEM_BG_NORMAL;
	}

	return this.getImageByType(type);
}

UIPageIndicatorNormal.prototype.paintOneIndicatorBackground = function(canvas, isCurrent, index, x, y, w, h) {
	var image = this.getBackgroundImage(index, isCurrent);

	if(!image || !image.getImage()) {
		return;
	}

	image = image.getImage();
	var imageW = image.width;
	var imageH = image.height;

	this.drawImageAt(canvas, image, this.images.display, x, y, w, h);

	return;
}

UIPageIndicatorNormal.prototype.setItemTextColorOfCurrent = function(value) {
	this.itemTextColorOfCurrent = value;

	return;
}

UIPageIndicatorNormal.prototype.getItemTextColorOfCurrent = function() {
	return this.itemTextColorOfCurrent ? this.itemTextColorOfCurrent : "green";
}

UIPageIndicatorNormal.prototype.paintBackground = function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_NORMAL);

	if(!image) {
		canvas.fillStyle = this.style.fillColor;
		canvas.rect(0, 0, this.w, this.h);
		canvas.fill();
	}

	return;
}

UIPageIndicatorNormal.prototype.getItemLocaleText= function(index) {
	var str = null;
	var texts = this.getItemTexts();
	
	if(texts && index < texts.length) {
		str = webappGetText(texts[index]);
		if(!str) {
			str = texts[index];
		}
	}

	return str;
}

UIPageIndicatorNormal.prototype.paintOneIndicator = function(canvas, isCurrent, index, x, y, w, h) {
	var image = this.getItemImage(index, isCurrent);
	this.paintOneIndicatorBackground(canvas, isCurrent, index, x, y, w, h);

	if(image) {
		image = image.getImage();
	}

	var gapBetweenTextImage = 4;
	var fontSize = this.style.fontSize;
	var str = this.getItemLocaleText(index);

	canvas.font = this.style.getFont();
	canvas.fillStyle = isCurrent ? this.getItemTextColorOfCurrent() : this.style.textColor; 
	
	if(image) {
		var imageW = image.width;
		var imageH = image.height;
		var hMargin = this.hMargin;

		if(str) {
			var textW = w;
			if(this.imagePosition === "left") {
				var dx = x + hMargin;
				var dy = Math.floor(y + (h-imageH)/2);
				canvas.drawImage(image, 0, 0, imageW, imageH, dx, dy, imageW, imageH);

				dy = Math.floor(y + h/2);
				dx = Math.floor(x + (w-imageW)/2 + imageW);
				textW = w - imageW - 2 * hMargin;

				canvas.textAlign = "center";
				canvas.textBaseline = "middle";
				canvas.fillText(str, dx, dy, textW);
			}
			else if(this.imagePosition === "middle") {
				this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_9PATCH, x, y, w, h);

				var dy = Math.floor(y + h/2);
				var dx = Math.floor(x + w/2);
				textW = w - 2 * hMargin;
	
				canvas.font = this.style.getFont();
				canvas.textAlign = "center";
				canvas.textBaseline = "middle";
				canvas.fillText(str, dx, dy, textW);
			}
			else {
				var dx = Math.floor(x + (w-imageW)/2);
				var dy = Math.floor(y + (h-imageH-fontSize-gapBetweenTextImage)/2);
				canvas.drawImage(image, 0, 0, imageW, imageH, dx, dy, imageW, imageH);

				dx = Math.floor(x + w/2);
				dy = dy + imageH + gapBetweenTextImage;
				textW = w - 2 * hMargin;

				canvas.textAlign = "center";
				canvas.textBaseline = "top";
				canvas.fillText(str, dx, dy, textW);
			}
		}
		else {
			var dx = Math.floor(x + (w-imageW)/2);
			var dy = Math.floor(y + (h-imageH)/2);
			canvas.drawImage(image, 0, 0, imageW, imageH, dx, dy, imageW, imageH);
		}
	}
	else {
		if(str) {
			canvas.textAlign = "center";
			canvas.textBaseline = "middle";
			canvas.fillText(str, Math.floor(x+w/2), Math.floor(y+h/2));
		}
	}

	return;
}

UIPageIndicator.prototype.onClickItem = function(index) {
	var viewPager = this.getViewPager();
	if(viewPager) {
		if(this.enableAnimatePage) {
			viewPager.switchTo(index);
		}
		else {
			viewPager.setCurrent(index);
		}
	}

	return;
}

function UIPageIndicatorNormalCreator() {
	var args = ["ui-page-indicator-normal", "ui-page-indicator-normal", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorNormal();

		return g.initUIPageIndicatorNormal(this.type, 200, 60);
	}
	
	return;
}

