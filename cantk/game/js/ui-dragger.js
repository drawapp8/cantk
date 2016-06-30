/*
 * File:   ui-dragger.js
 * Author: Li XianJing <xianjimli@hotmail.com>
 * Brief:  mouse joint, react with pointer event.
 * 
 * Copyright (c) 2014 - 2015  Li XianJing <xianjimli@hotmail.com>
 * Copyright (c) 2015 - 2016  Holaverse Inc.
 * 
 */

/**
 * @class UIDragger
 * @extends UIElement
 * Dragger。把它放到某个控件上，该控件便可被玩家拖动了。
 *
 */

/**
 * @event onDragStart
 * 拖动开始事件。
 */

/**
 * @event onDragEnd
 * 拖动结束事件。
 */

/**
 * @event onDragging
 * 拖动事件。
 */
function UIDragger() {
	return;
}

UIDragger.prototype = new UIElement();
UIDragger.prototype.isUIDragger = true;

UIDragger.prototype.saveProps = ["enableVer", "enableHor"];
UIDragger.prototype.initUIDragger = function(type, w, h) {
	this.initUIElement(type, w, h);	
	this.enableVer = true;
	this.enableHor = true;
	this.addEventNames(["onDragStart", "onDragging", "onDragEnd"]);

	return this;
}

UIDragger.prototype.onInit = function() {
	var parentShape = this.getParent();

	var enableHor = this.enableHor;
	var enableVer = this.enableVer;

	var dragger = this;
	if(parentShape.isUIPhysicsShape || parentShape.isUIImage || parentShape.isUISkeletonAnimation 
		|| parentShape.isUIFrameAnimation || parentShape.isUIScene) {
		parentShape.handlePointerDown = function(point, beforeChild) {
			if(!beforeChild) return;

			dragger.callOnDragStartHandler();
			return UIDragger.handleSpritePointerDown(parentShape, point);	
		}

		parentShape.handlePointerMove = function(point, beforeChild) {
			if(!beforeChild) return;

			if(parentShape.pointerDown) {
				dragger.callOnDraggingHandler();
			}
			return UIDragger.handleSpritePointerMove(parentShape, point, enableVer, enableHor);	
		}

		parentShape.handlePointerUp = function(point, beforeChild) {
			if(!beforeChild) return;

			dragger.callOnDragEndHandler();
			return UIDragger.handleSpritePointerUp(parentShape, point);	
		}
	}
}

UIDragger.handleSpritePointerDown = function(parentShape, point) {
	if(parentShape.isUIScene) {
		parentShape.saveXOffset = parentShape.xOffset;
		parentShape.saveYOffset = parentShape.yOffset;
	}
	else {
		parentShape.saveX  = parentShape.left;
		parentShape.saveY  = parentShape.top;
	}

	return;
}

UIDragger.handleSpritePointerUp = function(parentShape, point) {
}

UIDragger.handleSpritePointerMove = function(parentShape, point, enableVer, enableHor) {
	if(parentShape.pointerDown) {
		var dx = parentShape.getMoveAbsDeltaX();
		var dy = parentShape.getMoveAbsDeltaY();

		if(parentShape.isUIScene) {
			var x = enableHor ? parentShape.saveXOffset - dx : parentShape.saveXOffset;
			var y = enableVer ? parentShape.saveYOffset - dy : parentShape.saveYOffset;
			parentShape.setOffset(x, y);
		}
		else {
			var x = enableHor ? parentShape.saveX + dx : parentShape.saveX;
			var y = enableVer ? parentShape.saveY + dy : parentShape.saveY;
			parentShape.setLeftTop(x, y);
			parentShape.onPositionChanged();
		}
	}

	return;
}

function UIDraggerCreator() {
	var args = ["ui-dragger", "ui-dragger", null, 1];
	
	ShapeCreator.apply(this, args);
	this.createShape = function(createReason) {
		var g = new UIDragger();
		return g.initUIDragger(this.type, 20, 20, null);
	}
	
	return;
}

ShapeFactoryGet().addShapeCreator(new UIDraggerCreator());

