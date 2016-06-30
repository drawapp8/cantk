/*
 * File:   ui-page-indicator.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Page Indicator
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIPageIndicator
 * @extends UIElement
 * 标签控件（UIViewPager）的页面指示器。
 *
 */

/**
 * @class UIPageIndicatorSimple
 * @extends UIElement
 * 标签控件（UIViewPager）的页面指示器。
 *
 */

/**
 * @class UIPageIndicatorNormal
 * @extends UIElement
 * 标签控件（UIViewPager）的页面指示器。
 *
 */

/**
 * @class UIPageIndicatorNormalX
 * @extends UIPageIndicatorNormal
 * 标签控件（UIViewPager）的页面指示器，UIPageIndicatorNormalX可以放UIPageIndicatorButton。
 *
 */

/**
 * @class UIPageIndicatorButton
 * @extends UIRadioBox
 * 页面指示器里的按钮，只能放在UIPageIndicatorNormalX中。
 * UIPageIndicatorNormalX会根据页面的个数自动创建UIPageIndicatorButton，你可以设置它图片和字体，它支持的图片有下面4个：
 *
 * * UIElement.IMAGE_CURRENT_PAGE_BG 当前项的背景图片。
 * * UIElement.IMAGE_CURRENT_PAGE_FG 当前项的前景图片。
 * * UIElement.IMAGE_NOT_CURRENT_PAGE_BG 非当前项的背景图片。
 * * UIElement.IMAGE_NOT_CURRENT_PAGE_FG 非当前项的前景图片。
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

	if(this.viewPager && !this.viewPager.parentShape) {
		this.viewPager = null
	}

	if(!this.viewPager) {
		this.viewPager = this.getParent().findChildByType("ui-view-pager", true);
		if(!this.viewPager && this.isUIPageIndicatorSimple) { 
			this.viewPager = this.getWindow().findChildByType("ui-view-pager", true);
		}
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
	var r = Math.floor(Math.max(5, h/4));

	canvas.lineWidth = this.style.lineWidth;
	canvas.fillStyle = isCurrent ? this.style.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.style.lineColorOfCurrent : this.style.lineColor;

	canvas.beginPath();
	canvas.arc(x+w/2, y+h/2, r, 0, 2 * Math.PI);
	canvas.fill();
	canvas.stroke();

	return;
}

UIPageIndicator.prototype.paintOneIndicatorNumber = function(canvas, isCurrent, index, x, y, w, h) {
	var r = Math.floor(Math.max(5, h/4));
	var ox = Math.floor(x+w/2);
	var oy = Math.floor(y+h/2);

	canvas.lineWidth = this.style.lineWidth;
	canvas.fillStyle = isCurrent ? this.style.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.style.lineColorOfCurrent : this.style.lineColor;

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

	canvas.lineWidth = this.style.lineWidth;
	canvas.fillStyle = isCurrent ? this.style.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.style.lineColorOfCurrent : this.style.lineColor;
	
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

	canvas.lineWidth = this.style.lineWidth;
	canvas.fillStyle = isCurrent ? this.style.fillColorOfCurrent : this.style.fillColor;
	canvas.strokeStyle = isCurrent ? this.style.lineColorOfCurrent : this.style.lineColor;
	
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
	var n = this.getPages();
	if(!n) {
		canvas.lineWidth = 1;
		canvas.strokeStyle = "Red";
		canvas.rect(0, 0, this.w, this.h)
		canvas.stroke();
	}
}

UIPageIndicator.prototype.paintSelfOnly = function(canvas) {
	var n = this.getPages();
	var current = this.getCurrent();
	var point = {};
	point.x = this.lastPosition.x - this.left;
	point.y = this.lastPosition.y - this.top;

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

UIPageIndicatorSimple.prototype.saveProps = ["indicatorStyle"];
UIPageIndicatorSimple.prototype.initUIPageIndicatorSimple = function(type, w, h, indicatorStyle) {
	this.initUIPageIndicator(type, w, h);	
	this.style.fillColorOfCurrent = "Gray";
	this.style.lineColorOfCurrent = "Black";
	this.setAlwaysOnTop(true);
	this.setVisibleTabs(12);
	this.setIndicatorStyle(indicatorStyle);

	return this;
}

UIPageIndicatorSimple.prototype.setLineColorOfCurrent = function(value) {
	this.style.lineColorOfCurrent = value;

	return;
}

UIPageIndicatorSimple.prototype.setFillStyleOfCurrent = function(value) {
	this.style.fillColorOfCurrent = value;

	return;
}

UIPageIndicatorSimple.prototype.setIndicatorStyle = function(indicatorStyle) {
	this.indicatorStyle = indicatorStyle;

	return this;
}

UIPageIndicatorSimple.prototype.paintOneIndicator = function(canvas, isCurrent, index, x, y, w, h) {
	switch(this.indicatorStyle) {
		case "circle": {
			this.paintOneIndicatorCircle(canvas, isCurrent, index, x, y, w, h);
			break;
		}
		case "rect": {
			this.paintOneIndicatorRect(canvas, isCurrent, index, x, y, w, h);
			break;
		}
		case "line": {
			this.paintOneIndicatorLine(canvas, isCurrent, index, x, y, w, h);
			break;
		}
		default: {
			this.paintOneIndicatorNumber(canvas, isCurrent, index, x, y, w, h);
			break;
		}
	}
}

function UIPageIndicatorCircleCreator() {
	var args = ["ui-page-indicator-circle", "ui-page-indicator-circle", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();
		return g.initUIPageIndicatorSimple(this.type, 200, 60, "circle");
	}
	
	return;
}

function UIPageIndicatorNumberCreator() {
	var args = ["ui-page-indicator-number", "ui-page-indicator-number", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();
		return g.initUIPageIndicatorSimple(this.type, 200, 60, "number");
	}
	
	return;
}

function UIPageIndicatorRectCreator() {
	var args = ["ui-page-indicator-rect", "ui-page-indicator-rect", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();

		return g.initUIPageIndicatorSimple(this.type, 200, 60, "rect");
	}
	
	return;
}

function UIPageIndicatorLineCreator() {
	var args = ["ui-page-indicator-line", "ui-page-indicator-line", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();

		return g.initUIPageIndicatorSimple(this.type, 200, 60, "line");
	}
	
	return;
}

function UIPageIndicatorSimpleCreator() {
	var args = ["ui-page-indicator-simple", "ui-page-indicator-simple", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorSimple();

		return g.initUIPageIndicatorSimple(this.type, 200, 60, "line");
	}
	
	return;
}

////////////////////////////////////////////////////////////////////}-{
function UIPageIndicatorNormal() {
	return;
}

UIPageIndicatorNormal.prototype = new UIPageIndicator();
UIPageIndicatorNormal.prototype.isUIPageIndicatorNormal = true;

UIPageIndicatorNormal.prototype.saveProps = ["enableAnimatePage", "strItemImages", "strItemTexts", "strItemImagesOfCurrent"];
UIPageIndicatorNormal.prototype.initUIPageIndicatorNormal = function(type, w, h) {
	this.initUIPageIndicator(type, w, h);	

	this.itemTexts = [];
	this.itemImages = [];
	this.imagePosition = "left";
	this.itemImagesOfCurrent = [];

	this.setMargin(5, 5);
	this.setAlwaysOnTop(false);
	this.setImage(UIElement.ITEM_BG_NOTMAL, null);
	this.setImage(UIElement.ITEM_BG_ACTIVE, null);
	this.setImage(UIElement.ITEM_BG_CURRENT_NOTMAL, null);
	this.setImage(UIElement.ITEM_BG_CURRENT_ACTIVE, null);

	return this;
}

UIPageIndicatorNormal.prototype.onInit = function() {
	this.syncImages();
}

UIPageIndicatorNormal.prototype.syncImages = function() {
	this.itemImages = [];
	this.itemImagesOfCurrent = [];

	for(var key in this.images) {
		if(key === "display") continue;
		var image = this.images[key];
		if(key.indexOf("current-item-images-") === 0) {
			this.itemImagesOfCurrent.push(image);	
		}
		else if(key.indexOf("item-images-") === 0) {
			this.itemImages.push(image);	
		}
	}

	return;
}

UIPageIndicatorNormal.prototype.setEnableAnimatePage = function(value) {
	this.enableAnimatePage = value;

	return;
}

UIPageIndicatorNormal.prototype.setItemImagesByStr = function(str) {
	var arr = str.split("\n");
	var name = "item-images-";

	var n = this.itemImages.length;
	for(var i = 0; i < n; i++) {
		this.setImage(name + i, null);
	}

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(iter) {
			this.setImage(name + i, iter);
		}
	}

	this.syncImages();
	this.strItemImages = str;

	return;
}

UIPageIndicatorNormal.prototype.setItemImagesOfCurrentByStr = function(str) {
	var arr = str.split("\n");
	var name = "current-item-images-";

	var n = this.itemImagesOfCurrent.length;
	for(var i = 0; i < n; i++) {
		this.setImage(name + i, null);
	}

	for(var i = 0; i < arr.length; i++) {
		var iter = arr[i];
		if(iter) {
			this.setImage(name + i, iter);
		}
	}

	this.syncImages();
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
	if(!this.itemImages.length) {
		this.syncImages();
	}

	return this.itemImages;
}

UIPageIndicatorNormal.prototype.getItemImagesOfCurrent = function() {
	if(!this.itemImagesOfCurrent.length) {
		this.syncImages();
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
		type = active ? UIElement.ITEM_BG_CURRENT_ACTIVE : UIElement.ITEM_BG_CURRENT_NOTMAL;
	}
	else {
		type = active ? UIElement.ITEM_BG_ACTIVE : UIElement.ITEM_BG_NOTMAL;
	}

	return this.getImageByType(type);
}

UIPageIndicatorNormal.prototype.paintOneIndicatorBackground = function(canvas, isCurrent, index, x, y, w, h) {
	var wImage = this.getBackgroundImage(index, isCurrent);
	if(!wImage || !wImage.getImage()) {
		return;
	}

	var image = wImage.getImage();
	var srcRect = wImage.getImageRect();

	this.drawImageAt(canvas, image, this.images.display, x, y, w, h, srcRect);

	return;
}

UIPageIndicatorNormal.prototype.setItemTextColorOfCurrent = function(value) {
	this.style.textColorOfCurrent = value;

	return;
}

UIPageIndicatorNormal.prototype.getItemTextColorOfCurrent = function() {
	return this.style.textColorOfCurrent ? this.style.textColorOfCurrent : "green";
}

UIPageIndicatorNormal.prototype.paintBackground = function(canvas) {
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
	var wImage = this.getItemImage(index, isCurrent);
	this.paintOneIndicatorBackground(canvas, isCurrent, index, x, y, w, h);

	var gap = 8;
	var fontSize = this.style.fontSize;
	var str = this.getItemLocaleText(index);

	canvas.font = this.style.getFont();
	canvas.fillStyle = isCurrent ? this.getItemTextColorOfCurrent() : this.style.textColor; 
	
	if(wImage && wImage.getImage()) {
		var image = wImage.getImage();
		var srcRect = wImage.getImageRect();

		var hMargin = this.hMargin;
		var vMargin = this.vMargin;

		if(str) {
			var fontSize = this.style.fontSize;
			var dx = x + hMargin;
			var dy = y + vMargin;
			var dw = w - 2 * hMargin;
			var dh = h - fontSize - 2 * vMargin - gap;

			this.drawImageAt(canvas, image,UIElement.IMAGE_DISPLAY_AUTO, dx, dy, dw, dh, srcRect);

			dx = x + (w >> 1);
			dy = y + h - vMargin; 
			canvas.textAlign = "center";
			canvas.textBaseline = "bottom";
			canvas.fillText(str, dx, dy);
		}
		else {
			var dx = x + hMargin;
			var dy = y + vMargin;
			var dw = w - 2 * hMargin;
			var dh = h - 2 * vMargin;

			this.drawImageAt(canvas, image,UIElement.IMAGE_DISPLAY_AUTO, dx, dy, dw, dh, srcRect);
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

////////////////////////////////////////////////////////////////////}-{
function UIPageIndicatorNormalX() {
	return;
}

UIPageIndicatorNormalX.prototype = new UIPageIndicator();
UIPageIndicatorNormalX.prototype.isUIPageIndicatorNormalX = true;
UIPageIndicatorNormalX.prototype.initUIPageIndicatorNormalX = function(type, w, h) {
	this.initUIPageIndicator(type, w, h);	

	return this;
}

UIPageIndicatorNormalX.prototype.relayoutChildren = function() {
	var arr  = this.children;
	var pagesNr = this.getPages() || 3;

	for(var i = arr.length; i < pagesNr; i++) {
		var button = this.addChild(this.createElement("ui-page-indicator-button"));
		button.setText(i);
	}
	arr.length = pagesNr;
	
	var n = pagesNr;
	var ih = this.h;
	var iw = this.w/n;

	for(var i = 0; i < n; i++) {
		var iter = arr[i];
		iter.h = ih;
		iter.w = iw;
		iter.y = 0;
		iter.x = i * iw;
		iter.xAttr = UIElement.X_FIX_LEFT;
		iter.yAttr = UIElement.Y_FIX_TOP;
		iter.widthAttr = UIElement.WIDTH_FIX;
		iter.heightAttr = UIElement.HEIGHT_FIX;
	}

	return this;
}

UIPageIndicatorNormalX.prototype.paintOneIndicator = function(canvas, isCurrent, index, x, y, w, h) {}

UIPageIndicatorNormalX.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIPageIndicatorButton;
}

function UIPageIndicatorNormalXCreator() {
	var args = ["ui-page-indicator-normal-x", "ui-page-indicator-normal-x", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorNormalX();

		return g.initUIPageIndicatorNormalX(this.type, 200, 60);
	}
	
	return;
}

/////////////////////////////////////////////////////////////////////////////////////

function UIPageIndicatorButton() {
	return;
}

UIPageIndicatorButton.prototype = new UIRadioBox();
UIPageIndicatorButton.prototype.isUIPageIndicatorButton = true;
UIPageIndicatorButton.prototype.initUIPageIndicatorButton = function(type) {
	this.initUIRadioBox(type);	
	this.userMovable = false;
	this.userResizable = false;
	this.images = {display:UIElement.IMAGE_DISPLAY_9PATCH};
    this.setImage(UIElement.IMAGE_CURRENT_PAGE_BG, null);
    this.setImage(UIElement.IMAGE_CURRENT_PAGE_FG, null);
    this.setImage(UIElement.IMAGE_NOT_CURRENT_PAGE_BG, null);
    this.setImage(UIElement.IMAGE_NOT_CURRENT_PAGE_FG, null);

	return this;
}

UIPageIndicatorButton.prototype.getValue = function() {
	var parentShape = this.parentShape;

	if(parentShape) {
		return parentShape.getCurrent() === parentShape.children.indexOf(this);
	}
	else {
		return this.value;
	}
}

UIPageIndicatorButton.prototype.drawText = function(canvas) {}
UIPageIndicatorButton.prototype.drawImage = function(canvas) {
	var rect = null;
	var image = null;
	var value = this.getValue();
	var bgImage = this.getImageByType(value ? UIElement.IMAGE_CURRENT_PAGE_BG : UIElement.IMAGE_NOT_CURRENT_PAGE_BG);
	var fgImage = this.getImageByType(value ? UIElement.IMAGE_CURRENT_PAGE_FG : UIElement.IMAGE_NOT_CURRENT_PAGE_FG);

	image = bgImage.getImage();
	rect = bgImage.getImageRect();
	if(image) {
		this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h, rect);	
	}

	image = fgImage.getImage();
	rect = fgImage.getImageRect();
	var text = this.text;
	if(text) {
		canvas.textAlign = "center";
		canvas.font = this.style.getFont();
		canvas.fillStyle = value ? this.style.textColorHighlight : this.style.textColor;
	}

	if(image) {
		if(text) {
			var fontHeight = this.style.fontSize + 10;
			this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_AUTO_SIZE_DOWN, 0, 0, this.w, this.h-fontHeight, rect);
			canvas.textBaseline = "bottom";
			canvas.fillText(text, this.w >> 1, this.h - 3); 
		}
		else {
			this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_AUTO_SIZE_DOWN, 0, 0, this.w, this.h, rect);
		}
	}
	else if(text) {
		canvas.textBaseline = "middle";
		canvas.fillText(text, this.w >> 1, this.h >> 1); 
	}

	return;
}

UIPageIndicatorButton.prototype.shapeCanBeChild = function(shape) {
	return shape.isUIImage || shape.isUILabel;
}

function UIPageIndicatorButtonCreator() {
	var args = ["ui-page-indicator-button", "ui-page-indicator-button", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIPageIndicatorButton();

		return g.initUIPageIndicatorButton(this.type);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIPageIndicatorButtonCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorNormalXCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorNormalCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorCircleCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorNumberCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorRectCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorLineCreator());
ShapeFactoryGet().addShapeCreator(new UIPageIndicatorSimpleCreator());

