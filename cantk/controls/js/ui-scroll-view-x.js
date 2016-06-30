/*
 * File:   ui-scroll-view-x.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  Scroll View X 
 * 
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIScrollViewX
 * @extends UIElement
 * 滚动视图。使用时先设置虚拟高度和宽度，虚拟高度小于实际高度时，上下不滚动，虚拟宽度小于实际宽度时，左右不滚动。
 *
 * 在IDE中，拖动滚动视图是改变滚动视图的可视区，要拖动滚动视图本身请使用滚动视图下方的拖动手柄，或者使用方向键，或者直接修改它的坐标。
 *
 * 往滚动视图中添加子控件时，先将控件放到滚动视图的可视区，然后拖动到其它区域。
 */
function UIScrollViewX() {
	return;
}

UIScrollViewX.prototype = new UIElement();
UIScrollViewX.prototype.isUIScrollViewX = true;
UIScrollViewX.prototype.isUIScrollView = true;
UIScrollViewX.prototype.saveProps = ["virtualWidth", "virtualHeight", "showOutside", "maxAnimationDuration", "scrollBgImage"];

UIScrollViewX.prototype.initUIScrollViewX = function(type) {
	this.initUIElement(type);

	this.ox = 0;
	this.oy = 0;
	this.xDragLimit = 0.3;
	this.yDragLimit = 0.3;
	this.scrollBarOpacity = 0;
	this.maxAnimationDuration = 10000;
	this.velocityTracker = new VelocityTracker();
	this.interpolator =  new DecelerateInterpolator(2);
	this.setImage(UIElement.IMAGE_DEFAULT, null);
	this.setImage(UIElement.IMAGE_V_SCROLL_BAR_BG, null);
	this.setImage(UIElement.IMAGE_V_SCROLL_BAR_FG, null);
	this.setImage(UIElement.IMAGE_H_SCROLL_BAR_BG, null);
	this.setImage(UIElement.IMAGE_H_SCROLL_BAR_FG, null);
	this.setImage("option_image_0", null);
	this.setImage("option_image_1", null);
	this.setImage("option_image_2", null);
	this.addEventNames(["onScrolling", "onScrollDone"]);

	return this;
}

UIScrollViewX.prototype.shapeCanBeChild = UIGroup.prototype.shapeCanBeChild;

/**
 * @property {Number} virtualWidth 
 * 虚拟宽度。  
 */

/**
 * @property {Number} virtualHeight
 * 虚拟高度。  
 */

/**
 * @property {Number} xOffset 
 * X方向偏移量。  
 */

/**
 * @property {Number} yOffset 
 * X方向偏移量。  
 */

UIScrollViewX.prototype.setVirtualWidth = function(virtualWidth) {
	this.vw = virtualWidth;
	return this; 
}

UIScrollViewX.prototype.setVirtualHeight = function(virtualHeight) {
	this.vh = virtualHeight;
	return this;
}

UIScrollViewX.prototype.getVirtualWidth = function() {
	return Math.max(this.vw, this.w);
}

UIScrollViewX.prototype.getVirtualHeight = function() {
	return Math.max(this.vh, this.h);
}

UIScrollViewX.prototype.getXOffset = function() {
	return this.ox;
}

UIScrollViewX.prototype.getYOffset = function() {
	return this.oy;
}

UIScrollViewX.prototype.fixXOffset = function(xOffset) {
	return Math.min(Math.max(0, xOffset), this.getVirtualWidth()-this.w) >> 0;
}

UIScrollViewX.prototype.fixYOffset = function(yOffset) {
	return Math.min(Math.max(0, yOffset), this.getVirtualHeight()-this.h) >> 0;
}

UIScrollViewX.prototype.setXOffset = function(xOffset) {
	this.ox = this.fixXOffset(xOffset);

	return this;
}

UIScrollViewX.prototype.setYOffset = function(yOffset) {
	this.oy = this.fixYOffset(yOffset);

	return this;
}

