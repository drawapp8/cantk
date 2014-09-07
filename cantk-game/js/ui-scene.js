/*
 * File:   ui-scene.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  The game scene
 * 
 * Copyright (c) 2014  Li XianJing <xianjimli@hotmail.com>
 * 
 */

function UIScene() {
	return;
}

UIScene.prototype = new UINormalWindow();
UIScene.prototype.isUIScene = true;

UIScene.prototype.initUIScene = function(type, w, h, bg) {
	this.initUIWindow(type, 0, 0, w, h, bg);	
	this.widthAttr  = C_WIDTH_FILL_PARENT;
	this.heightAttr = C_HEIGHT_FILL_PARENT;
	this.images.display = CANTK_IMAGE_DISPLAY_SCALE;

	this.xOffset = 0;
	this.yOffset = 0;
	this.virtualWidth = 0;
	this.virtualHeight = 0;
	this.setCanRectSelectable(false, true);
	this.addEventNames(["onPointerDown", "onPointerMove", "onPointerUp", "onDoubleClick"]);

	return this;
}

UIScene.prototype.saveGameState = function() {
	this.gameState = this.toJson();

	return;
}

UIScene.prototype.restoreGameState = function() {
	if(this.gameState) {
		this.fromJson(this.gameState);
	}

	return;
}

UIScene.prototype.reset = function() {
	if(this.world) {
		var world = this.world;
		Physics.clearAllBodyAndJoints(world);
		delete world;
		this.world = null;

		this.restoreGameState();
		Physics.createWorld(this);
	}

	return;
}

UIScene.prototype.onInit = function() {
	this.xOffset = 0;
	this.yOffset = 0;

	if(this.enablePhysics) {
		this.saveGameState();
		Physics.createWorld(this);	
	}

	if(this.gameName) {
		document.title = this.gameName;
	}

	return;
}

UIScene.prototype.getVirtualWidth = function() {
	if(this.virtualWidth < this.w) {
		this.virtualWidth = this.w;
	}

	return this.virtualWidth;
}

UIScene.prototype.getVirtualHeight = function() {
	if(this.virtualHeight < this.h) {
		this.virtualHeight = this.h;
	}

	return this.virtualHeight;
}

UIScene.prototype.defaultPaintChildren = function(canvas) {
	var left = this.xOffset;
	var top = this.yOffset;
	var right = this.xOffset + this.w;
	var bottom = this.yOffset + this.h;

	var n = this.children.length;
	for(var i = 0; i < n; i++) {
		var shape = this.children[i];
		var inVisible = !shape.visible || shape.x > right || shape.y > bottom || (shape.x + shape.w) < left || (shape.y + shape.h) < top;
	
		if(shape.body) {
			shape.body.SetAwake(!inVisible);
		}

		if(inVisible) {
			continue;
		}

		shape.paintSelf(canvas);
	}
	
	this.paintTargetShape(canvas);

	return;
}

UIScene.prototype.afterPaintChildren = function(canvas) {
	if(!this.selected || this.mode !== C_MODE_EDITING) {
		return;
	}
	
	var y = 10;
	var w = this.w;
	var h = this.h;
	var text = null;
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

	if(child.widthAttr === C_WIDTH_FILL_PARENT) {
		child.x = 0;
		child.w = vw;
	}
	else if(child.widthAttr === C_WIDTH_FILL_AVAILABLE) {
		child.w = vw - child.x;
	}

	if(child.heightAttr === C_HEIGHT_FILL_PARENT) {
		child.y = 0;
		child.h = vh;
	}
	else if(child.heightAttr === C_HEIGHT_FILL_AVAILABLE) {
		child.h = vh - child.y;
	}

	return;
}

UIScene.prototype.afterChildAppended = function(shape) {
	if(this.mode === C_MODE_EDITING || !this.world) {
		return;
	}

	Physics.createBodyForElement(this.world, this, shape);
}

UIScene.prototype.afterChildRemoved = function(shape) {
	if(this.mode === C_MODE_EDITING || !this.world) {
		return;
	}

	Physics.destroyBodyForElement(this.world, shape);

	this.postRedraw();

	return;
}

UIScene.prototype.translatePoint = function(point) {
	var p = {x : (point.x - this.x + this.xOffset), y : (point.y - this.y + this.yOffset)};

	return p;
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
