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
	this.setAnimHint("none");
	this.setCanRectSelectable(false, true);
	this.addEventNames(["onPointerDown", "onPointerMove", "onPointerUp", "onDoubleClick"]);
	this.addEventNames(["onSwipeLeft", "onSwipeRight", "onSwipeUp", "onSwipeDown"]);

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
	this.doInit();
	this.initChildren();
	this.updateStickyChildren();

	return;
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

	if(this.enablePhysics) {
		Physics.createWorld(this);	
	}

	if(this.gameName) {
		document.title = this.gameName;
	}

	return;
}

UIScene.prototype.onInit = function() {
	if(!this.getSavedState()) {
		this.saveState();
	}

	this.doInit();
	this.play();
	this.updateStickyChildren();
	
	return;
}

UIScene.prototype.onDeinit = function() {
	if(this.world) {
		var world = this.world;
		Physics.destroyWorld(world);
		this.world = null;
	}

//	var me = this;
//	setTimeout(function() {
//		me.restoreState();
//	}, 1000);
//
//	this.restoreState();
//	this.clearState();	
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

	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var shape = this.children[i];
		var inVisible = !shape.visible ;
		var outOfView = shape.x > right || shape.y > bottom || (shape.x + shape.w) < left || (shape.y + shape.h) < top;
		if(shape.rotation) {
			outOfView = outOfView && Math.abs(shape.w/shape.h - 1) <  0.2;
		}

		if(shape.body) {
			shape.body.SetAwake(!inVisible);
		}

		if(inVisible || outOfView) {
			continue;
		}

		shape.paintSelf(canvas);
	}
	
	this.paintTargetShape(canvas);

	return;
}

UIScene.prototype.drawBgImage = function(canvas) {
	var image = this.getBgImage();
		
	if(image && image.getImage()) {
		var display = this.images.display;

		image = image.getImage();
		if(display === UIElement.IMAGE_DISPLAY_TILE_V) {
			this.drawBgImageVTile(canvas, image);
		}
		else if(display === UIElement.IMAGE_DISPLAY_TILE_H) {
			this.drawBgImageHTile(canvas, image);
		}
		else {
			this.drawImageAt(canvas, image, this.images.display, 0, 0, this.w, this.h, null);
		}
	}

	return;
}

UIScene.prototype.drawBgImageVTile = function(canvas, image) {
	var w = this.w;
	var h = this.h;
	var iw = image.width;
	var ih = image.height;
	var scale = w/iw;

	var dy = 0;
	var sy = this.yOffset%ih;
	var sh = Math.min(ih-sy, h/scale);

	for(var dy = 0; dy < h; ) {
		var dh = sh * scale;
		canvas.drawImage(image, 0, sy, iw, sh, 0, dy, w, dh);

		dy += dh;
		sh = Math.min(ih, (h - dy)/scale);
		sy = 0;
	}
}

UIScene.prototype.drawBgImageHTile = function(canvas, image) {
	var w = this.w;
	var h = this.h;
	var iw = image.width;
	var ih = image.height;
	var scale = h/ih;

	var dx = 0;
	var sx = this.xOffset%iw;
	var sw = Math.min(iw-sx, w/scale);

	for(var dx = 0; dx < w; ) {
		var dw = sw * scale;
		canvas.drawImage(image, sx, 0, sw, ih, dx, 0, dw, h);

		dx += dw;
		sw = Math.min(iw, (w - dx)/scale);
		sx = 0;
	}

	return;
}

UIScene.prototype.afterPaintChildren = function(canvas) {
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

function UISceneCreator() {
	var args = ["ui-scene", "ui-scene", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIScene();
		return g.initUIScene(this.type, 200, 200, null);
	}
	
	return;
}