UIScrollViewX.prototype.setDragLimit = function(xDragLimit, yDragLimit) {
	this.xDragLimit = xDragLimit;
	this.yDragLimit = yDragLimit;

	return this;
}

UIScrollViewX.prototype.setOffset = function(xOffset, yOffset, noCheck) {
	if(noCheck) {
		var factor = 0;
		var ox = xOffset >> 0;
		var oy = yOffset >> 0;
		var xDragLimit = this.xDragLimit > 1 ? this.xDragLimit : this.xDragLimit * this.w;
		var yDragLimit = this.yDragLimit > 1 ? this.yDragLimit : this.yDragLimit * this.h; 

		if(ox < -xDragLimit) {
			ox = -xDragLimit;
		}else if((this.vw - ox) < (this.w - xDragLimit)) {
			ox = Math.max(0, this.vw - (this.w - xDragLimit));
		}
	
		if(oy < -yDragLimit) {
			oy = -yDragLimit;
		}else if((this.vh - oy) < (this.h - yDragLimit)) {
			oy = Math.max(0, this.vh - (this.h - yDragLimit));
		}
		this.ox = ox;
		this.oy = oy;
	}else{
		this.setXOffset(xOffset);
		this.setYOffset(yOffset);
	}
	this.callOnScrollingHandler(this.ox, this.oy);

	return this;
}

Object.defineProperty(UIScrollViewX.prototype, "xOffset", {get:UIScrollViewX.prototype.getXOffset, set:UIScrollViewX.prototype.setXOffset});
Object.defineProperty(UIScrollViewX.prototype, "yOffset", {get:UIScrollViewX.prototype.getYOffset, set:UIScrollViewX.prototype.setYOffset});
Object.defineProperty(UIScrollViewX.prototype, "virtualWidth", 
	{get:UIScrollViewX.prototype.getVirtualWidth, set:UIScrollViewX.prototype.setVirtualWidth});
Object.defineProperty(UIScrollViewX.prototype, "virtualHeight", 
	{get:UIScrollViewX.prototype.getVirtualHeight, set:UIScrollViewX.prototype.setVirtualHeight});

UIScrollViewX.prototype.dragStart = function() {
	this.saveOX = this.ox;
	this.saveOY = this.oy;

	this.velocityTracker.clear();
}

UIScrollViewX.prototype.drag = function() {
	this.addMovementForVelocityTracker();
	var ox = this.saveOX - this.getMoveAbsDeltaX();
	var oy = this.saveOY - this.getMoveAbsDeltaY();

	if(this.getVirtualWidth() <= this.w) {
		ox = 0;
	}
	else if(!UIElement.hScrollHandledBy){
		UIElement.hScrollHandledBy = this;
	}

	if(UIElement.hScrollHandledBy !== this) {
		ox = 0;
	}

	if(this.getVirtualHeight() <= this.h) {
		oy = 0;
	}
	else if(!UIElement.vScrollHandledBy) {
		UIElement.vScrollHandledBy = this;
	}
	
	if(UIElement.vScrollHandledBy !== this) {
		oy = 0;
	}

	if(ox || oy) {
		this.setOffset(ox, oy, true);
	}

	return;
}

UIScrollViewX.prototype.getScrollDuration = function(velocity) {
    //t = 2*v / a 
    var duration = Math.max(Math.abs(velocity.x), Math.abs(velocity.y)) * 2 / 2;
    
    return Math.min(duration, this.maxAnimationDuration);
}

