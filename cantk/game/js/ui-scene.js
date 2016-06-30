/*
 * File:   ui-scene.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  The game scene
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016 Holaverse Inc.
 * 
 */

/**
 * @class UIScene
 * @extends UINormalWindow
 * 游戏场景。在UINormalWindow上增加了物理引擎和虚拟屏幕的支持。
 *
 */

/**
 * @property {Number} xOffset 
 * 当场景的虚拟大小大于实际大小时，当前可视区域的X偏移量。
 */

/**
 * @property {Number} yOffset 
 * 当场景的虚拟大小大于实际大小时，当前可视区域的Y偏移量。
 */

/**
 * @property {Number} virtualWidth 
 * 当场景的虚拟宽度。
 */

/**
 * @property {Number} virtualHeight 
 * 当场景的虚拟高度。
 */
function UIScene() {
	return;
}

UIScene.prototype = new UINormalWindow();
UIScene.prototype.isUIScene = true;

UIScene.prototype.saveProps = ["enablePhysics", "showFPS", "maxFPSMode", "fps", "gravityX", "gravityY",
	"pixelsPerMeter", "virtualWidth", "virtualHeight", "xOffset", "yOffset", "openAnimationDuration",
	"closeAnimationDuration", "animHint", "windowType", "refLinesV", "refLinesH", "sceneId"];

UIScene.prototype.canRectSelectable = function() {
	return this.virtualHeight <= this.h && this.virtualWidth <= this.w;
}

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
	this.addEventNames(["onPointerDown", "onPointerMove", "onPointerUp", "onDoubleClick", "onMultiTouch"]);
	this.addEventNames(["onSwipeLeft", "onSwipeRight", "onSwipeUp", "onSwipeDown"]);
	this.setImage(UIElement.IMAGE_TIPS1, null);
	this.setImage(UIElement.IMAGE_TIPS2, null);
	this.setImage(UIElement.IMAGE_TIPS3, null);
	this.setImage(UIElement.IMAGE_TIPS4, null);
	this.setImage(UIElement.IMAGE_TIPS5, null);
	this.setCameraFollowParams(0.5, 0.5, 0.5, 0.5);
	this.velocityTracker = new VelocityTracker();

	return this;
}

UIScene.prototype.resetGame = function() {
	UIElement.logWarning("This API is removed, don't call it anymore! call win.replay() instead. (don't call it in open/beforeopen event.)");

	return;
}

UIScene.prototype.addStickyChild = function(child) {
	if(child.parentShape !== this || child.left >= this.w || child.top >= this.h) {
		console.log("%cWarning: invalid params to addStickyChild.", "color: red; font-weight: bold");

		return this;
	}

	child.orgX = child.left;
	child.orgY = child.top;

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
				iter.orgX = iter.left;
			}
			if(iter.orgY === undefined) {
				iter.orgY = iter.top;
			}
			this.stickyChildren.push(iter);
		}
	}

	return this;
}

UIScene.prototype.setEnablePhysics = function(enablePhysics) {
	this.enablePhysics = enablePhysics;

	return this;
}

UIScene.prototype.startPhysics = function() {
	if(this.enablePhysics) {
		Physics.createWorld(this);

		if(this.world) {
			if(this.map) {
				this.map.createBodies(this.world);
			}
		}else{
			console.log("create world failed.");
		}
	}

	return this;
}

UIScene.prototype.doInit = function() {
	this.xOffset = 0;
	this.yOffset = 0;
	this.setTimeScale(1);
	this.startPhysics();

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
			iter.setLeftTop(x, y);
			if(iter.isUIBody) {
				iter.onPositionChanged();
			}
		}
	}

	return;
}

UIScene.prototype.setOffsetDelta = function(x, y) {
	return this.setOffset(this.xOffset+x, this.yOffset+y);
}

/**
 * @method setOffset
 * 设置场景可视区左上角的坐标。
 * @param {Number} xOffset 
 * @param {Number} yOffset
 * @return {UIElement} 返回控件本身。
 *
 */
