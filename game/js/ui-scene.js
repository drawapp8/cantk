/*
 * File:   ui-scene.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  The game scene
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIScene() {
	return;
}

UIScene.prototype = new UINormalWindow();
UIScene.prototype.isUIScene = true;

UIScene.prototype.initUIScene = function(type, w, h, bg) {
	this.initUIWindow(type, 0, 0, w, h, bg);	
	this.widthAttr  = UIElement.WIDTH_FILL_PARENT;
	this.heightAttr = UIElement.HEIGHT_FILL_PARENT;
	this.images.display = UIElement.IMAGE_DISPLAY_SCALE;

	this.xOffset = 0;
	this.yOffset = 0;
	this.virtualWidth = 0;
	this.virtualHeight = 0;
	this.autoClearForce = true;
	this.setAnimHint("none");
	this.setCanRectSelectable(false, true);
	this.addEventNames(["onPointerDown", "onPointerMove", "onPointerUp", "onDoubleClick"]);
	this.addEventNames(["onSwipeLeft", "onSwipeRight", "onSwipeUp", "onSwipeDown"]);
	this.setImage(UIElement.IMAGE_TIPS1, null);
	this.setImage(UIElement.IMAGE_TIPS2, null);
	this.setImage(UIElement.IMAGE_TIPS3, null);
	this.setImage(UIElement.IMAGE_TIPS4, null);
	this.setImage(UIElement.IMAGE_TIPS5, null);
	this.setCameraFollowParams(0.5, 0.5, 0.5, 0.5);

	return this;
}

UIScene.prototype.resetGame = function() {
	if(this.world) {
		var world = this.world;
		Physics.destroyWorld(world);
		this.world = null;
	}

	this.restoreState();
	this.relayout();
	this.initStageOne();
	this.doInit();
	this.initChildren();
	this.updateStickyChildren();

	return;
}

UIScene.prototype.addStickyChild = function(child) {
	if(child.parentShape !== this || child.x >= this.w || child.y >= this.h) {
		console.log("%cWarning: invalid params to addStickyChild.", "color: red; font-weight: bold");

		return this;
	}

	child.orgX = child.x;
	child.orgY = child.y;

	this.stickyChildren.push(child);

	return this;
}

UIScene.prototype.removeStickyChild = function(child) {
	this.stickyChildren.remove(child);

	return this;
}

UIScene.prototype.updateStickyChildren = function() {
	this.stickyChildren = [];
	var a = this.children;
	for(var i = 0; i < a.length; i++) {
		var iter = a[i];
		if(iter.sticky) {
			if(iter.orgX === undefined) {
				iter.orgX = iter.x;
			}
			if(iter.orgY === undefined) {
				iter.orgY = iter.y;
			}
			this.stickyChildren.push(iter);
		}
	}

	return this;
}

UIScene.prototype.doInit = function() {
	this.xOffset = 0;
	this.yOffset = 0;
	this.setTimeScale(1);

	if(this.enablePhysics) {
		Physics.createWorld(this);	
		if(this.world && this.map) {
			this.map.createBodies(this.world);
		}
	}

	if(this.gameName) {
		document.title = this.gameName;
	}

	return;
}

UIScene.prototype.onOpen = function(initData) {
	this.doInit();
	this.play();

	return;
}

UIScene.prototype.onInit = function() {
	var me = this;
	this.initStageOne();
	this.updateStickyChildren();

	setTimeout(function() {
		WWindowManager.getInstance().showFPS(me.showFPS);
		WWindowManager.getInstance().setMaxFPSMode(me.maxFPSMode);
	}, 1000);

	return;
}

UIScene.prototype.onDeinit = function() {
	if(this.world) {
		var world = this.world;
		Physics.destroyWorld(world);
		this.world = null;
	}

	this.stop();

	return;
}

UIScene.prototype.getVirtualWidth = function() {
	if(this.virtualWidth < this.w) {
		return this.w;
	}

	return this.virtualWidth;
}

UIScene.prototype.getVirtualHeight = function() {
	if(this.virtualHeight < this.h) {
		return this.h;
	}

	return this.virtualHeight;
}

UIScene.prototype.onScrolled = function() {
	var a = this.stickyChildren;
	if(a && a.length) {
		var ox = this.xOffset;
		var oy = this.yOffset;
		for(var i = 0; i < a.length; i++) {
			var iter = a[i];
			var x = iter.orgX + ox;
			var y = iter.orgY + oy;
			iter.setPosition(x, y);
		}
	}

	return;
}

UIScene.prototype.setOffset = function(xOffset, yOffset) {
	if(xOffset || xOffset === 0) {
		var maxOffset = this.getVirtualWidth() - this.w;
		
		var xOffsetNew = Math.max(0, xOffset);
		if(xOffsetNew > maxOffset) {
			xOffsetNew = maxOffset;
		}
		this.xOffset = xOffsetNew;
	}

	if(yOffset || yOffset === 0) {
		var maxOffset = this.getVirtualHeight() - this.h;

		var yOffsetNew = Math.max(0, yOffset);
		if(yOffsetNew > maxOffset) {
			yOffsetNew = maxOffset;
		}
		this.yOffset = yOffsetNew;
	}

	this.onScrolled();

	return;
}

UIScene.prototype.getRelayoutWidth = function() {
	return this.getVirtualWidth();
}

UIScene.prototype.getRelayoutHeight = function() {
	return this.getVirtualHeight();
}

UIScene.prototype.defaultPaintChildren = function(canvas) {
	var left = this.xOffset;
	var top = this.yOffset;
	var right = this.xOffset + this.w;
	var bottom = this.yOffset + this.h;

	var k = 0;
	var children = this.children;
	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var shape = children[i];
		if(!shape) {
			continue;
		}

		var skipIt = false;
		if(!shape.rotation) {
			if(shape.x > right || shape.y > bottom || (shape.x + shape.w) < left || (shape.y + shape.h) < top) {
				skipIt = true;
			}
		}
		else {
			var s = Math.max(shape.w, shape.h);
			if((shape.x - s) > right || (shape.y - s) > bottom || (shape.x + s) < left || (shape.y + s) < top) {
				skipIt = true;
			}
		}

		if(!shape.visible || skipIt) {
			if(shape.isAnimating()) {
				shape.stepAnimation(canvas);
			}
			continue;
		}
	
		shape.paintSelf(canvas);
	}

	this.paintTargetShape(canvas);

	return;
}

UIScene.prototype.setMap = function(map) {
	this.map = map;
	if(map) {
		var mapWidth = map.getMapWidth();
		var mapHeight = map.getMapHeight();
		
		if(mapWidth > this.w) {
			this.virtualWidth = mapWidth;
		}

		if(mapHeight > this.h) {
			this.virtualHeight = mapHeight;
		}

		this.setOffset(0, 0);
	}

	return this;
}

UIScene.prototype.getMap = function() {
	return this.map;
}

UIScene.prototype.drawBgImage = function(canvas) {
	if(this.map) {
		var ox = this.xOffset;
		var oy = this.yOffset;

		var rect = {x:ox, y:oy, w:this.w, h:this.h};
		
		canvas.translate(-ox, -oy);
		this.map.draw(canvas, rect);
		canvas.translate(ox, oy);

		return;
	}

	var wImage = this.getBgImage();
	if(wImage && wImage.getImage()) {
		var image = wImage.getImage();
		var srcRect = wImage.getImageRect();
		var display = this.images.display;

		if(display === UIElement.IMAGE_DISPLAY_TILE_V) {
			this.drawBgImageVTile(canvas, image, srcRect);
		}
		else if(display === UIElement.IMAGE_DISPLAY_TILE_H) {
			this.drawBgImageHTile(canvas, image, srcRect);
		}
		else {
			this.drawImageAt(canvas, image, display, 0, 0, this.w, this.h, srcRect);
		}

		return;
	}
}

UIScene.prototype.drawBgImageVTile = function(canvas, image, srcRect) {
	var w = this.w;
	var h = this.h;
	var iw = srcRect.w;
	var ih = srcRect.h;
	var scale = w/iw;

	var dy = 0;
	var sx =  srcRect.x;
	var sy = srcRect.y + this.yOffset%ih;
	var sh = Math.min(ih-sy, h/scale);

	for(var dy = 0; dy < h; ) {
		var dh = sh * scale;
		canvas.drawImage(image, sx, sy, iw, sh, 0, dy, w, dh);

		dy += dh;
		sh = Math.min(ih, (h - dy)/scale);
		sy = srcRect.y;
	}
}

UIScene.prototype.drawBgImageHTile = function(canvas, image, srcRect) {
	var w = this.w;
	var h = this.h;
	var iw = srcRect.w;
	var ih = srcRect.h;
	var scale = h/ih;

	var dx = 0;
	var sy = srcRect.y;
	var sx = srcRect.x + this.xOffset%iw;
	var sw = Math.min(iw-sx, w/scale);

	for(var dx = 0; dx < w; ) {
		var dw = sw * scale;
		canvas.drawImage(image, sx, sy, sw, ih, dx, 0, dw, h);

		dx += dw;
		sw = Math.min(iw, (w - dx)/scale);
		sx = srcRect.x;
	}

	return;
}

UIScene.prototype.showTrace = function(start, velocity, style, damping) {
	if(!start || !velocity) {
		this.traceInfo = null;
	}

	if(!style) {
		style = {};
	}

	if(!damping) {
		damping = {};
		damping.x = 0;
		damping.y = 0;
	}

	var ti = {};
	ti.sx = start.x;
	ti.sy = start.y;

	ti.vX = this.toPixel(velocity.x);
	ti.vY = this.toPixel(velocity.y);

	ti.dampingX = this.toPixel(damping.x);
	ti.dampingY = this.toPixel(damping.y);

	ti.lineColor = style.lineColor ? style.lineColor : "Black";
	ti.lineWidth = style.lineWidth ? style.lineWidth : 2;
	ti.deltaT = 0.02;
	ti.points = [];

	this.traceInfo = ti;

	this.computeTrace(ti);

	return this;
}

UIScene.prototype.computeTrace = function(ti) {
	var x = ti.sx;
	var y = ti.sy;
	var sx = x;
	var sy = y;
	var vX = ti.vX;
	var vY = ti.vY;
	var gX = this.toPixel(this.gravityX ? this.gravityX : 0);
	var gY = this.toPixel(this.gravityY ? this.gravityY : 0);
	var dt = ti.deltaT;
	var vMax = Math.max(Math.max(vX, vY), Math.max(gX, gY));

	var top = this.yOffset;
	var bottom = top + this.h;
	var left = this.xOffset;
	var right = left + this.w;

	ti.points.push({x:x, y:y});

	for(var i = 0; i < 50; i++) {
		var t = dt * i;
		x = Math.round(sx + vX * t + 0.5 * gX * t * t);
		y = Math.round(sy + vY * t + 0.5 * gY * t * t);

		ti.points.push({x:x, y:y});
		if(x < left || x > right || y < top || y > bottom) break;
	}

	return this;
}

UIScene.prototype.drawTrace = function(canvas) {
	var ti = this.traceInfo;
	if(!ti) return;

	canvas.beginPath();
	canvas.lineWidth = ti.lineWidth;
	canvas.strokeStyle = ti.lineColor;

	var n = ti.points.length;
	for(var i = 0; i < n; i++) {
		var p = ti.points[i];
		if(i%2) {
			canvas.moveTo(p.x, p.y);
		}
		else {
			canvas.lineTo(p.x, p.y);
		}
	}

	canvas.stroke();

	return this;
}

UIScene.prototype.afterPaintChildren = function(canvas) {
	if(this.mode !== Shape.MODE_EDITING) {
		this.drawTrace(canvas);
		this.drawTipsImage(canvas);
	}

	if(!this.selected || this.mode !== Shape.MODE_EDITING) {
		return;
	}
	
	var y = 10;
	var w = this.w;
	var h = this.h;
	var text = "";
	var x = w >> 1;
	var vw = this.getVirtualWidth();
	var vh = this.getVirtualHeight();

	if(this.xOffset) {
		text = "XOffset:" + this.xOffset;
	}

	if(this.yOffset) {
		text += " YOffset:" + this.yOffset;
	}

	if(text) {
		canvas.font = "16pt Sans";
		canvas.textBaseline = "top";
		canvas.textAlign = "center";
		canvas.fillStyle = "#202020";
		canvas.fillText(text, x, y);
	}

	if(!this.pointerDown) {
		return;
	}

	if(vw === w && vh === h) {
		return;
	}

	var size = 20;
	var alpha = canvas.globalAlpha;
	canvas.fillStyle = this.style.lineColor;

	if(vw > w) {
		var y = h - size;
		var bw = w * (w/vw);
		var x = w *(this.xOffset/vw);

		canvas.globalAlpha = 0.2;
		canvas.fillRect(0, y, w, size);
		canvas.globalAlpha = 0.5;
		canvas.fillRect(x, y, bw, size);
	}

	if(vh > h) {
		var x = w - size;
		var bh = h * (h/vh);
		var y = h *(this.yOffset/vh);

		canvas.globalAlpha = 0.2;
		canvas.fillRect(x, 0, size, h);
		canvas.globalAlpha = 0.5;
		canvas.fillRect(x, y, size, bh);
	}
	canvas.globalAlpha = alpha;

	return;
}

UIScene.prototype.paintChildren = function(canvas) {
	canvas.save();	
	canvas.beginPath();
	canvas.rect(0, 0, this.w, this.h);
	canvas.clip();
	canvas.beginPath();

	canvas.translate(-this.xOffset, -this.yOffset);
	this.defaultPaintChildren(canvas);
	canvas.restore();

	if(this.popupWindow) {
		this.popupWindow.paintSelf(canvas);
	}
	
	return;
}

UIScene.prototype.setTipsImage = function(index, display) {
	this.tipsImageIndex = index;
	this.tipsImageDisplay = display;

	return this;
}

UIScene.prototype.drawTipsImage = function(canvas) {
	if(!this.tipsImageIndex) {
		return;
	}

	var name = "tips_img_" + this.tipsImageIndex;
	var wImage = this.images[name];
	if(wImage) {
		var image = wImage.getImage();

		if(image) {
			var srcRect = wImage.getImageRect();
			var display = this.tipsImageDisplay;

			if(!display && display !== 0) {
				display = this.w < this.h ? UIElement.IMAGE_DISPLAY_FIT_WIDTH : UIElement.IMAGE_DISPLAY_FIT_HEIGHT;
			}
		
			this.drawImageAt(canvas, image, display, 0, 0, this.w, this.h, srcRect);
		}
	}

	return;
}

UIScene.prototype.onPointerMoveEditing = function(point, beforeChild) {
	if(!this.pointerDown || beforeChild || this.targetShape) {
		return;
	}

	var vw = this.getVirtualWidth();
	var vh = this.getVirtualHeight();

	if(vw === this.w && vh === this.h) {
		return;
	}

	var dx = this.getMoveDeltaX();
	var dy = this.getMoveDeltaY();

	var xOffset = this.xOffset - dx;
	var yOffset = this.yOffset - dy;

	if(xOffset < 0) {
		xOffset = 0;
	}

	if(yOffset < 0) {
		yOffset = 0;
	}

	if((xOffset + this.w) > vw) {
		xOffset = vw - this.w;
	}

	if((yOffset + this.h) > vh) {
		yOffset = vh - this.h;
	}

	this.xOffset = xOffset;
	this.yOffset = yOffset;

	return;
}

UIScene.prototype.fixChildSize = function(shape) {
	return;
}

UIScene.prototype.fixChildPosition = function(shape) {
	return;
}

UIScene.prototype.afterRelayoutChild = function(child) {
	var vw = this.getVirtualWidth();
	var vh = this.getVirtualHeight();

	if(child.widthAttr === UIElement.WIDTH_FILL_PARENT) {
		child.x = 0;
		child.w = vw;
	}
	else if(child.widthAttr === UIElement.WIDTH_FILL_AVAILABLE) {
		child.w = vw - child.x;
	}

	if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.y = 0;
		child.h = vh;
	}
	else if(child.heightAttr === UIElement.HEIGHT_FILL_AVAILABLE) {
		child.h = vh - child.y;
	}

	return;
}

UIScene.prototype.afterChildAppended = function(shape) {
	if(this.mode === Shape.MODE_EDITING || !this.world) {
		return;
	}

	Physics.createBodyForElement(this.world, this, shape);
}

UIScene.prototype.afterChildRemoved = function(shape) {
	if(this.map === shape) {
		this.map = null;
	}

	if(this.mode === Shape.MODE_EDITING || !this.world) {
		return;
	}

	Physics.destroyBodyForElement(this.world, shape);

	this.postRedraw();

	return;
}

UIScene.prototype.translatePoint = function(point) {
	if(this.popupWindow) {
		return point;
	}
	else {
		var p = {x : (point.x - this.x + this.xOffset), y : (point.y - this.y + this.yOffset)};
		return p;
	}
}

UIScene.prototype.isPlaying = function() {
	return this.playing && this.mode != Shape.MODE_EDITING;
}

UIScene.prototype.replay = function() {
	this.resetGame();
	this.play();

	return;
}

UIScene.pauseElement = function(el) {
	if(el.isUISkeletonAnimation || el.isUITimer || el.isUIFrameAnimation || el.isUITransformAnimation) {
		el.pause();
	}
	
	for(var i = 0; i < el.children.length; i++) {
		var iter = el.children[i];
		UIScene.pauseElement(iter);	
	}

	return;
}

UIScene.prototype.pause = function() {
	this.playing = false;

	UIScene.pauseElement(this);

	return this;
}

UIScene.resumeElement = function(el) {
	if(el.isUISkeletonAnimation || el.isUITimer || el.isUIFrameAnimation || el.isUITransformAnimation) {
		el.resume();
	}
	
	for(var i = 0; i < el.children.length; i++) {
		var iter = el.children[i];
		UIScene.resumeElement(iter);	
	}

	return;
}

UIScene.prototype.resume = function() {
	this.playing = true;

	UIScene.resumeElement(this);

	return this;
}

UIScene.prototype.play = function() {
	this.playing = true;

	return;
}

UIScene.prototype.stop = function() {
	this.playing = false;

	return;
}

UIScene.prototype.toMeter = function(pixel) {
	var pixelsPerMeter = this.pixelsPerMeter ? this.pixelsPerMeter : 10;

	return pixel/pixelsPerMeter;
}

UIScene.prototype.toPixel = function(meter) {
	var pixelsPerMeter = this.pixelsPerMeter ? this.pixelsPerMeter : 10;

	return Math.round(meter * pixelsPerMeter);
}

UIScene.prototype.getFPS = function() {
	return this.fps ? this.fps : 30;
}

UIScene.prototype.setFPS = function(fps) {
	this.fps = Math.max(5, Math.min(50, fps));

	return this;
}

UIScene.prototype.setVelocityIterations = function(velocityIterations) {
	this.velocityIterations = velocityIterations;

	return this;
}

UIScene.prototype.setPositionIterations = function(positionIterations) {
	this.positionIterations = positionIterations;

	return this;
}

UIScene.prototype.setAutoClearForce = function(autoClearForce) {
	this.autoClearForce = autoClearForce;

	return this;
}

UIScene.prototype.setCameraFollowParams = function(xMin, xMax, yMin, yMax) {
	this.cameraFollowParams = {};
	this.cameraFollowParams.xMin = xMin;
	this.cameraFollowParams.xMax = xMax;
	this.cameraFollowParams.yMin = yMin;
	this.cameraFollowParams.yMax = yMax;

	return this;
}

UIScene.prototype.cameraFollow = function(element) {
	var w = this.w;
	var h = this.h;
	var x = element.x;
	var y = element.y;
	var dx = x - this.xOffset;
	var dy = y - this.yOffset;
	var params = this.cameraFollowParams;

	var xOffset = this.xOffset;
	if(dx > params.xMax * w) {
		xOffset = Math.round(x - params.xMax * w) + (element.w >> 1);
	}
	else if(dx < params.xMin * w){
		xOffset = Math.round(x - params.xMin * w) + (element.w >> 1);
	}

	var yOffset = this.yOffset;
	if(dy > params.yMax * h) {
		yOffset = Math.round(y - params.yMax * h) + (element.h >> 1);
	}
	else if(dy < params.yMin * h) {
		yOffset = Math.round(y - params.yMin * h) + (element.h >> 1);
	}

	this.setOffset(xOffset, yOffset);

	return;
}

function UISceneCreator() {
	var args = ["ui-scene", "ui-scene", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIScene();
		return g.initUIScene(this.type, 200, 200, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UISceneCreator());