UIScrollViewX.prototype.dragEnd = function() {
	var velocity = this.velocityTracker.getVelocity();
   	
    var duration = this.getScrollDuration(velocity);

    if(!duration || duration < 10) {
		return;
	}

	var t = duration/1000;
	var vx = velocity.x;
	var vy = velocity.y;

	if(UIElement.hScrollHandledBy && UIElement.hScrollHandledBy !== this) {
		vx = 0;
	}
	if(UIElement.hScrollHandledBy && UIElement.vScrollHandledBy !== this) {
		vy = 0;
	}

	var xd = 0.5 * vx * t;
	var yd = 0.5 * vy * t;
	var xs = this.ox;
	var ys = this.oy;
	var xe = Math.min(Math.max(0, xs - xd), this.virtualWidth  - this.w);
	var ye = Math.min(Math.max(0, ys - yd), this.virtualHeight - this.h);

    var cross = this.ox < 0 || this.oy < 0 
        || this.ox + this.w > this.virtualWidth 
        || this.oy + this.h > this.virtualHeight;
	
    if(!cross && Math.abs(xd) < 10 && Math.abs(yd) < 10) {
		this.callOnScrollDoneHandler(this.ox, this.oy);
		return;
	}

	this.scrollTo(xe, ye, duration);

	return;
}

/**
 * @method scrollToPercent
 * 滚动到指定位置。
 * @param {Number} xOffsetPercent X方向偏移量百分比(0,100)。
 * @param {Number} yOffsetPercent Y方向偏移量百分比(0,100)。
 * @param {Number} duration 滚动时间(毫秒)。
 * @return {UIElement} 返回控件本身。
 */
UIScrollViewX.prototype.scrollToPercent = function(xOffsetPercent, yOffsetPercent, duration) {
	var xOffset = (this.virtualWidth - this.w) * (xOffsetPercent/100);
	var yOffset = (this.virtualHeight - this.h) * (yOffsetPercent/100);

	return this.scrollTo(xOffset, yOffset, duration);
}

/**
 * @event onScrolling
 * 滚动事件。
 * @param {Number} xOffset x偏移量。
 * @param {Number} yOffset y偏移量。
 */

/**
 * @event onScrollDone
 * 滚动完成事件。
 * @param {Number} xOffset x偏移量。
 * @param {Number} yOffset y偏移量。
 */

/**
 * @method scrollTo
 * 滚动到指定位置。
 * @param {Number} xOffset X方向偏移量。
 * @param {Number} yOffset Y方向偏移量。
 * @param {Number} duration 滚动时间(毫秒)。
 * @return {UIElement} 返回控件本身。
 */
UIScrollViewX.prototype.scrollTo = function(xOffset, yOffset, duration) {
	var xs = this.ox;
	var ys = this.oy;
	var xe = this.fixXOffset(xOffset);
	var ye = this.fixYOffset(yOffset);
	
	var xd = xe - xs;
	var yd = ye - ys;
	if(!duration || (!xd && !yd)) {
		this.setOffset(xOffset, yOffset);
		this.callOnScrollDoneHandler(this.ox, this.oy);

		return this;
	}

	var startTime = Date.now();
	function step(now) {
		var tPercent = (now - startTime)/duration;
		if(tPercent >= 1) {
			tPercent = 1;
			this.setStepScroll(null);
		}
		if(this.pointerDown) {
			this.setStepScroll(null);
		}

		var percent = this.interpolator.get(tPercent);
		var ox = xs + xd * percent;
		var oy = ys + yd * percent;
		this.setOffset(ox, oy, true);
		this.scrollBarOpacity = 1 - percent;

		if(tPercent >= 1) {
			this.callOnScrollDoneHandler(this.ox, this.oy);
		}
	}

	this.setStepScroll(step);

	return this;
}

UIScrollViewX.prototype.setStepScroll = function(stepScroll) {
	this.stepScroll = stepScroll;

	return this;
}

UIScrollViewX.prototype.stepAnimation = function(canvas, now) {
	UIElement.prototype.stepAnimation.call(this, canvas, now);
	if(this.stepScroll) {
		this.stepScroll(now || canvas.now || Date.now());
		this.postRedraw();
	}

	return this;
}

UIScrollViewX.prototype.isDraggable = function() {
	if(this.isInDesignMode()) {
		if(this.hitTestResult !== UIElement.HIT_TEST_MM) {
			return false;
		}

		return !this.getTarget() || this.view.isAltDown();
	}
	else {
		return true;
	}
}

UIScrollViewX.prototype.onPointerDownRunning = UIScrollViewX.prototype.onPointerDownEditing = function(point, beforeChild) {
	this.scrollBarOpacity = 1;
	if(!beforeChild && this.isDraggable()) {
		this.dragStart();
		return true;
	}
	return false;
}