UIScene.prototype.setOffset = function(xOffset, yOffset) {
	if(xOffset || xOffset === 0) {
		var maxOffset = this.getVirtualWidth() - this.w;
		
		var xOffsetNew = Math.max(0, xOffset);
		if(xOffsetNew > maxOffset) {
			xOffsetNew = maxOffset;
		}
		this.xOffset = xOffsetNew >> 0;
	}

	if(yOffset || yOffset === 0) {
		var maxOffset = this.getVirtualHeight() - this.h;

		var yOffsetNew = Math.max(0, yOffset);
		if(yOffsetNew > maxOffset) {
			yOffsetNew = maxOffset;
		}
		this.yOffset = yOffsetNew >> 0;
	}

	this.onScrolled();

	return this;
}

/**
 * @method setOffsetPercent 
 * 按百分比设置场景可视区左上角的坐标。
 * @param {Number} xOffsetPercent X方向偏移量百分比(0,100)。
 * @param {Number} yOffsetPercent Y方向偏移量百分比(0,100)。
 * @return {UIElement} 返回控件本身。
 */
UIScene.prototype.setOffsetPercent = function(xOffsetPercent, yOffsetPercent) {
	var xOffset = (this.virtualWidth - this.w) * (xOffsetPercent/100);
	var yOffset = (this.virtualHeight - this.h) * (yOffsetPercent/100);

	return this.setOffset(xOffset, yOffset);
}

UIScene.prototype.getRelayoutWidth = function() {
	return this.getWidth();
}

UIScene.prototype.getRelayoutHeight = function() {
	return this.getHeight();
}

