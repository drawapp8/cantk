/*
 * File:   ui-scrollview.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  ScrollView
 * 
 * Copyright (c) 2011 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIScrollView() {
	return this;
}

UIScrollView.prototype = new UIElement();
UIScrollView.prototype.isUIScrollView = true;

UIScrollView.prototype.afterChildAppended = function(shape) {
	shape.setCanRectSelectable(false, true);

	return true;
}

UIScrollView.prototype.initUIScrollView = function(type, border, bg) {
	this.initUIElement(type);	

	this.offset = 0;
	this.scrollBarOpacity = 0;
	this.setMargin(border, border);
	this.setSizeLimit(100, 100, 2000, 2000);
	this.setDefSize(300 + 2 * border, 300 + 2 * border);

	this.velocityTracker = new VelocityTracker();
	this.interpolator =  new DecelerateInterpolator(2);

	this.widthAttr = UIElement.WIDTH_FILL_PARENT; 
	this.heightAttr = UIElement.HEIGHT_FILL_PARENT;
	this.setTextType(Shape.TEXT_NONE);
	this.setImage(UIElement.IMAGE_DEFAULT, bg);
	this.setScrollable("always");

	if(!bg) {
		this.style.setFillColor("#f0f0f0");
	}
	this.setCanRectSelectable(false, true);

	return this;
}

UIScrollView.prototype.setScrollable = function(scrollable) {
	this.scrollable = scrollable;

	return;
}

UIScrollView.prototype.fixChildSize = function(child) {
	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT) {
		child.w = this.getWidth(true);
	}

	if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.h = this.getHeight(true);
	}

	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT && child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.setUserMovable(false);
		child.setUserResizable(false);
	}

	return;
}

UIScrollView.prototype.shapeCanBeChild = function(shape) {
	if(shape.isUIButton || shape.isUIGroup || shape.isUILabel || shape.isUIImage 
		|| shape.isUIList || shape.isUIGrid || shape.isUIProgressBar 
		|| shape.isUICheckBox || shape.isUIRadioBox || shape.isUIWaitBar 
		|| shape.isUIButtonGroup || shape.isUITips || shape.isUIGroup) {

		return true;
	}

	return false;
}

UIScrollView.prototype.onModeChanged = function() {
	this.offset = 0;

	return;
}

UIScrollView.prototype.scrollTo = function(offset) {
	this.offset = Math.round(offset);
	
	return;
}

UIScrollView.prototype.scrollDelta = function(delta) {
	var offset = this.offset + delta;
	
	this.scrollTo(offset);

	return;
}

UIScrollView.prototype.scrollToPageDelta = function(pageOffset) {
	var pageIndex = Math.floor(this.offset/this.w) + pageOffset;
	
	this.scrollToPage(pageIndex);

	return;
}

UIScrollView.prototype.scrollToPage = function(pageIndex) {
	if(pageIndex < 0) {
		pageIndex = 0;
	}

	var offset = this.w * pageIndex;
	var distance = this.offset - offset;
	
	this.animScrollTo(distance, 300);

	return;
}

UIScrollView.prototype.onPointerDownRunning = function(point, beforeChild) {
	if(beforeChild) {
		return;
	}

	this.velocityTracker.clear();

	return;
}

UIScrollView.prototype.onDrag = function(offset) {
	return;
}

UIScrollView.prototype.isScrollable = function() {
	if(this.scrollable === "always") {
		return true;
	}
	else if(this.scrollable === "never") {
		return false;
	}
	else {
		var range = this.getScrollRange();
		var pageSize = this.getPageSize();

		return range > pageSize;
	}
}

UIScrollView.prototype.onPointerMoveRunning = function(point, beforeChild) {
	if(beforeChild || !this.isScrollable()) {
		return;
	}

	this.scrollBarOpacity = 0;
	var delta = this.getScrollDelta(point);
	if(this.pointerDown && this.needScroll(point)) {
		this.scrollBarOpacity = 1.0;
		this.scrollDelta(-delta);
	}

	this.addMovementForVelocityTracker();
	this.onDrag(this.offset);

	return ;
}

UIScrollView.prototype.animScrollTo = function(distance, duration) {
	var scrollview = this;
	var date  = new Date();
	var startTime = date.getTime();
	var startOffset = this.offset;
	var endOffset = startOffset - distance;
	var range = this.getScrollRange();
	var pageSize = this.getPageSize();

	duration = duration < 400 ? 400 : duration;

	if(endOffset < 0) {
		duration = 600;
		distance = startOffset;
	}

	if(this.mode != Shape.MODE_EDITING) {
		if(endOffset > (range - pageSize)) {
			distance = startOffset - (range - pageSize);
		}
	}
	
	if(range <= pageSize) {
		endOffset = 0;
		distance = startOffset;
	}
	
	function scrollIt() {
		var now = new Date();
		var nowTime = now.getTime();
		var timePercent = (nowTime - startTime)/duration;
		var percent = scrollview.interpolator.get(timePercent);
		var offset = startOffset - distance * Math.min(percent, 1.0);

		if(timePercent < 1 && !scrollview.pointerDown) {
			setTimeout(scrollIt, 5);
			scrollview.scrollTo(offset);
			scrollview.scrollBarOpacity = 1 - percent;
		
		}
		else {
			var offset = startOffset - distance;
			scrollview.scrollBarOpacity = 0;
			scrollview.scrollTo(offset);
		}
		scrollview.postRedraw();

		return;
	}

	setTimeout(scrollIt, 5);

	return;
}

UIScrollView.prototype.onOutOfRange = function(offset) {
	return;
}

UIScrollView.prototype.onPointerUpRunning = function(point, beforeChild) {
	if(beforeChild || !this.isScrollable()) {
		return;
	}

	var delta = this.getScrolledSize();

	if(!this.needScroll(point)) {
		this.scrollBarOpacity = 0;

		return;
	}

	var duration = 0;
	var distance = 0;
	var velocity = this.getVelocity();

	var a = this.getPageSize();
	var t = velocity/a;
	var d = 0.5 * a * t * t;

	distance = Math.abs(d);
	duration = 2*distance/velocity;

	distance = delta < 0 ? -distance : distance;
	duration = Math.abs(duration);

	if(duration > 3) {
		duration = 3;
	}

	var startOffset = this.offset;
	var endOffset = startOffset - distance;
	
	if(endOffset < 0) {
		this.onOutOfRange(endOffset);
	}

	this.animScrollTo(distance, duration * 1000);

	return true;
}

UIScrollView.prototype.paintSelfOnly =function(canvas) {
	var image = this.getHtmlImageByType(UIElement.IMAGE_DEFAULT);

	if(!image) {
//		canvas.beginPath();
//		canvas.fillRect(0, 0, this.w, this.h);
	}

	return;
}