UIScrollViewX.prototype.onPointerMoveRunning = UIScrollViewX.prototype.onPointerMoveEditing = function(point, beforeChild) {
	if(!beforeChild && this.pointerDown && this.isDraggable()){ 
		this.drag();
		return true;
	}
	return false;
}

UIScrollViewX.prototype.onPointerUpRunning = UIScrollViewX.prototype.onPointerUpEditing = function(point, beforeChild) {
	if(!beforeChild && this.pointerDown && this.isDraggable()) {
		this.dragEnd();
		return true;
	}
	this.scrollBarOpacity = 0;

	return false;
}

UIScrollViewX.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.left + this.xOffset), y : (point.y - this.top + this.yOffset)};

	return p;
}

UIScrollViewX.prototype.onClip = function(canvas) {
	if(this.showOutside && this.isInDesignMode()) {
		return this;
	}

	canvas.clipRect(0, 0, this.w, this.h);

	return this;
}

UIScrollViewX.prototype.isChildVisibleRecursive = function(child) {
	if(child.children && child.children.length) {
		return true;
	}

	return false;
}

UIScrollViewX.prototype.isChildVisible = function(canvas, child) {
	var l = this.ox;
	var r = l + this.w;
	var t = this.oy;
	var b = t + this.h;

	if(!child.visible) {
		return false;
	}
	
	if(this.showOutside && this.isInDesignMode()) {
		return true;
	}

	if(this.isChildVisibleRecursive(child)) {
		return true;
	}

	if((child.top + child.h) < t || child.top > b || (child.left + child.w) < l || child.left > r) {
		return false;
	}

	return true;
}

UIScrollViewX.prototype.paintChildren = function(canvas) {
	var l = this.ox;
	var t = this.oy;
	var children = this.children;
	var n = children.length;

	canvas.save();
	canvas.translate(-l, -t);
	for(var i = 0; i < n; i++) {
		var iter = this.children[i];
		if(this.isChildVisible(canvas, iter)) {
			this.beforePaintChild(iter, canvas);
			iter.paintSelf(canvas);
			this.afterPaintChild(iter, canvas);
		}
	}
	canvas.restore();
	this.drawScrollBar(canvas);
	
	return;
}

UIScrollViewX.prototype.dispatchPointerDownToChildren = function(p) {
	if(!this.hitTestResult && !this.showOutside) {
		return false;
	}

	if(this.isInDesignMode() && this.view.isAltDown()) {
		return false;
	}

	return this.defaultDispatchPointerDownToChildren(p);
}

function UIScrollViewXCreator() {
	var args = ["ui-scroll-view-x", "ui-scroll-view-x", null, true];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIScrollViewX();
		return g.initUIScrollViewX(this.type);
	}
	
	return;
}

UIScrollViewX.prototype.drawBgImageScroll = function(canvas, display, image, rect) {
	switch(display) {
		case WImage.DISPLAY_SCALE: {
			var scaleX = rect.w/this.virtualWidth;
			var scaleY = rect.h/this.virtualHeight;
			var sx = this.xOffset * scaleX;
			var sy = this.yOffset * scaleY;
			var sw = this.w * scaleX;
			var sh = this.h * scaleY;
		
			canvas.drawImage(image, sx, sy, sw, sh, 0, 0, this.w, this.h);
			break;
		}
		case WImage.DISPLAY_TILE: {
			var dx = Math.floor(this.xOffset/rect.w) * rect.w - this.xOffset;
			var dy = Math.floor(this.yOffset/rect.h) * rect.h - this.yOffset
			var dw = Math.ceil((this.w - dx)/rect.w) * rect.w;
			var dh = Math.ceil((this.h - dy)/rect.h) * rect.h;
			
			canvas.save();
			canvas.clipRect(0, 0, this.w, this.h);
			WImage.draw(canvas, image, display, dx, dy, dw, dh, rect);
			canvas.restore();
			break;
		}
		default:break;
	}

	return this;
}