UIScene.prototype.defaultPaintChildren = function(canvas) {
	var children = this.children;
	var n = this.children.length;

	for(var i = 0; i < n; i++) {
		var shape = children[i];
		shape.paintSelf(canvas);
	}

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

UIScene.prototype.drawBgImageTile = function(canvas, image, srcRect) {
    var imageWidth = srcRect.w;
    var imageHeight = srcRect.h;

    var dx = 0;
    var dy = 0;
    var dw = this.w;
    var dh = this.h;
    var maxDx = dw;
    var maxDy = dh;
    var adjustX = srcRect.x + this.xOffset % srcRect.w;
    var adjustY = srcRect.y + this.yOffset % srcRect.h;
    var sx = adjustX;
    var sy = adjustY;
    var sw = srcRect.x + srcRect.w - adjustX;
    var sh = srcRect.y + srcRect.h - adjustY;

    while(dy < maxDy) {
        sx = adjustX;
        sw = srcRect.w - adjustX;
        sh = Math.min(sh, Math.min(maxDy-dy, imageHeight));
        while(dx < maxDx) {
            sw = Math.min(sw, Math.min(maxDx-dx, imageWidth));
            canvas.drawImage(image, sx, sy, sw, sh, dx, dy, sw, sh);
            dx += sw;
            sx = srcRect.x;
            sw = srcRect.w;
        }

        dx = 0;
        dy += sh;
        sh = srcRect.h;
        sy = srcRect.y;
    }
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
        else if(display === UIElement.IMAGE_DISPLAY_TILE) {
            this.drawBgImageTile(canvas, image, srcRect);
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
	var sh = Math.min(srcRect.y + ih-sy, h/scale);
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

UIScene.prototype.afterPaintChildren = function(canvas) {
	if(!this.isInDesignMode()) {
		this.drawTipsImage(canvas);
	}

	if(!this.selected || !this.isInDesignMode()) {
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

UIScene.prototype.paintFPS = function(canvas) {
	var seconds = Math.floor(Date.now()/1000);
	if(!this.lastSeconds) {
		this.fps = 0;
		this.drawCount = 0;
		this.lastSeconds = seconds;
	}
	
	this.drawCount++;
	if(seconds > this.lastSeconds) {
		this.fps = this.drawCount;

		this.drawCount = 0;
		this.lastSeconds = seconds;
	}
	
	var h = 30;
	var w = 60;
	var str = this.fps; 

	canvas.save();
	canvas.beginPath();
	canvas.rect(0, 0, w, h);
	canvas.fillStyle = "Black";
	canvas.fill();

	canvas.textAlign = "center";
	canvas.textBaseline = "middle";
	canvas.font = "20px Sans";
	canvas.fillStyle = "White";
	canvas.fillText(str, w >> 1, h >> 1);
	canvas.restore();
}

UIScene.prototype.paintSelf = function(canvas) {
	this.stepAnimation(canvas);
	UIWindow.prototype.paintSelf.call(this, canvas);

    if(this.world && this.debugBox2d) {
        this.world.DrawDebugData(); 
    }

	if(canvas.setShowFPS) {
		canvas.setShowFPS(this.showFPS);
	}else if(this.showFPS && !this.isInDesignMode()) {
		this.paintFPS(canvas);
	}

	return;
}

UIScene.prototype.paintChildren = function(canvas) {
	var ox = this.xOffset;
	var oy = this.yOffset;
	if(!ox && !oy) {
		this.defaultPaintChildren(canvas);
	}
	else {
		canvas.save();	
		canvas.translate(-ox, -oy);
		this.defaultPaintChildren(canvas);
		canvas.restore();
	}

	return;
}

/**
 * @method setTipsImage
 * 设置提示图片的编号。提示图片通常用于显示游戏玩法之类信息。
 * @param {Number} index index 提示图片的编号，通常是1到5，0表示不显示。
 * @param {Number} display 图片显示方式。
 * @return {UIElement} 返回控件本身。
 *
 */
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

UIScene.prototype.stepAnimation = function(canvas) {
	var c = this.animatingInfo;
	if(!c) {
		return;	
	}

	var x = this.xOffset;
	var y = this.yOffset;
	var timePercent = Math.min((canvas.now - c.startTime)/c.duration, 1);
	var percent = c.interpolator.get(timePercent);

	console.log("stepAnimation:" + timePercent + " " + percent);
	if(c.xRange) {
		x = c.xStart + percent * c.xRange;
	}

	if(c.yRange) {
		y = c.yStart + percent * c.yRange;
	}

	if(timePercent >= 1) {
		this.animatingInfo = null;
	}

	this.setOffset(x, y);
	canvas.needRedraw++;
}

UIScene.prototype.onPointerMoveEditing = function(point, beforeChild) {
	if(!this.pointerDown || beforeChild || this.targetShape) {
		return;
	}

	return this.onPointerMoveCommon(point);
}

UIScene.prototype.onPointerMoveCommon = function(point) {
	var vw = this.getVirtualWidth();
	var vh = this.getVirtualHeight();

	if(vw === this.w && vh === this.h) {
		return;
	}

	var dx = this.getMoveDeltaX();
	var dy = this.getMoveDeltaY();

	if(vw === this.w) {
		dx = 0;
	}

	if(vh === this.h) {
		dy = 0;
	}

	this.setOffsetDelta(-dx, -dy);

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
		child.left = 0;
		child.w = vw;
	}
	else if(child.widthAttr === UIElement.WIDTH_FILL_AVAILABLE) {
		child.w = vw - child.left;
	}

	if(child.heightAttr === UIElement.HEIGHT_FILL_PARENT) {
		child.top = 0;
		child.h = vh;
	}
	else if(child.heightAttr === UIElement.HEIGHT_FILL_AVAILABLE) {
		child.h = vh - child.top;
	}

	return;
}

/**
 * @method getWorld
 * 获取Box2d的World对象。
 * @return {Object} 获取Box2d的World对象。
 *
 * 参考：http://www.box2dflash.org/docs/2.1a/reference/
 */
UIScene.prototype.getWorld = function() {
	return this.world;
}

UIScene.prototype.createBodyForElement = function(shape) {
	Physics.createBodyForElement(this.world, this, shape);
}

UIScene.prototype.afterChildAppended = function(shape) {
	if(this.isInDesignMode() || !this.world) {
		return;
	}

	if(this.world.IsLocked()) {
		console.log("world IsLocked, so create body async");
		setTimeout(this.createBodyForElement.bind(this, shape), 0);
	}
	else {
		this.createBodyForElement(shape);
	}
}

UIScene.prototype.afterChildRemoved = function(shape) {
	if(this.map === shape) {
		this.map = null;
	}

	if(this.isInDesignMode() || !this.world) {
		return;
	}

	Physics.destroyBodyForElement(this.world, shape);

	this.postRedraw();

	return;
}

UIScene.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.left + this.xOffset), y : (point.y - this.top + this.yOffset)};
	return p;
}

/**
 * @method isPlaying
 * 是否处于暂停状态。
 * @return {Boolean} 是否处于暂停状态。
 *
 */
UIScene.prototype.isPlaying = function() {
	return this.playing && !this.isInDesignMode();
}

/**
 * @method replay
 * 重置游戏。
 * @return {UIScene} 返回场景本身。
 *
 */
UIScene.prototype.replay = function() {
	this.openScene(this.name, this.initData);
	this.play();

	return this;
}

/**
 * @method pause
 * 暂停游戏。
 * @return {UIScene} 返回场景本身。
 *
 */
UIScene.prototype.pause = function() {
	this.playing = false;
	this.setTimeScale(0);

	return this;
}

/**
 * @method resume
 * 恢复游戏。
 * @return {UIScene} 返回场景本身。
 *
 */
UIScene.prototype.resume = function() {
	this.playing = true;
	this.setTimeScale(1);

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

/**
 * @method toMeter
 * 把像素转化成米。
 * @param {Number} pixel
 * @return {Number} 米。
 *
 */
UIScene.prototype.toMeter = function(pixel) {
	var pixelsPerMeter = this.pixelsPerMeter ? this.pixelsPerMeter : 10;

	return pixel/pixelsPerMeter;
}

/**
 * @method toPixel
 * 把米转化成像素。
 * @param {Number} meter
 * @return {Number} 像素。
 *
 */
UIScene.prototype.toPixel = function(meter) {
	var pixelsPerMeter = this.pixelsPerMeter ? this.pixelsPerMeter : 10;

	return meter * pixelsPerMeter;
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

/**
 * @method setAutoClearForce
 * 设置是否自动清除作用力。
 * @param {Boolean} autoClearForce 为真则每个时间片断自动清除作用力，否则力会持续作用。
 * @return {UIScene} 返回场景本身。
 *
 */
UIScene.prototype.setAutoClearForce = function(autoClearForce) {
	this.autoClearForce = autoClearForce;

	return this;
}

/**
 * @method setCameraFollowParams 
 * 设置镜头自动跟随的参数。
 * @param {Number} xMin [0-1] 角色的x < this.w * xMin时向左移动。
 * @param {Number} xMax [0-1] 角色的x > this.w * xMax时向右移动。
 * @param {Number} yMin [0-1] 角色的y < this.h * yMin时向上移动。
 * @param {Number} yMax [0-1] 角色的y > this.h * yMax时向下移动。
 * @return {UIScene} 返回场景本身。
 *
 */
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
	var x = element.left;
	var y = element.top;
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

UIScene.prototype.prepareForOpen = function() {
	if(this.world) {
		var world = this.world;
		Physics.destroyWorld(world);
		this.world = null;
	}

	UIWindow.prototype.prepareForOpen.call(this);
}

UIScene.prototype.isCurrent = function() {
	var wm = this.getParent();
	return wm && wm.getCurrentFrame() === this;
}

UIScene.prototype.onCreateRUBEBody = function(body) {
    if(body) {
        return Physics.createUIRubeBody(body, this.world, this);
    }
    return null;
}

UIScene.prototype.onRUBEJointCreated = function(joint) {
    if(joint) {
        return Physics.createElementForJoint(joint, this.world, this);
    }
    return null;
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