UIScrollViewX.prototype.afterChildAppended = function(shape) {
	shape.xAttr		= UIElement.X_FIX_LEFT;
	shape.yAttr		= UIElement.Y_FIX_TOP;
	shape.widthAttr	= UIElement.WIDTH_FIX;
	shape.heightAttr= UIElement.HEIGHT_FIX;

	if(this.isUILayout) {
		this.relayoutChildren();
	}

	return true;
}

UIScrollViewX.prototype.drawBgImage = function(canvas) {
	if(this.scrollBgImage) {
		var wImage = this.getBgImage();
		if(wImage) {
			var image = wImage.getImage();
			var rect = wImage.getImageRect();
			if(image && rect) {
				this.drawBgImageScroll(canvas, this.images.display, image, rect);
			}
		}
	}
	else {
		UIElement.prototype.drawBgImage.call(this, canvas);
	}
}

UIScrollViewX.prototype.drawVScrollBar = function(canvas) {
	var x = 0;
	var y = 0;
	var w = 0;
	var h = 0;
	var rect = null;
	var image = null;
	
	var bg = this.getImageByType(UIElement.IMAGE_V_SCROLL_BAR_BG);
	var image = bg ? bg.getImage() : null;
	if(image) {
		rect = bg.getImageRect();
		w = rect.rw || rect.w;
		x = this.w - w;
		y = 0;
		h = this.h;

		this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_3PATCH_V, x, y, w, h);
	}

	var fg = this.getImageByType(UIElement.IMAGE_V_SCROLL_BAR_FG);
	var image = fg ? fg.getImage() : null;
	if(image) {
		rect = fg.getImageRect();
		w = rect.rw || rect.w;
		x = this.w - w;
		y = this.h * (this.yOffset/this.virtualHeight);
		h = this.h * (this.h/this.virtualHeight);
		if(y < 0) {
			h = Math.max(10, h + y);
			y = 0;
		}

		if((y + h) > this.h) {
			h = Math.max(10, this.h - y);
			y = this.h - h;
		}

		this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_3PATCH_V, x, y, w, h);
	}

	return;
}

UIScrollViewX.prototype.drawHScrollBar = function(canvas) {
	var x = 0;
	var y = 0;
	var w = 0;
	var h = 0;
	var rect = null;
	var image = null;
	
	var bg = this.getImageByType(UIElement.IMAGE_H_SCROLL_BAR_BG);
	var image = bg ? bg.getImage() : null;
	if(image) {
		rect = bg.getImageRect();
		x = 0;
		w = this.w;
		h = rect.rh || rect.h;
		y = this.h - h;

		this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_3PATCH_H, x, y, w, h);
	}

	var fg = this.getImageByType(UIElement.IMAGE_H_SCROLL_BAR_FG);
	var image = fg ? fg.getImage() : null;
	if(image) {
		rect = fg.getImageRect();
		h = rect.rh || rect.h;
		y = this.h - h;
		x = this.w * (this.xOffset/this.virtualWidth);
		w = this.w * (this.w/this.virtualWidth);
		if(x < 0) {
			w = Math.max(10, w + x);
			x = 0;
		}

		if((x + w) > this.w) {
			w = Math.max(10, this.w - x);
			x = this.w - w;
		}

		this.drawImageAt(canvas, image, UIElement.IMAGE_DISPLAY_3PATCH_H, x, y, w, h);
	}
}

UIScrollViewX.prototype.drawScrollBar = function(canvas) {
	if(this.scrollBarOpacity < 0.0001) {
		return this;
	}
	
	canvas.save();
	canvas.globalAlpha = this.scrollBarOpacity;
	if(this.w < this.virtualWidth) {
		this.drawHScrollBar(canvas);
	}
	
	if(this.h < this.virtualHeight) {
		this.drawVScrollBar(canvas);
	}
	canvas.restore();

	return this;
}

ShapeFactoryGet().addShapeCreator(new UIScrollViewXCreator());

